# HEY — MASTER CONTEXT
Documento unico di riferimento per lo sviluppo del sito. Contiene identità, regole,
decisioni chiuse e spec tecnica. Se un dettaglio non è qui, va chiesto — non inventato.
Aggiornato: 17/08/2026

---

## 1. COS'È HEY

HEY è una **Creative / Production Company con competenze avanzate nelle tecnologie
generative**. Fondata da Gianluca Magnoni. Massimiliano Di Liberto (Bill Jobs) affianca
nella realizzazione con ruolo esecutivo nel core team.

Non è: una società che fa video con l'AI, un gruppo di prompt engineer, una content farm
AI, una software company, una casa di produzione tradizionale che ha iniziato a usare
l'AI.

Il vantaggio competitivo non è possedere la tecnologia — quella è accessibile a chiunque.
È sapere cosa farne.

**Claim pubblico:** THE TECHNOLOGY DOESN'T LEAD. THE IDEA DOES.

**Bussola interna** (non è un secondo claim pubblico, serve a validare ogni scelta):
Don't show what AI can do. Show what an idea can become.

**Regola operativa assoluta:** se un elemento del sito si spiega meglio dicendo quale
strumento è stato usato che perché l'idea richiedeva quello strumento, l'elemento è
sbagliato.

---

## 2. DECISIONI CHIUSE — non rimetterle in discussione

- Nome: **HEY**, con il descriptor **"AI GENERATIVE MEDIA"** sotto il logo. *[Deciso il
  17/08/2026 — ribalta la decisione precedente "nessun descriptor" del 16/08/2026: il
  raster fornito porta già la dicitura ed è stato confermato così, non va rifatto senza
  descriptor.]* La variante "HEY. HUMAN. EVOLUTION. YDEA." resta un'idea separata, non
  approvata, da proporre eventualmente a Gianluca — non va confusa con questo punto.
- Struttura: core team ristretto + specialist network.
- Governance: decide Gianluca.
- Posizionamento: production company, non agenzia AI.

---

## 3. SISTEMA VISIVO

**Colori**
- LIME accent — `#E5FD5D` (ufficiale, scelto da Gianluca. Ignorare `#C6FF00` visto in
  mockup: è un'approssimazione errata.)
- RHYME fondo — `#1A1C17`
- GRAY processo — `#A8A8A0`
- LIGHT testo — `#E6E6DF`

**Regola cromatica narrativa:** nero = mondo reale, contenitore. Grigio = processo.
Lime = intervento, possibilità, trasformazione. Il lime è materia che rivela, mai
fondale. Non fare un sito "tutto nero e lime": diventa tech startup.

**Tipografia:** mono / condensed, uppercase, spazi ampi, leggibilità tecnica — quella
già usata nell'app "Building the Vision". Deve sembrare cinema + design editoriale, non
software.

> **Nota:** il sito costruito finora ha usato un font diverso da questa spec (drift non
> autorizzato). Nella ricostruzione, la tipografia dell'app è il riferimento vincolante,
> non il sito attuale.

**Da evitare visivamente:** neon, glitch gratuito, gradienti viola, reti neurali, robot,
prompt a schermo, terminali, estetica "futuristica". Serve materia reale: pelle, set,
luce, acqua, piastrelle, metallo.

---

## 4. GLI ASSET

### 4.1 Il viaggio (Home) — asset da creare, non ancora esistenti

Il concept narrativo del viaggio è stato approfondito e reso beat-by-beat il 17/08/2026
(vedi **HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md**) e richiede riprese o generazioni
dedicate — non riusa il materiale del nuotatore. Finché non esiste il girato reale, si
costruisce con placeholder qualsiasi (vedi §6.1, Placeholder-first): l'architettura
tecnica non dipende dal contenuto specifico.

### 4.2 Il nuotatore — asset esistente, da riposizionare

Videoclip di Gianluca, girato circa 25 anni fa. Diritti di utilizzo confermati. Non è più
l'asset del viaggio in Home (vedi §5, §6.3). Tre frame di riferimento disponibili:
backstage (carrello su binari, tubo dell'ossigeno visibile), ripresa/compositing
(carrello rimosso), trasformazione AI (mondo sommerso, rovine, corallo).

> **Suggerimento, non ancora deciso:** questo materiale resta forte e già pronto — una
> collocazione naturale è come case study reale dentro WORK, invece che accantonato. Va
> confermato con Massimiliano/Gianluca, non assunto come deciso.

---

## 5. IL SITO — ARCHITETTURA

Il sito non è un unico flusso continuo. È diviso in due tipi di oggetti, deciso il
16/08/2026:

**A) IL VIAGGIO (Home)** — l'unica esperienza a scroll-scrubbed canvas (vedi §6).
Comunica posizionamento e filosofia attraverso un racconto visivo, non attraverso testo
esplicativo. Nessuna sezione "chi siamo" o "cosa facciamo" dentro il viaggio: si mostra,
non si spiega.

**B) SEZIONI SEPARATE** — pagine/sezioni convenzionali, raggiungibili da nav, ognuna un
oggetto a sé:
- **WORK** — portafoglio progetti reali (onesto: se non ci sono ancora case study
  pubblicabili, va dichiarato, non gonfiato)
- **ABOUT / CHI SIAMO** — presente ma non protagonista, vedi nota fondatori sotto
- **CONTACT** — form a risposta multipla, vedi §5.1
- **AREA PRIVATA** — accesso riservato, vedi §5.2

**Nota sui fondatori — REGOLA ESPLICITA:** Gianluca Magnoni e Massimiliano Di Liberto
non sono protagonisti della narrazione. Compaiono in due punti soltanto: un credito
minimo in footer ("chi c'è dietro HEY", solo nomi/ruolo, stile credits) e nella sezione
ABOUT separata — mai come momento centrale del viaggio. Il brand è HEY, non "il sito di
due persone".

**Navigazione:** WORK / ABOUT / CONTACT — più accesso all'area privata (icona/login
separati dalla nav principale, non una voce di menu come le altre). Mai la parola "AI"
in navigazione primaria.

### 5.1 Contact — form a risposta multipla

Non nome/email/messaggio. Un form breve, a scelta multipla, che qualifica chi scrive
prima di arrivare al campo libero — fa percepire una struttura vera, non un modulo
generico. Struttura di riferimento (adattare, non è testo finale):

1. **Chi sei** — Brand · Agenzia · Professionista che vuole entrare nel network · Altro
2. **Cosa stai realizzando** — Advertising · Branded Film · Fashion/Beauty · Product
   Film · Music Video · Non lo so ancora
3. **A che punto sei** — Ho un'idea · Ho un brief · Sono in pre-produzione · Cerco un
   partner di produzione
4. **Raccontaci il progetto** — campo libero, ultimo step

Le risposte instradano internamente (un lead "voglio entrare nel network" è diverso da
un lead "ho un brief pubblicitario da produrre") — la logica di instradamento va
definita prima di costruire il backend del form, non è ancora decisa.

### 5.2 Area privata — core team

Riservata: accesso solo per chi lavora dentro HEY (core team, e collaboratori del
network quando serve). Gate a password come nell'app attuale, non una funzione di
Vercel. Contenuto: gestione interna, aspetti fiscali/organizzativi, e — se dal form
CONTACT arriva qualcuno che chiede di entrare nel network — la relativa gestione interna
delle candidature. Eredita l'infrastruttura tecnica dell'app "Building the Vision"
esistente, trasformata: la logica di confronto-risposte va rimossa, resta il gate e
l'impalcatura.

---

## 6. INTERAZIONE — IL CUORE DEL SITO

### 6.0 Principio architetturale — non è una pagina, è un film

La Home (il viaggio, vedi §5) non è una sequenza di sezioni impilate con effetti
decorativi sopra. **È un film, e lo scroll è la timeline.** Non si scende da una sezione
all'altra: si avanza o si torna indietro dentro la stessa sequenza continua di
fotogrammi. I testi che compaiono sono solo quelli del viaggio stesso (vedi §6.3) — WORK,
ABOUT, CONTACT sono sezioni separate (§5), non fermate di questo film.

Tecnica originaria ipotizzata: canvas full-screen con sequenza di immagini precaricate.

> **Decisione presa il 17/08/2026 (aggiornamento):** motore **video**, non canvas +
> sequenza di frame. Si usa `scrub-engine.js` del repo `oso95/scroll-world` (MIT,
> vanilla JS, zero dipendenze, gira ovunque incluso un sito statico senza build step)
> come motore di scrub — non la pipeline di generazione di quel repo, solo il motore
> runtime. Motivo pratico, non solo tecnico: sia la pipeline di generazione di
> `scroll-world` sia il template "scroll-scrub" di Higgsfield richiedono credito
> Higgsfield (o Monid) per generare le clip, e in questo momento non c'è accesso a
> pagamento su Higgsfield. Il motore però non dipende da questo: scrub-engine.js si
> limita a riprodurre file `.mp4` già pronti in base allo scroll — funziona identico
> con clip segnaposto o clip finali, qualunque sia la loro origine. Si parte quindi
> con clip segnaposto prodotte in autonomia (reference ChatGPT + montaggio in DaVinci
> Resolve, vedi §6.1bis) e si sostituiscono in seguito con generazioni Higgsfield/Monid
> quando il budget lo permette — nessuna riscrittura del motore richiesta.

### 6.1 Placeholder-first, swap-ready — REGOLA VINCOLANTE

Le clip reali del viaggio non sono ancora pronte (il concept è nuovo, vedi §4.1). Si
costruisce ORA con clip segnaposto (anche del tutto scollegate dal contenuto finale), da
sostituire in seguito. Perché questo funzioni senza riscrivere codice:

- Il numero di frame, le dimensioni e i nomi dei file **non vanno mai scritti a mano nel
  codice**. Il canvas legge un file `frames-manifest.json` con struttura tipo:
  ```json
  { "count": 96, "width": 1920, "height": 1080, "prefix": "frame_", "ext": "webp" }
  ```
- Sostituire le clip vere in futuro significa: generare la nuova sequenza, sovrascrivere
  la cartella `frames/`, aggiornare il manifest. Zero righe di codice toccate.
- Stesso principio per i punti della timeline in cui compaiono i testi (es. "a metà del
  file, mostra l'headline"): espressi come percentuale (`0.15`, `0.42`...) in un file di
  config, non come frame number fisso — così restano coerenti anche se la sequenza finale
  ha una lunghezza diversa da quella placeholder.

### 6.1bis Placeholder — come si producono ORA, senza Higgsfield

Finché non c'è accesso a pagamento su Higgsfield/Monid, i segnaposto si producono così:
reference still generate con ChatGPT (i prompt sono già pronti in
HEY_Reference_Prompts_Viaggio.md), poi montate in DaVinci Resolve in clip brevi (pan/zoom
lento, crossfade — non serve animazione AI, basta un movimento macchina semplice su
un'immagine ferma) ed esportate come richiede `scrub-engine.js`: risoluzione nativa,
H.264, CRF ~20, GOP 8, `faststart`, senza audio. Non serve rispettare fedelmente il
racconto beat-by-beat in questa fase segnaposto — serve avere clip nei punti giusti
perché il motore sia scrollabile e verificabile. La sostituzione successiva con le
generazioni vere non tocca il motore, solo i file in `assets/world/`.

### 6.2 Estrazione dei frame — Claude Code la fa in autonomia

Massimiliano allega il video sorgente (placeholder o, in futuro, quello vero) direttamente
alla sessione. Claude Code estrae la sequenza via `ffmpeg`, non richiede passaggi manuali:

```bash
ffmpeg -i input.mp4 -vf "fps=12,scale=1920:-1" -q:v 3 frames/frame_%04d.webp
```

12 fps è sufficiente per uno scrub fluido legato allo scroll (non deve sembrare un video
a piena qualità, deve rispondere preciso al gesto). Regolare `scale` per generare anche
il set mobile (1080px lato lungo) in una cartella separata. Aggiornare
`frames-manifest.json` con il conteggio reale generato.

### 6.3 Il racconto — viaggio a ritroso

Deciso il 16/08/2026, **approfondito beat-by-beat il 17/08/2026**: il viaggio si apre nel
punto più lontano (un mondo generato, impossibile) e torna a ritroso fino all'origine
reale (il set, il mestiere). Non è un "prima/dopo" — è un solo movimento continuo
all'indietro.

Il racconto completo, scena per scena (loop → risultato → reverse del mondo → reverse
dell'acqua → reverse della produzione → reverse del movimento/camera → reverse della
preparazione → origine → possibilità) è ora specificato in dettaglio in
**HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md** — quel documento sostituisce la sintesi
beat-by-beat che era qui sotto in versione più corta. Punti fermi da lì, da tenere a
mente in ogni fase tecnica:

- La donna interagisce con un oggetto/struttura reale (es. un pannello di polistirolo che
  nel mondo finale è una colonna di tempio sommerso) progettato **insieme** al suo gesto,
  non dopo.
- La luce "solare" sott'acqua ha sempre un'origine fotografica reale (un faro sopra la
  vasca).
- La camera è il nostro punto di vista per gran parte del film: il movimento circolare di
  ~90° deve avere una controparte fisica reale (carrello/rig), rivelata solo verso la
  fine del reverse.
- Nessun testo esplicativo dentro il viaggio (vedi §6.4): il metodo e i nomi vivono in
  ABOUT, sezione separata.

> **Scelta produttiva di pipeline (vedi HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md
> §10):** non generare le clip "al contrario". Si genera nella direzione naturale (set
> vuoto → preparazione → donna → camera → mondo impossibile) e si costruisce la
> sequenza finale in reverse in fase di montaggio/assemblaggio frame.

### 6.3bis Interazione al cursore — idea aperta, non ancora risolta

Richiesta di Massimiliano (16/08/2026): mantenere, dentro il nuovo viaggio, la sensazione
già sperimentata nella versione nuotatore — muovere il cursore rivela uno strato sotto la
superficie. Ma con un'estensione: che riveli **mondi generati diversi, paralleli**, non
un solo strato fisso.

**Tensione da sciogliere prima di costruire:** questo va contro una regola già scritta nel
progetto — nel documento Idee Valide, sulla stessa idea (lì erano "regole di
trasformazione"): *"Sei regole diventano un menu, e un menu è una content farm con più
stile."* Mondi diversi e scollegati rivelati dal cursore rischiano esattamente questo: da
un'idea coerente a una vetrina di "guarda quanto sappiamo generare" — il rischio che
Massimiliano stesso aveva descritto nel questionario originale (q17: *"un marketplace di
persone che usano l'AI"*).

**Sintesi proposta, non ancora scelta:** il cursore rivela profondità dentro lo stesso
mondo/momento (un istante avanti o indietro nella stessa timeline, o dettaglio/texture
più fitta) invece di saltare tra mondi scollegati — mantiene il gesto fisico di scoperta
senza rompere la coerenza di un'unica idea.

**Se invece si sceglie la versione "mondi multipli":** non è solo una scelta tecnica (N
sequenze sincronizzate su scroll + posizione cursore contemporaneamente, non una), è un
cambio di posizionamento — va deciso con Gianluca, non prima che rientri dalle ferie.

### 6.3ter Struttura in clip — loop + 5 momenti

Il viaggio si costruisce come 6 clip generate separatamente (loop + 5 momenti di §6.3),
ognuna via primo/ultimo fotogramma dato a uno strumento di generazione video — vedi
HEY_Reference_Prompts_Viaggio.md per i prompt esatti e la convenzione di naming dei
file. Claude Code concatena le clip estratte in un'unica sequenza di frame (§6.2),
mantenendo i punti di giunzione tra clip come possibili punti di pausa per i testi
sovraimpressi.

**Cucitura loop → clip 01:** al passaggio da loop (autoplay, in attesa di scroll) a
clip 01 (primo scroll) può esserci un piccolo disallineamento — non correggerlo in
generazione, mascherarlo con un taglio molto breve (150–250ms) a flash bianco o blur,
mai un taglio secco.

### 6.4 Nessun testo istruttivo

Mai frasi tipo "trascina", "passa il mouse", "rivela il livello generativo" — il sito
costruito finora le usa tutte e vanno rimosse. L'interazione si scopre, non si spiega.

### 6.5 Mobile

Stesso film, stesso principio: lo scroll (touch) guida la timeline identica a desktop.
Nessuna versione ridotta — la sequenza mobile può avere risoluzione minore, non
un'esperienza diversa.

### 6.6 Vincolo critico, invariato

Nessun prima/dopo con linea verticale o slider — quello era il vecchio approccio a
comparator e va abbandonato del tutto, non solo nascosto. Il canvas-scrub sostituisce
sia il comparator che la vecchia timeline a stati cliccabili.

---

## 7. TECNOLOGIA WEB — cosa è ammesso e con quale criterio

Disponibili: video sincronizzati allo scroll, sequenze frame-by-frame, WebGL, canvas,
maschere, parallax, depth, particelle, morphing, transizioni video↔immagine, layer
interattivi, audio reattivo, micro-interazioni, reazione al cursore, touch interaction.

**Criterio unico:** la tecnologia deve servire la narrazione. Se un effetto non racconta
qualcosa, si toglie. Stessa identica regola dell'AI applicata al codice.

Quality floor obbligatorio: responsive fino a mobile, focus da tastiera visibile,
`prefers-reduced-motion` rispettato, performance reale (le sequenze frame-by-frame vanno
precaricate e decodificate con criterio, non buttate in pagina).

---

## 8. LESSICO

**Usare:** idea, creative direction, produzione, storytelling, craft, esperienza,
tecnologia, generativo, live action, CGI, VFX, ibrido, human, machine, possibilità,
giudizio, risultato.

**Vietato:** AI agency, AI-powered, AI content, rivoluzionario, disruptive, next
generation, future of video, limitless possibilities, create anything, basta un prompt,
10x faster, no camera needed, "sostituiamo la produzione tradizionale".

**Copy hero confermato:**
"L'IDEA C'ERA GIÀ. LA TECNOLOGIA LA RENDE POSSIBILE ORA."
"Circa 25 anni fa, abbiamo immaginato l'impossibile. Oggi possiamo trasformarlo."

> **Nota:** questo copy era scritto per il concept del nuotatore. Il nuovo concept del
> viaggio (§6.3) propone parole minime e diverse (HEY. / IDEA. / DIRECTION. /
> PRODUCTION. / POST. / COLOR. / RESULT. / YOUR IDEA. — vedi
> HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md §15). Il copy definitivo del viaggio non è
> ancora chiuso: non riusare questo testo automaticamente.

**Chiusura possibile:** THE IDEA DOESN'T CHANGE. (pausa) THE POSSIBILITIES DO. HEY.

---

## 9. LOGO

Il file fornito è il marchio HEY su fondo lime pieno (versione icona), **con il
descriptor "AI GENERATIVE MEDIA"** — versione confermata il 17/08/2026 (vedi §2).
Corretta per favicon e apple-touch-icon.

Serve una **versione reversed** per la navbar su fondo scuro: solo il tratto del
wordmark (con o senza descriptor, da verificare in prova visiva — il descriptor in
navbar potrebbe risultare troppo denso a dimensioni piccole), in `#E5FD5D` o `#E6E6DF`,
sfondo trasparente, preferibilmente SVG. Non esiste un sorgente vettoriale: va
ricostruita dal file raster.

Il lettering è angolare, condensato, con tagli obliqui — non sostituirlo con un font
generico.

---

## 10. COSA NON È ANCORA DEFINITO

- **Shot list tecnica del viaggio** (§6.3) — il racconto beat-by-beat esiste ora (vedi
  HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md), ma va ancora tradotto in una timeline
  produttiva precisa per ogni beat: azione, oggetto reale, trasformazione finale,
  scenografia, camera, luce, props, crew, post, color, testo, durata (vedi quel
  documento §19). Resta il punto più urgente prima di generare qualunque reference
  **definitiva** — non blocca invece i segnaposto (§6.1bis), che possono partire subito.
- ~~Canvas-frame vs motore video~~ — **chiuso il 17/08/2026**: motore video via
  `scrub-engine.js` (vedi §6.0). Motivato anche dall'assenza attuale di accesso a
  pagamento su Higgsfield, non solo da preferenza tecnica.
- **Interazione al cursore: uno strato o mondi paralleli?** (§6.3bis) — in tensione con
  la regola anti-menu già scritta nel progetto, non ancora sciolta
- **Se il nuotatore diventa case study in WORK** (§4.2) — suggerimento, non confermato
- **Girato reale vs generato** per il nuovo concept — "possiamo generare e fare delle
  riprese apposta" (Massimiliano, 16/08/2026): entrambe le strade restano aperte
- **Revisione di Gianluca** sul nuovo concept del viaggio, prima di produrre — sostituisce
  la narrazione basata sul suo materiale d'archivio, non è un dettaglio esecutivo che si
  possa decidere senza di lui
- Logica di instradamento interno del form contatti (§5.1)
- Formato esatto del credito footer fondatori (§5)
- Crediti sui lavori: solo HEY vs HEY + ruoli individuali
- Contenuti reali di WORK (case study) — la v1 può dichiarare "in preparazione" con
  onestà, non inventare progetti o clienti inesistenti

---

## 11. PIPELINE TECNICA — SCROLL WORLD + HIGGSFIELD

Vedi **HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md** per il documento
completo. Sintesi: repo di riferimento per il motore scroll = playhead cinematografico è
`oso95/scroll-world` su GitHub — interessa il motore tecnico (scroll avanti/indietro,
continuità tra clip, gestione mobile/seeking), non la sua grammatica creativa, che non va
applicata a HEY. Higgsfield è la macchina di generazione per le reference e le clip video.
Claude coordina la pipeline: reference reali → reference finali → start/end frame → video
generation → continuity check → reverse assembly → scroll engine → sito.

**Nota aggiunta il 17/08/2026:** Higgsfield mette a disposizione anche un template di
sito pronto chiamato "scroll-scrub" (lo scroll del visitatore riproduce un film generato,
motore di scrub già pronto in codice) — va confrontato punto per punto con `scroll-world`
prima di scegliere quale usare come base tecnica: nessuna delle due opzioni è stata
scelta.
