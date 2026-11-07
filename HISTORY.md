# HISTORY — sito HEY (branch hey-site-v4)

Da leggere per primo alla ripresa. Una voce per blocco, la più recente in alto.

## 07/11/2026 — §6.4: tolto il testo istruttivo in SYSTEM
- Rimossa l'etichetta "Trascina / Scorri col dito" dallo scrub (HTML, CSS e JS), con l'ok della regia.
  Collaudo desktop, telefono e movimento ridotto: scrub, tastiera, trascinamento e autoplay invariati, console pulita.

## 07/11/2026 — Documenti di agosto letti
- In `docs/` (commit fabeea6 della regia): master context 17/08, note di regia, spec clip, CLAUDE di agosto,
  storyboard. Letti tutti; aggiunto il §8 a STATO-HEY.md con 8 conflitti (C1–C8), le 6 verifiche chieste
  dalla regia e i documenti che servono ancora. **Nessuna modifica al sito**: decide Massimiliano.
- Da ricordare alla ripresa: descrittore "AI GENERATIVE MEDIA" deciso il 17/08 ma assente dal sito;
  "Trascina / Scorri col dito" in SYSTEM viola il §6.4; lo scrub di SYSTEM è la "timeline a stati
  cliccabili" che il §6.6 abbandona; il mobile del blocco 3 va oltre il §6.5.

## 07/11/2026 — Anteprima e vercel.json
- Massimiliano ha autorizzato un'anteprima; la regia l'ha pubblicata su https://hey-site-anteprima.vercel.app
  (progetto Vercel separato, senza git: si aggiorna solo quando la regia ripubblica).
- Aggiunto `vercel.json` con `X-Robots-Tag: noindex, nofollow` su tutte le pagine. GitHub Pages lo ignora.
- "Indirizzo da inserire" e "Tel da inserire" nella fascia restano segnaposto finché Massimiliano non dà i dati.

## 07/11/2026 — Indirizzo email confermato
- Nuotatore nello scrub di SYSTEM: confermato dalla regia in via provvisoria, si cambia solo se Massimiliano dice altro.
- `hey@hey.it` (confermato da Massimiliano via regia) in `HEY_CONFIG` e come testo di riserva nell'HTML
  della fascia (per chi non ha JavaScript). Nessun `EMAIL-DA-CONFERMARE` rimasto nelle pagine.
- In arrivo dalla regia, da mettere in `docs/`: master context del 17/08, note di regia, `files/CLAUDE.md`,
  `HEY_Spec_Tecnica_Clip_Viaggio.md` (il "pipeline.md" citato nel codice), reference. Alla ricezione:
  rileggere STATO-HEY.md e il piano.

## 07/11/2026 — Blocco 9: collaudo complessivo (parte fattibile ora)
- 8 pagine × 3 configurazioni (desktop, iPhone 13, movimento ridotto): console pulita, nessun 404,
  nessuna richiesta esterna, nessuno scroll orizzontale, larghezza su telefono = 390, focus visibile
  sui primi elementi da tastiera. Home ~0,8–1,0 MB, pagine interne < 0,15 MB.
- Corretti: h1 nascosto per lettori di schermo in home; etichette accessibili sui campi dei moduli;
  descrizione e `noindex` in area privata; meta social base (senza immagine: serve il dominio);
  pagina `404.html` che funziona sia in locale sia sotto `/Hey/` su GitHub Pages.
- Lessico vietato e "Verona": nessuna occorrenza.
- Resta per il collaudo finale: immagine social e dominio, contenuti reali, prova su telefoni veri.

## 07/11/2026 — Blocco 6: modello di case study
- `work/modello/`: pagina vuota con la struttura Challenge · Idea · Approach · Making · Role of AI · Result,
  slot per il film principale, etichette delle tecniche (solo qui, mai nel menu), crediti con la scelta
  ancora aperta (§10). Non collegata dal menu, `noindex`, riquadro "Modello vuoto" ben visibile.
  Istruzioni per duplicarla in un commento in testa al file.

## 07/11/2026 — Blocchi 2 e 3: scia lime e mobile della home
Tutto in `assets/js/reveal-overlay.js`; `scroll-world.js` non toccato.
- Scia lime (§6.2): la finestra che rivela ha un filo lime sottile sul bordo; dove si passa il livello 02
  resta aperto per un attimo (0,9 s) e il filo si spegne. Punti nuovi solo con spostamento reale:
  col movimento lento gli anelli si accatastavano come curve di livello. Niente scia con movimento ridotto.
- Swipe orizzontale su telefono: scena successiva / precedente (usa i punti di navigazione del motore).
  Lo scroll verticale resta la timeline. Nessun limite di tempo sul gesto: il primo tocco arrivava in ritardo.
- Percorso automatico su telefono (§6.4): dopo 3,5 s senza tocchi né scroll la finestra si muove da sola
  sulla scena; si ferma al primo tocco o scroll. Mai con movimento ridotto, mai a fine viaggio.
- Collaudo: desktop scia ok, si spegne da ferma e allo scroll; telefono: autoplay a 6,5 s, swipe avanti
  e indietro ok, autoplay fermo al tocco; movimento ridotto: niente autoplay né scia; console pulita.

## 07/11/2026 — Blocco 4: SYSTEM, scrub di processo, struttura del Lab
- Nuova pagina `system/` e voce "System" nel menu e nel footer di tutte le pagine
  (Work / System / About / Network / Contact).
- Metodo in 4 passaggi (Idea, Produzione, Tecnologia, Film): testi ripresi dalla v1.
- Scrub di processo (§6.3), `assets/js/scrub.js`: 6 stati IDEA → NUOVA IMMAGINE sui tre frame veri
  del nuotatore (portati dalla v1 in `assets/img/frames/`, avif + jpg, 824 KB). Il frame nuovo affiora
  da una zona morbida con un filo lime sottile solo dove il mestiere interviene; niente tendina prima/dopo.
  Trascinamento orizzontale (swipe su telefono, lo scroll verticale resta libero), clic sulla timeline,
  frecce/Home/Fine. Parte da solo se nessuno tocca; con movimento ridotto niente autoplay né animazioni.
- Transformation Lab: struttura con 5 interventi (luce, ambiente, materia, movimento, realtà, testi v1)
  e riquadri "Frame in preparazione".
- Telefono: menu a 5 voci su una riga; footer che va a capo (prima allargava la pagina a 423 px);
  fascia in basso su due righe con testo continuo.
- Da confermare con Massimiliano: uso del nuotatore nello scrub (unico materiale con backstage,
  plate e finale dello stesso shot, diritti confermati dal master context §4).

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
