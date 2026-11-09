"""Volto di Giangi in 3D: dalla foto a una nuvola di punti e linee, precalcolata.

Due passi:
1. (una volta, già fatto) MediaPipe Face Landmarker sulla foto -> riferimenti/volto-giangi/maglia.json
   478 punti 3D del volto e le connessioni della maglia. Serve un ambiente con mediapipe; vedi LEGGIMI.
2. questo script (solo numpy + Pillow): python3 scripts/volto.py -> public/volto/volto.bin

La foto resta in riferimenti/ e non viene pubblicata.

Ricostruzione:
- la maglia viene portata in posa frontale (occhi orizzontali, mento-fronte verticale, naso verso chi guarda);
- metà volto è in ombra: si tiene il lato illuminato e lo si specchia sul piano di simmetria, con la luce
  presa dalla foto. La cucitura cade sulla linea del naso, dove i due lati coincidono;
- dietro il volto un guscio rado per la testa, così quando si gira non si vede il vuoto;
- linee: sezioni orizzontali della maglia (come curve di livello di una scultura) e i contorni di occhi,
  sopracciglia e labbra, tutti simmetrici.

Formato di volto.bin (little endian):
  uint32 nPunti, uint32 nSegmenti
  nPunti    x int16[4]  (x, y, z, luce)      coordinate in unità di volto (altezza ~2) / 2.4 * 32767
  nSegmenti x int16[6]  (x1, y1, z1, x2, y2, z2)
I punti sono mescolati: il telefono usa solo i primi.
"""
import json
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "riferimenti/volto-giangi"
OUT = ROOT / "public/volto/volto.bin"
N_FACE = 13000
N_SHELL = 3400
SLICES = 11
QSCALE = 2.4  # le coordinate stanno in [-2.4, 2.4]
rng = np.random.default_rng(11)

mesh = json.load(open(REF / "maglia.json"))
photo = Image.open(REF / "giangi-volto-primo-piano.jpg").convert("L")
W, H = photo.size
lum = np.asarray(photo.filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255.0

Lm = np.array(mesh["landmarks"], dtype=np.float64)[:468]  # senza iridi
img2d = np.stack([Lm[:, 0] * W, Lm[:, 1] * H], axis=1)  # posizione nella foto, per la luce
P = np.stack([Lm[:, 0] * W, Lm[:, 1] * H, Lm[:, 2] * W], axis=1)
P[:, 1] *= -1  # y in su
P[:, 2] *= -1  # z verso chi guarda

# --- posa frontale
R_EYE, L_EYE, CHIN, FOREHEAD, BRIDGE = 33, 263, 152, 10, 168
ex = P[L_EYE] - P[R_EYE]
ex /= np.linalg.norm(ex)
ey = P[FOREHEAD] - P[CHIN]
ey -= ex * ey.dot(ex)
ey /= np.linalg.norm(ey)
ez = np.cross(ex, ey)
if (P[1] - P[BRIDGE]).dot(ez) < 0:  # la punta del naso (1) deve venire verso di noi
    ez = -ez
Rm = np.stack([ex, ey, ez])
F = (P - P[BRIDGE]) @ Rm.T
scale = np.linalg.norm(F[FOREHEAD] - F[CHIN]) / 2.0  # altezza del volto = 2
F /= scale
F[:, 1] += 0.15  # centra un po' più in basso del ponte del naso
F[:, 0] -= np.median(F[[1, 2, 4, 5, 6, 8, 9, 10, 151, 152, 168, 197, 195], 0])  # la linea del naso su x = 0

# --- simmetria: per ogni punto il suo gemello specchiato
mirror = F * np.array([-1, 1, 1])
twin = np.array([np.argmin(np.linalg.norm(F - m, axis=1)) for m in mirror])
Fs = (F + F[twin] * np.array([-1, 1, 1])) / 2.0  # maglia resa simmetrica

# triangoli dalla maglia: terne di spigoli che si chiudono
edges = {tuple(sorted(e)) for e in mesh["FACE_LANDMARKS_TESSELATION"]}
adj = {}
for a, b in edges:
    adj.setdefault(a, set()).add(b)
    adj.setdefault(b, set()).add(a)
tris = set()
for a, b in edges:
    for c in adj[a] & adj[b]:
        tris.add(tuple(sorted((a, b, c))))
tris = np.array(sorted(tris))

# lato illuminato: dove la foto è più chiara in media
side_light = [lum[np.clip(img2d[F[:, 0] * s > 0.05, 1].astype(int), 0, H - 1), np.clip(img2d[F[:, 0] * s > 0.05, 0].astype(int), 0, W - 1)].mean() for s in (-1, 1)]
LIT = -1 if side_light[0] > side_light[1] else 1


def sample_tris(Fm, tri, n):
    A = Fm[tri[:, 0]]
    B = Fm[tri[:, 1]]
    Cc = Fm[tri[:, 2]]
    area = np.linalg.norm(np.cross(B - A, Cc - A), axis=1)
    k = rng.choice(len(tri), size=n, p=area / area.sum())
    u = rng.random(n)
    v = rng.random(n)
    flip = u + v > 1
    u[flip], v[flip] = 1 - u[flip], 1 - v[flip]
    w = 1 - u - v
    pos = A[k] * w[:, None] + B[k] * u[:, None] + Cc[k] * v[:, None]
    i2 = img2d[tri[k, 0]] * w[:, None] + img2d[tri[k, 1]] * u[:, None] + img2d[tri[k, 2]] * v[:, None]
    light = lum[np.clip(i2[:, 1].astype(int), 0, H - 1), np.clip(i2[:, 0].astype(int), 0, W - 1)]
    return pos, light


# punti sul lato illuminato (con un margine oltre la linea del naso), poi specchiati
lit_tris = tris[(Fs[tris].mean(axis=1)[:, 0] * LIT) > -0.04]
pos, light = sample_tris(F, lit_tris, N_FACE)
keep = pos[:, 0] * LIT > -0.02
pos, light = pos[keep], light[keep]
# la luce della foto disegna i tratti: dove è buio (occhi, sopracciglia, ombre) restano pochi punti
light = np.clip((light - 0.08) / 0.72, 0, 1) ** 1.5
keep = rng.random(len(light)) < 0.12 + 0.88 * light
pos, light = pos[keep], light[keep]
take = min(len(pos), N_FACE // 2)
pos, light = pos[:take], light[:take]
mpos = pos * np.array([-1, 1, 1])
mlight = light * 0.82  # il lato ricostruito resta appena più in ombra
face_pts = np.concatenate([np.c_[pos, light], np.c_[mpos, mlight]])

# --- guscio della testa: un ellissoide rado dietro e sopra il volto
oval = sorted({i for e in mesh["FACE_LANDMARKS_FACE_OVAL"] for i in e})
ov = Fs[oval]
cx, cy = 0.0, ov[:, 1].mean() + 0.12
rx = (ov[:, 0].max() - ov[:, 0].min()) / 2 * 1.0
ry = (ov[:, 1].max() - ov[:, 1].min()) / 2 * 1.08
side = np.abs(ov[:, 0]) > 0.8 * rx
cz = ov[side, 2].mean()  # i lati dell'ellissoide coincidono con i lati del volto: un solo volume
rz = rx * 1.3
sh = []
while len(sh) < N_SHELL:
    d = rng.normal(size=3)
    d /= np.linalg.norm(d)
    if d[2] > 0.0 and not (d[1] > 0.6 and d[2] < 0.45):  # davanti c'è il volto; sopra la fronte i capelli
        continue
    if d[1] < -0.55:  # niente sotto il mento
        continue
    p = np.array([cx + d[0] * rx, cy + d[1] * ry, cz + d[2] * (rz if d[2] < 0 else rx * 0.9)])
    # sopra: i capelli grigi di Giangi, chiari e fitti; dietro e ai lati solo un velo
    hair = max(0.0, min(1.0, (d[1] - 0.05) / 0.4))
    if hair < 0.05 and rng.random() < 0.55:
        continue
    sh.append([*p, 0.12 + 0.2 * rng.random() + hair * (0.35 + 0.3 * rng.random())])
face_pts = np.concatenate([face_pts, np.array(sh)])
rng.shuffle(face_pts)

# --- linee: sezioni orizzontali della maglia simmetrica + contorni dei tratti
segs = []
ys = np.linspace(Fs[:, 1].min() + 0.08, Fs[:, 1].max() - 0.08, SLICES)
for c in ys:
    for t in tris:
        a, b, d = Fs[t]
        pts = []
        for p, q in ((a, b), (b, d), (d, a)):
            if (p[1] - c) * (q[1] - c) < 0:
                s = (c - p[1]) / (q[1] - p[1])
                pts.append(p + (q - p) * s)
        if len(pts) == 2:
            segs.append([*pts[0], *pts[1]])
for key in ["FACE_LANDMARKS_LEFT_EYE", "FACE_LANDMARKS_RIGHT_EYE", "FACE_LANDMARKS_LEFT_EYEBROW", "FACE_LANDMARKS_RIGHT_EYEBROW", "FACE_LANDMARKS_LIPS"]:
    for a, b in mesh[key]:
        if a < 468 and b < 468:
            segs.append([*Fs[a], *Fs[b]])
segs = np.array(segs)
segs[:, [2, 5]] += 0.006  # appena sopra la pelle di punti


def q(a):
    return np.clip(np.round(a / QSCALE * 32767), -32767, 32767).astype("<i2")


pts_q = np.c_[q(face_pts[:, :3]), np.clip(np.round(face_pts[:, 3] * 32767), 0, 32767).astype("<i2")]
OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "wb") as f:
    f.write(struct.pack("<II", len(pts_q), len(segs)))
    f.write(pts_q.astype("<i2").tobytes())
    f.write(q(segs).tobytes())
print(f"lato illuminato x{'<' if LIT < 0 else '>'}0 · {len(face_pts)} punti · {len(segs)} segmenti · {OUT.stat().st_size // 1024} KB")
