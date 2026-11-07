# HEY — Spec tecnica delle clip del viaggio (v2)
Cosa serve per sostituire i placeholder nel sito con le clip vere.
Aggiornato: 17/08/2026

---

## Struttura confermata (v2)

Il viaggio non parte più direttamente in loop. La sequenza è:

1. **INTRO** — clip una tantum, non in loop, non guidata dallo scroll. Gira una
   sola volta quando si apre il sito: la donna esce e si svela da dietro la
   colonna. Appena finisce, dissolve nel loop (0.7s di fade, già costruito).
2. **LOOP** — la prima clip guidata dallo scroll, ma gira in loop nativo
   (respiro, bolle, capelli, dice "HEY") finché l'utente non inizia a
   scrollare. Nel momento stesso in cui scrolla anche di un solo pixel, il
   controllo passa allo scrub normale — il loop non si riattiva mai più, anche
   tornando in cima.
3. **IL RITORNO A RITROSO** — le 4 clip guidate dallo scroll, come già
   costruite: ritorno-inizio (IDEA) → ritorno-meta (DIRECTION) →
   mondo-smontato (PRODUCTION) → arrivo (YOUR IDEA).
4. **CONNETTORI** — 4 clip opzionali di raccordo tra una tappa e l'altra del
   ritorno (non tra intro/loop, quelli hanno una dissolvenza propria). Se non
   ci sono, il motore dissolve direttamente da una clip all'altra: si può
   partire senza, aggiungerli dopo non richiede nessuna modifica al sito.

---

## Quante clip mi servono, e come chiamarle

| # | Nome file esatto | Obbligatoria | Contenuto |
|---|---|---|---|
| 1 | `intro.mp4` | consigliata, non bloccante | La donna esce/si svela da dietro la colonna |
| 2 | `loop.mp4` | **sì** | Lei ci guarda, dice "HEY", loop sottile (respiro/bolle/capelli) |
| 3 | `ritorno-inizio.mp4` | **sì** | Il mondo impossibile inizia a semplificarsi |
| 4 | `ritorno-meta.mp4` | **sì** | Primi elementi reali: piastrelle, vasca |
| 5 | `mondo-smontato.mp4` | **sì** | Il set vero: luci, attrezzatura, crew fuori fuoco |
| 6 | `arrivo.mp4` | **sì** | Il set vuoto, in attesa |
| 7 | `connector-01.mp4` | opzionale | Raccordo loop → ritorno-inizio |
| 8 | `connector-02.mp4` | opzionale | Raccordo ritorno-inizio → ritorno-meta |
| 9 | `connector-03.mp4` | opzionale | Raccordo ritorno-meta → mondo-smontato |
| 10 | `connector-04.mp4` | opzionale | Raccordo mondo-smontato → arrivo |

**Minimo per partire: le 6 clip obbligatorie (1-6).** I connettori si possono
aggiungere in qualunque momento dopo.

Nomi in minuscolo, esattamente come in tabella — sono quelli che il manifest
del sito (`assets/world/world-manifest.json`) già si aspetta.

---

## Cosa NON serve che tu mi mandi

- **Nessuna immagine/still separata.** Estraggo io il primo fotogramma da ogni
  clip via ffmpeg per il poster.
- **Nessuna versione mobile.** Derivo io un encode più leggero (~720p) da ogni
  master.
- **Nessuna conversione tua per il web.** Mandami il file migliore che hai —
  anche l'export grezzo di Kling/Higgsfield/ChatGPT o un ProRes da montaggio —
  penso io alla codifica finale H.264 con i parametri sotto. Se però riesci
  già a esportare secondo questa spec, meglio: un passaggio in meno.

---

## Specifica di esportazione (target finale — se puoi rispettarla direttamente)

| Parametro | Valore |
|---|---|
| Contenitore | MP4 |
| Codec video | H.264 (AVC), profilo High, `yuv420p` |
| Audio | **nessuno** (traccia audio assente, non solo muta) |
| Frame rate | **30 fps** progressivi (24 fps accettabile se è il nativo della generazione, ma 30 scrubba più morbido) |
| Risoluzione | **1920×1080 minimo**, 16:9. Se la fonte è più alta (2K/4K) mandala pure a quella risoluzione: la scalo io, meglio avere margine che pixel visibili |
| GOP | keyframe ogni 8 frame (`-g 8`) — **importante**, è quello che rende fluido lo scrub. Se non sai impostarlo in esportazione, non è un problema: lo forzo io in re-encode |
| Qualità | CRF ~18–20 (equivalente: bitrate alto, indicativamente 8–12 Mbps a 1080p30) |
| `faststart` | moov atom in testa — anche questo lo posso sistemare io in post se il tuo tool non lo permette |
| Colore | Rec.709, no HDR |

Se il tuo strumento di generazione non ti fa scegliere questi parametri uno a
uno, non preoccuparti: mandami il file com'è, alla risoluzione più alta
disponibile, e faccio io il passaggio finale.

---

## Durata indicativa per tipo di clip

| Clip | Durata | Frame (a 30fps) | Note |
|---|---|---|---|
| `intro.mp4` | 2–4s | 60–120 | Un solo gesto direzionale (uscire da dietro la colonna), non deve loopare |
| `loop.mp4` | 4–6s | 120–180 | **Deve chiudere il cerchio in modo pulito**: l'ultimo fotogramma deve poter tagliare sul primo senza scatto visibile (stesso punto del respiro/bolle, o comunque un movimento abbastanza sottile da non far notare il taglio) |
| `ritorno-*.mp4` / `arrivo.mp4` (4 clip) | 3–6s ciascuna | 90–180 | Abbastanza materiale perché scrollando lentamente si percepisca la trasformazione, non un flash |
| `connector-*.mp4` (opzionali) | 1.5–2.5s | 45–75 | Più leggere: sono un breve "volo" tra una tappa e l'altra, non una scena a sé |

Queste sono indicazioni, non vincoli rigidi — il motore si adatta a qualunque
durata reale del file (lo scroll mappa sempre 0–100% della clip, qualunque
sia la sua lunghezza in secondi).

---

## Nota sul taglio loop → ritorno-inizio

Il Master Context lo segnalava già: nel momento in cui l'utente inizia a
scrollare, si passa dal loop nativo allo scrub — è un taglio secco per
costruzione (il loop può fermarsi in un punto qualsiasi del suo ciclo). Non è
un bug da correggere in fase di generazione: si può mascherare in post con un
micro-flash o blur di 150–250ms proprio all'inizio di `ritorno-inizio.mp4`,
oppure lasciarlo com'è se il salto risulta comunque discreto — lo valutiamo
appena ho le clip vere davanti.
