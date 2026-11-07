# HEY — Contesto di progetto

**Repo:** `massimilianodiliberto-pixel/Hey`, branch `claude/hey-site-v1-4ffig4`, già
pushato su GitHub. Deploy live via GitHub Pages: `massimilianodiliberto-pixel.github.io/Hey/`

> ⚠️ **Lo stato attuale del codice (`index.html`, sei sezioni impilate: Hero con il
> nuotatore, Work, System, Transformation Lab, About, Contact) è l'architettura VECCHIA,
> già valutata e abbandonata il 16/08/2026.** Non usarla come base per nuovo lavoro — va
> sostituita secondo la nuova architettura descritta in docs/HEY_MASTER_CONTEXT.md §5 e
> §6, e secondo il concept beat-by-beat in
> docs/HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md. Se non è chiaro se una richiesta
> riguarda il vecchio codice o il nuovo piano, chiederlo esplicitamente prima di
> scrivere.

Prima di lavorare su questo progetto, leggi tutti i file nella cartella `docs/`:

- **HEY_MASTER_CONTEXT.md** — fonte di verità unica per tutto: identità, colori,
  tipografia, architettura del sito (viaggio + sezioni separate), racconto del viaggio
  beat per beat, form contatti, area privata, regole e vincoli. Se un dettaglio non è
  qui, va chiesto — non inventato.

- **HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md** — il concept narrativo e produttivo
  completo del viaggio (aggiunto il 17/08/2026): 19 sezioni, struttura beat-by-beat A→J,
  regole produttive vincolanti (ogni elemento impossibile ha una controparte fisica reale
  sul set). Questo è il documento che risolve quello che il Master Context segnalava come
  "il punto più urgente" — leggerlo per intero prima di proporre qualunque reference o
  script.

- **HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md** — pipeline tecnica
  (aggiunto il 17/08/2026): come studiare e adattare il repo open source
  `oso95/scroll-world` insieme a Higgsfield per generare reference, clip e assemblare il
  viaggio in reverse. Leggerlo insieme al documento precedente, non al posto suo.

- **HEY_Stato_e_Prossimi_Passi.md** — cosa è stato fatto finora, cosa è stato deciso
  di recente, cosa manca in ordine di priorità. Leggerlo per capire dove si è arrivati
  prima di proporre modifiche già discusse o scartate.

- **HEY_Reference_Prompts_Viaggio.md** — se si lavora sui frame/clip del viaggio: prompt
  di reference e convenzione di naming dei file.

- **HEY_Bibbia_di_Progetto.md** — le decisioni fondative di business: identità, ruoli,
  modello produttivo, economia. Consultare solo per dubbi di posizionamento, ruoli o
  governance — non per decisioni sul sito, che vivono nel Master Context.

**`archive/PROMPT_PER_CLAUDE_CODE.md` è superato — non usarlo come riferimento, vedi
Stato e Prossimi Passi per i dettagli.** `HEY_Brief_Prima_Bozza_Sito.md`, citato in
passato come archivio storico, non risulta presente in questa cartella — se serve va
recuperato altrove, non va assunto o ricostruito a memoria.

## Decisione tecnica chiusa il 17/08/2026 — motore dello scroll

Motore **video**, non canvas+frame: `scrub-engine.js` dal repo `oso95/scroll-world`
(MIT, vanilla JS, framework-agnostic, si clona da GitHub e si usa direttamente — non
serve installare il plugin/skill Claude Code di quel repo, basta il file
`skills/scroll-world/references/scrub-engine.js`). Non usare la pipeline di
generazione di quel repo né il template "scroll-scrub" di Higgsfield: entrambi
richiedono credito Higgsfield o Monid, non disponibile al momento. Il motore stesso
non ha questa dipendenza: riproduce file `.mp4` già pronti in base allo scroll,
segnaposto o definitivi. Si parte con segnaposto prodotti via ChatGPT (stills) +
DaVinci Resolve (montaggio semplice, pan/zoom, no AI) — vedi Master Context §6.1bis —
e si sostituiscono in seguito senza toccare il motore.

## Decisioni ancora aperte — NON assumere

- Interazione al cursore nel viaggio: se rivela profondità nello stesso mondo o mondi
  paralleli diversi — vedi Master Context §6.3bis, non ancora scelto.
- Shot list produttiva del viaggio (azione/camera/luce/props/durata per ogni beat) non
  ancora costruita in dettaglio — il concept narrativo esiste (v02), la sua traduzione
  tecnica no. Non generare reference definitive prima di questo passaggio.
- Nome/descriptor secondario: "HEY." con "AI GENERATIVE MEDIA" sotto è la versione
  attuale (deciso 17/08/2026 — vedi Master Context §2). "HEY. HUMAN. EVOLUTION. YDEA." è
  una variante di naming diversa e separata, ancora da proporre a Gianluca, non da
  integrare come scelta definitiva.

Se il lavoro tocca uno di questi punti, segnalarlo esplicitamente invece di scegliere
in autonomia.

## Regola cromatica confermata

- LIME / accent — `#E5FD5D` (colore ufficiale, già scelto da Gianluca — non usare
  varianti tipo `#C6FF00` viste in mockup precedenti, sono approssimazioni)
- RHYME / fondo — `#1A1C17`
- GRAY / processo — `#A8A8A0`
- LIGHT — `#E6E6DF`

## Logo

`IMG_2109.jpeg` è la versione icona (marchio su sfondo lime pieno, con il descriptor "AI
GENERATIVE MEDIA") — corretta per favicon e apple-touch-icon, non toccarla. Serve ancora
una versione "reversed" del wordmark (tratto chiaro/lime, sfondo trasparente) per l'uso
in navbar su sfondo scuro — verificare se esiste già un sorgente vettoriale prima di
ricostruirla da zero, e verificare in prova visiva se il descriptor sta bene anche in
navbar a dimensioni piccole o se lì va usato solo il wordmark.

## Regola guida per ogni scelta produttiva

"Stiamo usando l'AI perché è la soluzione migliore, o perché vogliamo dimostrare che
sappiamo usare l'AI?" Se la risposta è la seconda, si cambia approccio. Mai la parola
"AI" in navigazione primaria.
