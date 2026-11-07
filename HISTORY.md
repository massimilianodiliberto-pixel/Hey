# HISTORY — sito HEY (branch hey-site-v4)

Da leggere per primo alla ripresa. Una voce per blocco, la più recente in alto.

## 07/11/2026 — Blocco 1: pulizia
Decisioni arrivate dalla regia (Massimiliano): home = viaggio v3; menu Work/System/About/Network/Contact;
fasce lime restano; moduli = mailto con `EMAIL-DA-CONFERMARE`; "Verona" via; "oltre quarant'anni" resta.
- Font in locale (`assets/fonts/`, solo i 6 pesi usati, licenze OFL): nessuna richiesta esterna.
- Note di regia solo con `?review` nell'indirizzo; su telefono una sola nota corta.
- Bottoni del viaggio come `.btn` (rettangolari, mono); etichette dei punti a destra nel font del sito
  e con i titoli pubblici (prima mostravano i nomi di lavorazione, tipo "Loop (HEY)").
- Telefono: la sezione finale sta tutta nello schermo sotto la nav; nav a fondo pieno a fine viaggio
  e nelle pagine interne; fascia in basso su due righe invece che tagliata.
- La scritta "HEY / THE IDEA" era una filigrana dentro la reference `ritorno-meta.jpg` (non nel codice):
  tolta dall'immagine e rigenerato il micro-loop `hover/ritorno-meta.mp4` dalla still pulita (ffmpeg).
- Moduli Contact e Network: aprono la mail con oggetto e testo pronti. Indirizzo in un solo punto,
  `HEY_CONFIG` in cima a `assets/js/site.js`, riempie anche la fascia in basso.
- "Verona" tolto da footer e fascia. Agenti in `.claude/agents/`.
- Collaudo: console pulita, nessun 404, nessuna richiesta esterna, nessuno scroll orizzontale,
  home ~0,8–1,1 MB; desktop, iPhone 13, movimento ridotto, `?review` ok.

## 07/11/2026 — Blocco 0: stato dell'arte
- Creato `hey-site-v4` da `claude/hey-site-v3` (0d9b77e). Nessuna modifica al sito.
- Scritto `STATO-HEY.md`: confronto v1/v2/v3 col master context, prove Playwright
  (desktop, iPhone 13, movimento ridotto), errori, segnaposto, piano in 11–13 blocchi.
- Scoperta principale: v2/v3 hanno sostituito il nuotatore con un nuovo racconto
  (viaggio a ritroso) basato su documenti non presenti nel repository.
- In attesa dell'ok della regia e delle risposte A–E di Massimiliano.
