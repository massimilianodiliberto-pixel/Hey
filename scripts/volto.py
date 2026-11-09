"""Volto di Giangi: dalla foto a una nuvola di punti e linee, precalcolata.

La foto resta in riferimenti/ e non viene pubblicata: il sito riceve solo public/volto/volto.bin.
Uso:  python3 scripts/volto.py

Formato di volto.bin (little endian):
  uint32 nPunti, uint32 nSegmenti
  nPunti    x int16[4]  (x, y, z, luce)          coordinate in [-1, 1] * 32767, luce in [0, 1] * 32767
  nSegmenti x int16[6]  (x1, y1, z1, x2, y2, z2) le linee di livello della luce, come curve di un rilievo
I punti sono mescolati: il sito ne usa solo i primi su telefono.
"""
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "riferimenti/volto-giangi/giangi-volto-primo-piano.jpg"
OUT = ROOT / "public/volto/volto.bin"
N_POINTS = 14000
LEVELS = [0.36, 0.54, 0.72]
rng = np.random.default_rng(7)

im = Image.open(SRC).convert("L")
im = im.crop((0, 0, 924, 1180))  # volto e collo, senza la giacca
W, H = im.size
lum = np.asarray(im, dtype=np.float32) / 255.0
soft = np.asarray(im.filter(ImageFilter.GaussianBlur(9)), dtype=np.float32) / 255.0

# Centro e scala: il volto sta nell'unità, l'altezza della foto va da -1 a 1.
cx, cy = 520.0, 560.0
S = H / 2.0


def to_xyz(px, py, l):
    x = (px - cx) / S
    y = -(py - cy) / S
    # Rilievo: una cupola ellittica per la testa più la luce, che spinge in avanti le parti illuminate.
    r2 = (x / 0.62) ** 2 + (y / 0.85) ** 2
    dome = np.sqrt(np.clip(1.0 - r2, 0.0, 1.0))
    z = 0.32 * dome + 0.16 * l
    return x, y, z


# --- punti: più densi dove c'è luce e dove c'è un contorno
gy, gx = np.gradient(soft)
edge = np.sqrt(gx * gx + gy * gy)
edge /= edge.max()
w = np.clip(lum - 0.1, 0, None) ** 1.4 + 1.6 * edge * (lum > 0.08)
w = w.ravel() / w.sum()
idx = rng.choice(w.size, size=N_POINTS, replace=False, p=w)
py, px = np.divmod(idx, W)
px = px + rng.random(N_POINTS)
py = py + rng.random(N_POINTS)
l = lum.ravel()[idx]
x, y, z = to_xyz(px, py, soft.ravel()[idx])
pts = np.stack([x, y, z, l], axis=1)
rng.shuffle(pts)

# --- linee di livello (marching squares su una griglia rada della luce sfocata)
STEP = 6
g = soft[::STEP, ::STEP]
gh, gw = g.shape
segs = []
for level in LEVELS:
    b = (g >= level).astype(np.uint8)
    for j in range(gh - 1):
        for i in range(gw - 1):
            c = b[j, i] | (b[j, i + 1] << 1) | (b[j + 1, i + 1] << 2) | (b[j + 1, i] << 3)
            if c in (0, 15):
                continue
            v = (g[j, i], g[j, i + 1], g[j + 1, i + 1], g[j + 1, i])

            def lerp(a, bb, ea, eb):
                t = (level - ea) / (eb - ea + 1e-6)
                return (a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t)

            P = ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))
            e = {
                0: lerp(P[0], P[1], v[0], v[1]),
                1: lerp(P[1], P[2], v[1], v[2]),
                2: lerp(P[2], P[3], v[2], v[3]),
                3: lerp(P[3], P[0], v[3], v[0]),
            }
            table = {
                1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 0), (1, 2)], 6: [(0, 2)],
                7: [(3, 2)], 8: [(2, 3)], 9: [(0, 2)], 10: [(0, 1), (2, 3)], 11: [(1, 2)], 12: [(1, 3)],
                13: [(0, 1)], 14: [(3, 0)],
            }
            for a, bb in table[c]:
                (x1, y1), (x2, y2) = e[a], e[bb]
                segs.append((x1 * STEP, y1 * STEP, x2 * STEP, y2 * STEP, level))
segs = np.array(segs, dtype=np.float32)
# tiene una linea su due, mescolate: bastano poche curve per dare il rilievo
rng.shuffle(segs)
segs = segs[: len(segs) * 3 // 4]
x1, y1, z1 = to_xyz(segs[:, 0], segs[:, 1], segs[:, 4])
x2, y2, z2 = to_xyz(segs[:, 2], segs[:, 3], segs[:, 4])
seg = np.stack([x1, y1, z1 + 0.004, x2, y2, z2 + 0.004], axis=1)


def q(a):
    return np.clip(np.round(a * 32767), -32767, 32767).astype("<i2")


OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "wb") as f:
    f.write(struct.pack("<II", len(pts), len(seg)))
    f.write(q(pts).tobytes())
    f.write(q(seg).tobytes())
print(f"{len(pts)} punti, {len(seg)} segmenti, {OUT.stat().st_size // 1024} KB -> {OUT.relative_to(ROOT)}")
