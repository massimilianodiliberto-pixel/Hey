# HEY — Note di regia in overlay (per la revisione con Gianluca)
17/08/2026 — istruzioni per la sessione Claude Code locale su Sito_HEY_v2

**Perché questo documento esiste:** Gianluca non ha seguito la costruzione di
Sito_HEY_v2 e deve valutare il viaggio prima che si generino le clip definitive. Invece
di dargli un PDF separato da leggere a fianco del sito, l'idea è che ogni clip del
viaggio porti sopra di sé una piccola nota — visibile solo in questa fase di review —
che spiega cosa quel pezzo di film deve rappresentare. Lui scrolla il sito segnaposto e
capisce l'intento di ogni transizione mentre la vede, senza dover incrociare due
documenti.

**Questo è temporaneo.** Non è copy del sito, non deve mai arrivare a un cliente o
restare nella versione pubblica. Va costruito in modo che si possa spegnere con un solo
intervento quando la review è finita — vedi §4.

---

## 1. Cosa deve fare la nota

Per ogni clip del viaggio (`intro`, `loop`, `ritorno-inizio`, `ritorno-meta`,
`mondo-smontato`, `arrivo`), mostra una piccola scritta con cosa quella clip deve
raffigurare — non il copy finale ("HEY.", "IDEA."...), che resta come già implementato.
È un secondo livello, solo per chi sta revisionando la costruzione.

- **Aggiornata alla clip attiva**: mentre si scrolla tra le sezioni del viaggio, la nota
  cambia insieme alla scena in scrub — non è un testo fisso sopra tutto il film.
  Per `intro` e `loop` (che non sono guidate dallo scroll) resta visibile per tutta la
  loro durata.
- **Non invadente**: piccola, in un angolo che non è già occupato dall'interfaccia
  esistente del motore (route dots, scrollbar, hint, copy layer a sinistra su desktop /
  in basso su mobile — vedi `scroll-world.js`). Suggerimento: angolo in alto a
  sinistra, sotto la barra lime.
- **Riconoscibile come nota, non come copy**: deve essere inequivocabile che è
  un'annotazione interna e non un elemento del sito finale. Font mono, maiuscolo,
  dimensione ridotta, un prefisso tipo `NOTA REGIA —`, contrasto basso (es. bordo
  tratteggiato o sfondo semi-trasparente scuro, testo in `--gray` `#A8A8A0` non in
  `--lime`, per non essere scambiata per un elemento di brand).

---

## 2. I testi — pronti da incollare, uno per clip

```
intro:
NOTA REGIA — Lei esce dalla colonna (pannello reale sul set), nota il raggio di luce,
lo copre con la mano: nell'ombra appaiono microrganismi luminosi. Si gira verso camera.
Non guarda mai in camera fino alla fine. ~2–4s.

loop:
NOTA REGIA — Primo "HEY", primo contatto visivo. Loop nativo: respiro, bolle, leggero
movimento della testa, dice di nuovo "HEY" dopo una pausa. Deve chiudersi senza scatto
visibile. ~4–6s.

ritorno-inizio:
NOTA REGIA — Si rivela il mondo impossibile: rovine, colonne/torri, microrganismi
ovunque nell'acqua. Comincia il reverse — i microrganismi spariscono, l'architettura
perde dettaglio. ~3–6s.

ritorno-meta:
NOTA REGIA — L'acqua si svuota, appare la vasca reale. Il raggio che sembrava sole si
rivela un faro vero, definito e controllabile. ~3–6s.

mondo-smontato:
NOTA REGIA — Il set asciutto rivela luci e rig, il carrello circolare della camera
diventa visibile. La camera viene vista — la spia REC si spegne — e appoggiata sul
banco. ~3–6s.

arrivo:
NOTA REGIA — Reverse rapido di preparazione, styling, arrivo dell'attrice, fino al set
completamente vuoto. Non è assenza: è lo spazio prima della prossima idea. ~3–6s.
```

Se nel frattempo hai già aggiunto uno o più `connector-XX`, stesso trattamento — i
contenuti sono in `HEY_Reference_Prompts_Viaggio.md` §6.

---

## 3. Dove vive il testo — manifest, non hardcoded

Stesso principio già in uso nel resto del progetto (§6.1 del Master Context): niente
scritto a mano nel codice del motore. Aggiungi un campo nuovo, distinto da `title` /
`eyebrow` (quelli sono copy reale, questo no) — ad es. `directorNote` — a ogni sezione
di `world-manifest.json`, e uno anche nell'oggetto `intro`. Un piccolo script separato
(non dentro `scroll-world.js`, che resta vendorizzato/intonso) legge la sezione
attualmente in scrub e aggiorna il testo della nota — puoi agganciarti allo stesso
meccanismo che già usi per `loopIdle` / la sezione attiva in `home.js`, senza toccare il
motore vendorizzato.

---

## 4. Interruttore unico — deve sparire in un solo passaggio

Prevedi un flag solo, tipo `"reviewNotes": true` in cima a `world-manifest.json` (accanto
a `"placeholder": true`, che già esiste con lo stesso spirito). Quando la review con
Gianluca è chiusa, si mette `false` — o si rimuove l'intero blocco — e le note
scompaiono senza toccare nient'altro. Non deve essere necessario cercare e cancellare
markup sparso in più file.

---

## 5. Nota di contesto per Gianluca

Vale la pena una riga, visibile una sola volta all'ingresso del sito (non ripetuta per
ogni clip, altrimenti diventa rumore): qualcosa come *"Le note in overlay descrivono
l'intento di ogni scena — le clip qui sono segnaposto, non il girato finale."* — stesso
tono onesto già usato nel banner placeholder attuale, non promozionale.
