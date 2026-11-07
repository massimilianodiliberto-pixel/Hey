# HEY — Stato e Prossimi Passi
Aggiornato: 17/08/2026

Questo documento risponde a una domanda sola: se qualcuno (o Cowork) apre questo progetto
da zero oggi, cosa deve sapere per continuare senza rifare lavoro già fatto? Per lo spec
tecnico/creativo completo vedi HEY_MASTER_CONTEXT.md — questo è l'orientamento veloce.

---

## Cosa è stato fatto — in ordine

1. **Fondamenta del progetto chiuse.** Questionario "Building the Vision" compilato da
   Gianluca e Massimiliano, risposte confrontate, Bibbia di Progetto scritta sulla
   visione di Gianluca. Nessun punto bloccante: ruoli, struttura core/network e governance (decide
   Gianluca) chiusi. [Accordi interni tra i soci omessi in questa copia: il repository è
   pubblico. Sono nel documento originale.]
   Restano solo dettagli non urgenti (crediti sui lavori, conferma esplicita su direzione
   creativa/artistica).

2. **Primo sito costruito e pubblicato** (massimilianodiliberto-pixel.github.io/Hey).
   Valutato il 16/08/2026: strutturalmente è un template a sezioni impilate con effetti
   decorativi (zoom, comparator prima/dopo) — non quello che si voleva. Usa testo
   istruttivo ("trascina", "rivela il livello generativo") che le regole del progetto
   escludono esplicitamente. Tipografia diversa da quella specificata. Non si riparte da
   questo codice: si ricostruisce da zero sul nuovo concept (punto 4).

3. **Documenti ChatGPT analizzati criticamente**, non adottati in blocco: la diagnosi sul
   posizionamento (troppo "guarda cosa fa l'AI", troppo poco "production company vera")
   era corretta; la cura proposta (12 step di brand strategy prima del sito) è stata
   scartata perché il posizionamento è già chiuso nella Bibbia. Salvata solo la struttura
   del form contatti a risposta multipla (ora in Master Context §5.1).

4. **Pivot creativo deciso il 16/08.** Non più il nuotatore come hero della Home. Nuovo
   concept: un viaggio a scroll, a ritroso — si apre in un mondo generato e impossibile,
   si torna indietro fino al set reale.

5. **Concept del viaggio reso beat-by-beat il 17/08/2026.** Il punto che era "il più
   urgente e non ancora pronto" (script scena per scena) ora esiste in dettaglio:
   `HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md` — 14 sezioni narrative, struttura
   completa A→J (loop, risultato, reverse del mondo/acqua/produzione/movimento/camera/
   preparazione, origine, possibilità), regole produttive vincolanti (ogni elemento
   impossibile ha una controparte fisica reale sul set). Resta da fare: tradurlo in shot
   list tecnica (azione, camera, luce, props, durata per ogni beat) — vedi "Cosa manca"
   sotto.

6. **Pipeline tecnica di produzione definita il 17/08/2026.**
   `HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md` descrive come usare il
   repository open source `oso95/scroll-world` (motore scroll = playhead
   cinematografico) insieme a Higgsfield (generazione immagini/video) per produrre le
   clip del viaggio: reference reali → reference finali → start/end frame → generazione →
   continuity check → reverse assembly → scroll engine → sito. Regola chiave: si genera
   nella direzione naturale (set vuoto → produzione → mondo impossibile) e si mostra in
   reverse in fase di montaggio, non si chiede al modello di generare "al contrario".

7. **Interazione al cursore — discussa, non risolta.** L'idea di rivelare mondi
   generati diversi al passaggio del cursore va in tensione con la regola anti-menu già
   scritta nel progetto ("sei regole diventano un menu, è una content farm con più
   stile"). Proposta alternativa in Master Context §6.3bis: il cursore rivela
   profondità nello stesso mondo, non mondi scollegati. Non ancora scelto.

8. **Prompt di reference per il viaggio pronti.** HEY_Reference_Prompts_Viaggio.md
   contiene i prompt per ChatGPT per generare primo/ultimo fotogramma di ognuna delle 6
   clip (loop + 5 momenti), da usare poi con Kling (o equivalente) per generare le clip
   vere, più la convenzione di naming dei file.

9. **Architettura del sito ridefinita.** Non un unico flusso con tutte le sezioni dentro.
   Due oggetti: il Viaggio (solo Home, canvas-scrub o motore video — vedi punto 6) e le
   Sezioni separate (Work, About, Contact, Area privata). I fondatori non sono
   protagonisti del viaggio — credito minimo in footer più una sezione About separata,
   non un momento centrale del racconto.

10. **Descriptor del logo deciso il 17/08/2026.** "HEY" tiene il descriptor "AI
    GENERATIVE MEDIA" sotto il logo — ribalta la decisione precedente del 16/08 ("nessun
    descriptor"). Vedi nota sotto e HEY_MASTER_CONTEXT.md §2.

11. **Cartella file di progetto riordinata il 17/08/2026.** Tutti i documenti di
    riferimento sono ora in `docs/`, gli originali .docx in `concept-originali/`, la mood
    board in `moodboard/`, i materiali superati in `archive/`. Vedi README_STRUTTURA.md.

---

## Cosa è stato deciso il 17/08/2026, nel dettaglio

- **Descriptor logo: tenuto.** "AI GENERATIVE MEDIA" resta sotto "HEY" sul logo — non è
  più un punto aperto, ma nota bene: ribalta una decisione esplicitamente "chiusa" il
  giorno prima in tre documenti diversi (Master Context, CLAUDE.md, Bibbia). Vale la pena
  una conferma diretta con Gianluca prima del lancio, non solo una decisione via Cowork.
- Il concept del viaggio ha ora un documento narrativo completo, beat-by-beat, con regole
  produttive esplicite (ogni elemento fantastico ha una controparte reale sul set —
  colonna = pannello di polistirolo, sole = faro, ecc.).
- La pipeline tecnica di produzione (Scroll World + Higgsfield) è definita a livello di
  architettura, non ancora implementata.
- **Motore dello scroll: chiuso.** Motore video via `scrub-engine.js` (repo
  `oso95/scroll-world`, MIT, vanilla JS, zero dipendenze) — non canvas+frame, non il
  template Higgsfield. Motivo: sia la pipeline di generazione di Scroll World sia il
  template Higgsfield richiedono credito Higgsfield/Monid per generare le clip, e al
  momento non c'è accesso a pagamento su Higgsfield. Il motore stesso non ha questa
  dipendenza — riproduce semplicemente file `.mp4` in base allo scroll, segnaposto o
  definitivi che siano.
- **Placeholder: si parte subito, senza aspettare budget o generazione AI.** Reference
  still via ChatGPT (prompt già pronti) → clip montate in DaVinci Resolve (pan/zoom
  semplice, no AI) → esportate secondo lo spec del motore. Nessun costo, nessuna
  dipendenza da Higgsfield.

---

## Cosa manca — in ordine di priorità

1. **Shot list tecnica del viaggio, beat per beat.** Il racconto esiste (vedi punto 5
   sopra); manca ancora la traduzione in timeline produttiva precisa: azione, oggetto
   reale, trasformazione finale, scenografia, camera, luce, props, crew, post, color,
   testo, durata — per ciascun beat. È il vero blocco prima di generare qualunque
   reference definitiva.
2. **Prototipo tecnico breve (20-30s)** per validare canvas-frame vs motore video prima
   di produrre l'intero viaggio (vedi Scroll World doc §11).
3. **Decisione girato reale vs generato** per il nuovo materiale.
4. **Revisione di Gianluca** sul nuovo concept, prima di produrre — non è più il suo
   materiale d'archivio a raccontare la storia, quindi non è una scelta che si chiude
   senza di lui. È al momento in ferie: nessuna urgenza artificiale, ma va messo in coda
   per quando rientra. La stessa conferma vale per il descriptor del logo (vedi sopra).
5. Logica di instradamento del form contatti (dove vanno i lead, come si smistano).
6. Formato del credito footer fondatori.
7. Conferma se il nuotatore diventa davvero un case study in WORK.

---

## File di riferimento (struttura aggiornata)

Tutto vive ora sia nel Progetto Cowork HEY sia in
`/Users/grafico/Desktop/CLAUDEnonTOCCARE/Hey/files/` con questa struttura:

```
files/
  CLAUDE.md                          — istruzioni per Claude Code, entry point
  README_STRUTTURA.md                — spiega la riorganizzazione del 17/08/2026
  docs/
    HEY_MASTER_CONTEXT.md            — fonte di verità tecnica/creativa completa
    HEY_Stato_e_Prossimi_Passi.md    — questo file
    HEY_Reference_Prompts_Viaggio.md — prompt ChatGPT/Kling per i frame del viaggio
    HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md — concept narrativo beat-by-beat
    HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md — pipeline tecnica
    HEY_Bibbia_di_Progetto.md        — fondamenta: identità, ruoli, economia
    HEY_01_Istruzioni_di_Progetto.md — chi siamo, stato sintetico
  concept-originali/                 — i due .docx originali, invariati
  moodboard/                         — HEY_Moodboard_Viaggio_a_Ritroso.png
  archive/
    PROMPT_PER_CLAUDE_CODE.md        — superato (vecchio concept nuotatore/comparator)
```

> **Nota:** `HEY_Brief_Prima_Bozza_Sito.md`, citato come archivio storico in versioni
> precedenti di questo documento e di CLAUDE.md, non risulta presente nella cartella
> files — non è stato trovato né sul Mac né nel Progetto Cowork. Se esiste altrove, va
> recuperato; altrimenti il riferimento va rimosso dalla documentazione.
