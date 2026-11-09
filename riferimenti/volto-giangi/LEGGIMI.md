# Volto di Giangi: foto di riferimento

Foto vere inviate da Massimiliano il 09/11/2026: schermate dei post Instagram di Giangi, ritagliate senza la barra del telefono.

- `giangi-volto-primo-piano.jpg`: **da usare** per la sagoma del volto. Primo piano su fondo nero, luce laterale forte, sguardo in camera: è adatta a ricavare la nuvola di punti (luminanza + profondità).
- `giangi-mezzo-busto-rosso.jpg`: solo di riserva (occhiali da sole, volto piccolo, fondo rosso).

Attenzione:
- è una schermata a bassa risoluzione (924 px di larghezza); per le particelle basta, ma la foto non va pubblicata così com'è;
- non è una foto da mostrare: serve solo come fonte per i punti;
- Giangi vede il risultato sull'anteprima prima di qualsiasi pubblicazione.

## Maglia 3D (maglia.json)
Ricavata una volta con MediaPipe Face Landmarker (modello face_landmarker.task, float16) dalla foto in primo piano: 478 punti 3D e le connessioni della maglia. Per rifarla serve un ambiente Python con `mediapipe` e le librerie EGL; poi `python3 scripts/volto.py` (solo numpy e Pillow) genera `public/volto/volto.bin`.
