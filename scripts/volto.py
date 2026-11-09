"""Volto di Giangi: punti e linee presi dalla foto, con la profondità vera della maglia 3D.

Lo stile e i tratti vengono dalla foto (come nella prima versione): punti dove c'è luce e contorno,
linee di livello della luminanza. La maglia MediaPipe (riferimenti/volto-giangi/maglia.json) è solo uno
stampo invisibile: dà a ogni punto la sua z. Fuori dalla maglia (capelli, orecchio, collo) la profondità
prosegue su un ellissoide raccordato al bordo del volto.

Lato in ombra: i punti del lato illuminato vengono specchiati sul piano di simmetria del volto (trovato
dalle coppie di punti della maglia) e tenuti solo dove la foto è buia, cioè dove manca l'informazione.
La cucitura cade sulla linea del naso.

La foto resta in riferimenti/ e non viene pubblicata.  Uso: python3 scripts/volto.py

Formato di public/volto/volto-3d.bin (little endian):
  uint32 nPunti, uint32 nSegmenti
  nPunti    x int16[4]  (x, y, z, luce)    coordinate / QSCALE * 32767, luce * 32767
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
OUT = ROOT / "public/volto/volto-3d.bin"
N_POINTS = 15000
LEVELS = [0.36, 0.54, 0.72]
QSCALE = 2.4
rng = np.random.default_rng(7)

photo = Image.open(REF / "giangi-volto-primo-piano.jpg").convert("L")
CROP_H = 1180  # volto e collo, senza la giacca
photo = photo.crop((0, 0, photo.size[0], CROP_H))
W, H = photo.size
lum = np.asarray(photo, dtype=np.float32) / 255.0
soft = np.asarray(photo.filter(ImageFilter.GaussianBlur(9)), dtype=np.float32) / 255.0

mesh = json.load(open(REF / "maglia.json"))
Lm = np.array(mesh["landmarks"], dtype=np.float64)[:468]
FULL_H = 1656  # la maglia è stata calcolata sulla foto intera
mx, my, mz = Lm[:, 0] * W, Lm[:, 1] * FULL_H, -Lm[:, 2] * W  # z verso chi guarda, in pixel

# --- mappa di profondità: la maglia rasterizzata nella foto
edges = {tuple(sorted(e)) for e in mesh["FACE_LANDMARKS_TESSELATION"]}
adj = {}
for a, b in edges:
    adj.setdefault(a, set()).add(b)
    adj.setdefault(b, set()).add(a)
tris = np.array(sorted({tuple(sorted((a, b, c))) for a, b in edges for c in adj[a] & adj[b]}))
depth = np.full((H, W), np.nan, dtype=np.float32)
for t in tris:
    xs, ys, zs = mx[t], my[t], mz[t]
    x0, x1 = int(max(0, np.floor(xs.min()))), int(min(W - 1, np.ceil(xs.max())))
    y0, y1 = int(max(0, np.floor(ys.min()))), int(min(H - 1, np.ceil(ys.max())))
    if x1 < x0 or y1 < y0:
        continue
    gx, gy = np.meshgrid(np.arange(x0, x1 + 1), np.arange(y0, y1 + 1))
    d = (ys[1] - ys[2]) * (xs[0] - xs[2]) + (xs[2] - xs[1]) * (ys[0] - ys[2])
    if abs(d) < 1e-9:
        continue
    a = ((ys[1] - ys[2]) * (gx - xs[2]) + (xs[2] - xs[1]) * (gy - ys[2])) / d
    b = ((ys[2] - ys[0]) * (gx - xs[2]) + (xs[0] - xs[2]) * (gy - ys[2])) / d
    c = 1 - a - b
    inside = (a >= 0) & (b >= 0) & (c >= 0)
    z = a * zs[0] + b * zs[1] + c * zs[2]
    cur = depth[y0 : y1 + 1, x0 : x1 + 1]
    upd = inside & (np.isnan(cur) | (z > cur))
    cur[upd] = z[upd]
inmesh = ~np.isnan(depth)

# fuori dalla maglia: un ellissoide (la testa) raccordato al bordo del volto
oval = sorted({i for e in mesh["FACE_LANDMARKS_FACE_OVAL"] for i in e})
ex0, ey0 = mx[oval].mean(), my[oval].mean() - 40
rx = (mx[oval].max() - mx[oval].min()) / 2 * 1.25
ry = (my[oval].max() - my[oval].min()) / 2 * 1.2
gx, gy = np.meshgrid(np.arange(W), np.arange(H))
r2 = ((gx - ex0) / rx) ** 2 + ((gy - ey0) / ry) ** 2
ell = rx * 0.9 * np.sqrt(np.clip(1 - r2, 0, 1))
edge_zone = inmesh & (r2 > 0.35)
offset = np.nanmean(depth[edge_zone] - ell[edge_zone])


def boxblur(a, k):
    kk = np.ones(k) / k
    a = np.apply_along_axis(lambda r: np.convolve(r, kk, mode="same"), 1, a)
    return np.apply_along_axis(lambda r: np.convolve(r, kk, mode="same"), 0, a)


# raccordo senza gradino: lo scarto tra maglia ed ellissoide si propaga fuori dalla maglia e sfuma
diff = np.where(inmesh, np.nan_to_num(depth) - ell, 0.0)
wsum = boxblur(inmesh.astype(np.float64), 61)
dsum = boxblur(diff, 61)
local = np.where(wsum > 0.02, dsum / np.maximum(wsum, 1e-6), offset)
blendw = np.clip(wsum * 2.5, 0, 1)
fill = ell + local * blendw + offset * (1 - blendw)
# collo e spalle: scendono dolcemente dietro il mento
fill = np.where(r2 > 1, offset - 30 * np.sqrt(np.clip(r2 - 1, 0, None)), fill)
Z = np.where(inmesh, depth, fill)
Z = boxblur(Z, 9)  # niente scalini al bordo

# --- piano di simmetria del volto (dalle coppie della maglia)
P3 = np.stack([mx, my, mz], axis=1)
R_EYE, L_EYE, BRIDGE = 33, 263, 168
n = P3[L_EYE] - P3[R_EYE]
n /= np.linalg.norm(n)
nose = [1, 2, 4, 5, 6, 8, 9, 10, 151, 152, 168, 197, 195]
c0 = P3[nose].mean(axis=0)


def mirror(p):
    return p - 2 * ((p - c0) @ n)[:, None] * n[None, :]


# --- coordinate finali: centro e scala come la prima versione, y in su
cx, cy = 520.0, 560.0
S = H / 2.0


def to_out(p):
    return np.stack([(p[:, 0] - cx) / S, -(p[:, 1] - cy) / S, (p[:, 2] - offset) / S], axis=1)


def zat(px, py):
    return Z[np.clip(py.astype(int), 0, H - 1), np.clip(px.astype(int), 0, W - 1)]


# --- punti: dove c'è luce e dove c'è un contorno (lo stile della prima versione)
gyy, gxx = np.gradient(soft)
edge = np.sqrt(gxx * gxx + gyy * gyy)
edge /= edge.max()
w = np.clip(lum - 0.1, 0, None) ** 1.4 + 1.6 * edge * (lum > 0.08)
# i capelli sfumano verso il bordo alto della foto invece di finire tagliati
w *= np.clip(np.arange(H)[:, None] / 140.0, 0, 1) ** 1.5
w = w.ravel() / w.sum()
idx = rng.choice(w.size, size=N_POINTS, replace=False, p=w)
py, px = np.divmod(idx, W)
px = px + rng.random(N_POINTS)
py = py + rng.random(N_POINTS)
light = lum.ravel()[idx]
p3 = np.stack([px, py, zat(px, py)], axis=1)

# lato in ombra: specchia i punti illuminati del volto e tienili solo dove la foto è buia
# solo il volto vero (la maglia, un po' rientrata): il contorno della mascella non va specchiato
inner = boxblur(inmesh.astype(np.float64), 25) > 0.97
on_face = inner[py.astype(int), px.astype(int)]
mp = mirror(p3[on_face])
ml = light[on_face]
ix, iy = mp[:, 0], mp[:, 1]
ok = (ix >= 0) & (ix < W) & (iy >= 0) & (iy < H)
dark = np.zeros(len(mp), bool)
dark[ok] = soft[iy[ok].astype(int), ix[ok].astype(int)] < 0.16
# cucitura: vicino alla linea del naso i punti specchiati sfumano
side = (mp - c0) @ n
fade = np.clip(np.abs(side) / 25.0, 0, 1)
keep = dark & (rng.random(len(mp)) < fade)
mp, ml = mp[keep], ml[keep] * 0.8

pts = np.concatenate([np.c_[to_out(p3), light], np.c_[to_out(mp), ml]])
rng.shuffle(pts)

# --- linee di livello della luce, portate sulla profondità
STEP = 6
g = soft[::STEP, ::STEP]
gh, gw = g.shape
TABLE = {1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 0), (1, 2)], 6: [(0, 2)], 7: [(3, 2)], 8: [(2, 3)],
         9: [(0, 2)], 10: [(0, 1), (2, 3)], 11: [(1, 2)], 12: [(1, 3)], 13: [(0, 1)], 14: [(3, 0)]}
raw = []
for level in LEVELS:
    bmask = (g >= level).astype(np.uint8)
    for j in range(gh - 1):
        for i in range(gw - 1):
            cc = bmask[j, i] | (bmask[j, i + 1] << 1) | (bmask[j + 1, i + 1] << 2) | (bmask[j + 1, i] << 3)
            if cc in (0, 15):
                continue
            v = (g[j, i], g[j, i + 1], g[j + 1, i + 1], g[j + 1, i])
            Pq = ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))

            def lerp(k1, k2):
                t = (level - v[k1]) / (v[k2] - v[k1] + 1e-6)
                return (Pq[k1][0] + (Pq[k2][0] - Pq[k1][0]) * t, Pq[k1][1] + (Pq[k2][1] - Pq[k1][1]) * t)

            E = {0: lerp(0, 1), 1: lerp(1, 2), 2: lerp(2, 3), 3: lerp(3, 0)}
            for a, b in TABLE[cc]:
                raw.append((E[a][0] * STEP, E[a][1] * STEP, E[b][0] * STEP, E[b][1] * STEP))
raw = np.array(raw, dtype=np.float64)
raw = raw[(raw[:, 1] > 70) & (raw[:, 3] > 70)]  # niente linee sul bordo alto tagliato
rng.shuffle(raw)
raw = raw[: len(raw) * 3 // 4]
A = np.stack([raw[:, 0], raw[:, 1], zat(raw[:, 0], raw[:, 1])], axis=1)
B = np.stack([raw[:, 2], raw[:, 3], zat(raw[:, 2], raw[:, 3])], axis=1)
segs = np.concatenate([to_out(A), to_out(B)], axis=1)
segs[:, [2, 5]] += 0.004


def q(a):
    return np.clip(np.round(a / QSCALE * 32767), -32767, 32767).astype("<i2")


OUT.parent.mkdir(parents=True, exist_ok=True)
pq = np.c_[q(pts[:, :3]), np.clip(np.round(pts[:, 3] * 32767), 0, 32767).astype("<i2")].astype("<i2")
with open(OUT, "wb") as f:
    f.write(struct.pack("<II", len(pq), len(segs)))
    f.write(pq.tobytes())
    f.write(q(segs).tobytes())
print(f"{len(pts)} punti ({keep.sum()} ricostruiti nel lato in ombra), {len(segs)} segmenti, {OUT.stat().st_size // 1024} KB")
print("z range", pts[:, 2].min().round(2), pts[:, 2].max().round(2))
