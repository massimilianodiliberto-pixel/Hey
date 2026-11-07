# STATO HEY — dove siamo (07/11/2026)

Analisi del sito HEY prima di riprendere il lavoro. Base: branch `claude/hey-site-v3`
(ultimo commit 18/08, Lara). Riferimento: `HEY_MASTER_CONTEXT.md` (16/08, sul branch v1).
Verifiche fatte con Playwright in locale: desktop 1440×900, iPhone 13, `prefers-reduced-motion`.

---

## 0. La cosa più importante: il concept è cambiato dopo il master context

| | Master context (16/08) e v1 | v2 e v3 (18/08) |
|---|---|---|
| Soggetto | **Il nuotatore** (videoclip di Giangi, 3 frame veri: backstage, plate, generativo) | **Una donna in un mondo sommerso** (reference generate da Massimiliano con ChatGPT) |
| Racconto | Dalla piscina vuota al mondo generativo | **Viaggio a ritroso**: dal mondo sommerso al set vuoto (HEY → IDEA → DIRECTION → PRODUCTION → YOUR IDEA) |
| Asset | Frame del nuotatore in `assets/img/frames/` | I frame del nuotatore **non ci sono più**; ci sono 6 still di reference + 6 micro-loop segnaposto |

Il codice v2/v3 cita documenti che **non sono nel repository**: un master context più recente
(con §5.1 form contatti e §5.2 area privata), `HEY_Note_Regia_Overlay_Review_v01.md`,
`HEY_Reference_Images_ChatGPT_Mapping_v01.md`, `pipeline.md`. Quindi il master context che
abbiamo è **superato in parte**. Prima di costruire bisogna sapere quale racconto è approvato da Giangi.

---

## 1. Cosa c'è e funziona (v3)

- **Home = viaggio a scroll** (`scroll-world.js`, motore video): 5 scene + intro. Oggi scorre
  gli still con zoom lento; appena arrivano le clip vere basta scriverle nel manifest
  (`assets/world/world-manifest.json`), senza toccare codice.
- **Rivelazione a due livelli** (`reveal-overlay.js`): una zona a bordi organici sotto il cursore
  (o il dito) mostra un secondo livello video. **Non è uno slider prima/dopo**: rispetta il vincolo §6.2.
- **Sezione finale** "YOUR IDEA. LET'S MAKE IT REAL." con CTA verso Contact.
- **Pagine:** Work (onesta: "In preparazione", nessun progetto inventato), About (Giangi + Massimiliano,
  core team + network), Network (form candidature in 3 passi), Contact (form in 4 passi),
  Area privata (cancello dichiaratamente non collegato).
- **Qualità tecnica:** console pulita su tutte le pagine, nessun 404, nessuno scroll orizzontale
  su telefono, home **2,4 MB** al caricamento, focus da tastiera visibile, link relativi
  (funzionano su GitHub Pages sotto `/Hey/`).
- **Movimento ridotto:** zoom delle scene e particelle spenti, la rivelazione segue il cursore senza inerzia.

## 2. Cosa manca rispetto al master context

**§5 Architettura**
- **SYSTEM** (metodo Idea → Produzione → Tecnologia → Film): assente.
- **TRANSFORMATION LAB** (luce, ambiente, materia, movimento, realtà): assente.
- **Navigazione:** oggi Work / About / Network / Contact. Il master context dice
  WORK / SYSTEM / METHOD / ABOUT / CONTACT. Network è stato aggiunto dopo (decisione non scritta qui).
  Nota: SYSTEM e METHOD in nav sembrano la stessa cosa detta due volte — da chiarire.
- WORK: struttura del case study pronta solo come riga di testo, nessun template di case study.

**§6 Interazione**
- 6.1 Ingresso scroll-driven: **c'è** (zoom sugli still; scrub video pronto ma senza clip).
- 6.2 Trasformazione al passaggio: **c'è la meccanica**, ma (a) manca la **scia lime** che rivela,
  prevista dal master context; (b) il livello 02 è un segnaposto ricavato dalla stessa still,
  quindi oggi la rivelazione **quasi non si vede**.
- 6.3 **Scrub di processo** (timeline trascinabile IDEA → … → NUOVA IMMAGINE): esisteva nella v1
  (`scrub.js`), **sparito in v2/v3**. In parte lo sostituiscono i titoli delle scene, ma non è trascinabile.
- 6.4 **Mobile**: si scorre in verticale come su desktop. Mancano swipe orizzontale e
  riproduzione automatica se l'utente non tocca.

**§10 Ancora da definire** (invariato): crediti sui lavori, case study reali, storyboard per lo stato IDEA.

## 3. Errori trovati

1. **Telefono, sezione finale:** "YOUR IDEA. LET'S MAKE IT REAL." e la riga sopra finiscono
   **sotto la navigazione** (testi sovrapposti).
2. **Telefono:** le note di regia occupano il terzo superiore dello schermo e coprono la scena.
3. **Scritta fantasma "HEY / THE IDEA"** semitrasparente in mezzo alle scene 03–04, su desktop e telefono. *(Poi scoperto: è una filigrana dentro l'immagine di reference, non codice. Tolta nel blocco 1.)*
4. **Fascia in basso su telefono:** il testo è tagliato a metà riga ("… · TEL").
5. **Bottoni CTA incoerenti:** "Contact" a pillola nel viaggio, rettangolare nella sezione finale.
6. **Font da Google Fonts** (Big Shoulders, Instrument Sans, JetBrains Mono): dipendenza esterna
   e richiesta a terzi; la v1 aveva il font in locale.
7. Il form Contact rimanda a "HEY_MASTER_CONTEXT.md §5.1" nel messaggio visibile all'utente.

## 4. Contenuti segnaposto o non confermati

- **Note di regia accese** (`reviewNotes: true`): vanno spente prima di andare online.
- Fascia in basso: "indirizzo / email / tel da inserire".
- **Non confermati dal master context:** "basata a **Verona**" e "esperti … da **oltre quarant'anni**"
  (footer). Da verificare con Giangi o togliere.
- Clip del viaggio: tutte `null` (solo still). Intro senza clip. 6 hover clip = segnaposto.
- Form Contact e Network: **nessun invio** (raccolgono e mostrano un riepilogo).
- Area privata: nessun accesso reale (prevista integrazione con "Building the Vision").
- Work: 3 categorie "In preparazione".

## 5. Identità (lettura del guardiano)

- **Fasce lime fisse in alto e in basso, sempre a schermo:** è lime usato come cornice/fondale,
  non come materia che rivela. Contrasta con §3. Proposta: togliere la fascia alta, portare i contatti
  nel footer, tenere il lime solo dove "succede qualcosa" (rivelazione, CTA, stato attivo).
- Le reference sono immagini generate con ChatGPT: vanno bene come segnaposto dichiarato,
  ma se restassero nel sito finale l'effetto sarebbe proprio "estetica AI" (pelle lucida, posa da
  copertina). Il master context chiede materia reale. Servono le clip girate.
- Nome HEY senza descrittore: rispettato. Nessun "AI" in navigazione: rispettato.

---

## 5b. Avanzamento (aggiornato 07/11/2026)

| # | Blocco | Stato |
|---|---|---|
| 0 | Decisioni | Prese da Massimiliano (vedi HISTORY.md e §9) |
| 1 | Pulizia | Fatto |
| 2 | Scia lime nella rivelazione (fasce lime restano, scelta di Massimiliano) | Fatto |
| 3 | Mobile: swipe tra le scene (rivelazione automatica tolta il 07/11) | Fatto |
| 4 | SYSTEM + scrub di processo | **Tolto il 07/11** (decisione di Massimiliano; codice nella storia git) |
| 5 | Transformation Lab | **Tolto con SYSTEM** il 07/11 |
| 6 | Modello case study | Fatto (`work/modello/`) |
| 7 | Form | Fatto via mailto a hey@hey.it |
| 8 | Contenuti reali | In attesa di materiale |
| 9 | Collaudo | Parte fattibile fatta; resta quello finale con contenuti, dominio e immagine social |

## 6. Strada per arrivare al sito finito

Stima in **blocchi** (un blocco = una sessione di lavoro chiusa con prove Playwright
desktop + telefono + movimento ridotto).

| # | Blocco | Dipende da | Stima |
|---|---|---|---|
| 0 | **Decisioni** (vedi domande sotto) | Massimiliano / Giangi | — |
| 1 | Pulizia: errori 1–7, font in locale, note di regia dietro un parametro `?review`, CTA uniformi | — | 1 |
| 2 | Identità: revisione uso del lime (fasce), scia lime nella rivelazione | ok al punto lime | 1 |
| 3 | Mobile §6.4: gesto dedicato + riproduzione automatica se inattivo | — | 1–2 |
| 4 | **SYSTEM / metodo** come pagina o sezione, con lo scrub di processo trascinabile (§6.3) | decisione A | 2 |
| 5 | **TRANSFORMATION LAB** | decisione A + materiale | 2 |
| 6 | Template case study Work (Challenge · Idea · Approach · Making · Role of AI · Result), vuoto finché non arrivano progetti veri | — | 1 |
| 7 | Form: collegamento a un servizio di invio | decisione D | 1 |
| 8 | Contenuti reali: clip del viaggio, hover clip, contatti, testi confermati | materiale | 1 (montaggio) |
| 9 | Collaudo finale: peso, accessibilità, SEO base, meta social, 404 | — | 1 |

**Totale stimato: 11–13 blocchi**, di cui 6–7 fattibili subito senza materiale nuovo (1, 2, 3, 6, 9 e parte di 4).

## 7. Domande per Massimiliano (con raccomandazione)

**A. Il racconto della home**
1. Resta il viaggio a ritroso con la donna (v3) — *raccomandato, è il lavoro più recente e Lara lo ha già portato avanti*
2. Si torna al nuotatore del master context
3. Entrambi: viaggio in home, nuotatore come caso in SYSTEM / Work

**B. Navigazione**
1. Work / System / About / Network / Contact — *raccomandato: aggiunge il metodo, tiene Network*
2. Come oggi (Work / About / Network / Contact)
3. Come il master context (Work / System / Method / About / Contact)

**C. Fasce lime fisse**
1. Togliere la fascia alta, contatti nel footer, lime solo dove rivela — *raccomandato*
2. Tenerle come sono

**D. Invio dei form**
1. Servizio esterno semplice (es. Formspree), da confermare — *raccomandato per partire*
2. Mailto
3. Aspettare l'area privata / Building the Vision

**E. Hai il master context più recente e i documenti citati (note di regia, mapping reference, pipeline)?**
Se sì, servono nel repository prima di costruire.

---

## 8. Riletto alla luce dei documenti di agosto (07/11/2026, sera)

Documenti ora in `docs/`: master context del 17/08, note di regia, spec delle clip, CLAUDE di agosto,
storyboard in 16 tavole. **Regola:** dove sono in conflitto, valgono le decisioni prese oggi da
Massimiliano. Qui sotto i conflitti sono solo **segnalati**: sul sito non ho cambiato nulla.

### 8.1 Conflitti tra il 17/08 e le scelte di oggi

| # | Documento di agosto | Sito oggi (scelta del 07/11) | Chi decide |
|---|---|---|---|
| C1 | Menu WORK / ABOUT / CONTACT + icona area privata (§5) | Work / System / About / Network / Contact | Resta oggi (Massimiliano) |
| C2 | SYSTEM e Transformation Lab fanno parte dell'"architettura vecchia, abbandonata il 16/08" (CLAUDE di agosto) | Pagina `system/` con metodo, scrub e Lab | Resta oggi, ma è il conflitto più grosso: da confermare che sia voluto |
| C3 | §6.6: "il canvas-scrub sostituisce sia il comparator che **la vecchia timeline a stati cliccabili**" | Lo scrub di SYSTEM *è* una timeline a stati cliccabili (senza linea prima/dopo) | Massimiliano |
| C4 | §4.2: nuotatore suggerito come case study in WORK | Nuotatore nello scrub di SYSTEM, in via provvisoria | Massimiliano (lo dice anche il §10) |
| C5 | §6.5 mobile: "stesso film, lo scroll guida la timeline identica a desktop, nessuna esperienza diversa" (sostituisce lo swipe del 16/08) | Blocco 3: swipe orizzontale fra le scene + rivelazione che si muove da sola su telefono | Massimiliano: tenere, togliere o tenere solo lo swipe |
| C6 | Fasce lime: non previste; "il lime è materia che rivela, mai fondale" (§3) | Fasce restano | Resta oggi |
| C7 | Contact: logica di instradamento da definire prima del backend (§5.1) | mailto a hey@hey.it; le domande a scelta multipla del §5.1 sono quelle del sito | Resta oggi |
| C8 | Note di regia: un solo interruttore nel manifest (§4 delle note) | Interruttore nel manifest **più** `?review` nell'indirizzo | Compatibile; segnalo solo la differenza |

### 8.2 Verifiche richieste dalla regia

1. **Descrittore "AI GENERATIVE MEDIA" sotto il logo (§2, 17/08):** **non c'è** sul sito. In nav c'è solo
   il wordmark HEY in SVG. Il file con il descrittore esiste (`assets/img/brand/hey-full-lime.jpg`,
   marchio su lime) ma non è usato. Il §9 stesso chiede una prova visiva per decidere se in navbar va
   con o senza descrittore. *Nota mia:* "AI" accanto al logo convive male con la regola "mai AI in
   navigazione primaria" e con "production company, non agenzia AI": la decisione è chiusa (§2) ma vale
   una prova visiva prima di applicarla. Anche l'agente `guardiano-identita` dice ancora "HEY senza
   descrittore": va aggiornato quando si decide.
2. **Tipografia (§3):** **sì.** Big Shoulders Display, Instrument Sans, JetBrains Mono, ora in locale.
   Il "drift" di cui parla il §3 riguardava la v1 (Archivo Narrow); dalla v2 è corretto.
3. **§6.4 nessun testo istruttivo:** **una violazione, mia:** l'etichetta "Trascina / Scorri col dito"
   sullo scrub di SYSTEM. In home nessun testo istruttivo (l'indicatore di scroll del motore è senza
   testo). **Tolta** il 07/11 con l'ok della regia.
4. **§6.6 nessun prima/dopo con linea o slider:** in home **rispettato** (la rivelazione è una zona
   morbida, nessuna linea). In SYSTEM non c'è una linea di confronto, ma c'è una timeline trascinabile:
   vedi C3.
5. **§6.3bis stesso mondo o mondi paralleli:** **non scelto.** Oggi i micro-loop del secondo livello sono
   ricavati dalla stessa immagine di ogni scena, quindi di fatto mostrano lo stesso mondo, ma è solo
   una conseguenza dei segnaposto: basta cambiare `hoverClip` nel manifest, il codice regge entrambe
   le strade.
6. **Documenti citati e mancanti:** vedi 8.4.

### 8.3 Altro emerso dai documenti

- **Credito fondatori in footer (§5):** previsto "chi c'è dietro HEY", solo nomi e ruolo, stile credits.
  Sul sito non c'è; il formato è ancora aperto (§10).
- **"HEY / THE IDEA":** nello storyboard è la chiusura del film ("HEY — THE IDEA", logo con "THE IDEA"
  sotto). La scritta che ho tolto dalla reference della scena 03 era probabilmente quella dicitura,
  messa lì dalla generazione, non un difetto casuale. Su un segnaposto toglierla resta corretto, ma va
  segnalato: l'originale è nella storia git (commit 0d9b77e) e si ripristina in un attimo.
  "THE IDEA" sotto il logo è un **terzo descrittore** oltre ad "AI GENERATIVE MEDIA" e a "HUMAN.
  EVOLUTION. YDEA.": da chiarire con Massimiliano quale vale.
- **Copy del viaggio:** il concept v02 §15 prevede HEY. / IDEA. / DIRECTION. / PRODUCTION. / POST. /
  COLOR. / RESULT. / YOUR IDEA. Il sito ne usa 5, coerenti con la spec v2 a 6 clip. Copy definitivo non
  chiuso (§8).
- **Storyboard 16 tavole contro 6 clip:** la spec v2 raggruppa le 16 tavole in intro + loop + 4 clip.
  La chiusura dello storyboard dice "YOUR IDEA. WHAT'S YOUR IDEA? LET'S MAKE IT REAL.": sul sito c'è
  "YOUR IDEA. LET'S MAKE IT REAL." (manca la domanda centrale).
- **Spec clip:** 30 fps, 1080p, GOP 8, senza audio. Il motore è pronto; i micro-loop della rivelazione
  (segnaposto, 854×480, 24 fps) non sono coperti dalla spec.
- **Cucitura loop → prima clip (§6.3ter):** flash o blur di 150–250 ms. Da fare quando arrivano le clip.

### 8.4 Documenti ancora mancanti: quali servono davvero

| Documento | Serve? | Perché |
|---|---|---|
| `HEY_Il_Viaggio_a_Ritroso_Nuovo_Concept_v02.md` | Arrivato (07/11) | Vedi 8.5 |
| `HEY_Stato_e_Prossimi_Passi.md` | Arrivato (07/11) | Vedi 8.6 |
| `HEY_Reference_Prompts_Viaggio.md` | Più avanti | Serve quando si producono le clip e i connettori (le note di regia rimandano al suo §6) |
| `HEY_Scroll_World_Higgsfield_Documento_per_Claude_v01.md` | No, per ora | Il motore è già scelto e montato; utile solo se si genera con Higgsfield |
| `HEY_Bibbia_di_Progetto.md` | No | Business e governance, non decisioni sul sito |

### 8.5 Concept del viaggio v02: copy e struttura A→J contro il manifest

**Copy (§15 del concept)** — "coordinate del processo", copy *non chiuso* (lo dice il concept stesso):

| Concept §15 | Sito oggi |
|---|---|
| HEY. | HEY. (loop) |
| IDEA. | IDEA. (ritorno-inizio) |
| DIRECTION. | DIRECTION. (ritorno-meta) |
| PRODUCTION. | PRODUCTION. (mondo-smontato) |
| POST. | — manca |
| COLOR. | — manca |
| RESULT. | — manca |
| YOUR IDEA. | YOUR IDEA. (arrivo) |

Il problema non è solo che mancano tre parole: **l'ordine sul sito va contro il film.** Il §15 elenca le
parole nell'ordine del processo (idea → regia → produzione → post → color → risultato), ma il viaggio
corre al contrario (§1: RISULTATO → PRODUZIONE → ORIGINE). Oggi il sito scrive **IDEA.** sopra il mondo
impossibile, che nel film è il **risultato**, e **DIRECTION.** sopra l'acqua che si ritira, che è
produzione/post. Lette in reverse, le otto parole si allineano al film da sole:

| Momento del manifest | Beat A→J | Proposta (solo proposta, il copy lo decide Massimiliano) |
|---|---|---|
| intro + loop | A | HEY. |
| ritorno-inizio | B (+ inizio C) | RESULT. |
| ritorno-meta | C → D (generato che si dissolve, look tolto, acqua che scende) | COLOR. / POST. |
| mondo-smontato | E → F → G (scenografia, carrello, camera) | PRODUCTION. |
| arrivo | H → I → J (preparazione, arrivo, set vuoto) | DIRECTION. → IDEA. → YOUR IDEA. |

Applicarla vuol dire cambiare solo i campi `title` (e `label`) nel manifest: nessuna riga di codice.
Anche la chiusura: lo storyboard dice "YOUR IDEA. WHAT'S YOUR IDEA? LET'S MAKE IT REAL."; il sito ha
"YOUR IDEA. LET'S MAKE IT REAL.".

**Struttura A→J contro i 6 momenti** — non cambia l'architettura (il manifest regge qualunque numero
di sezioni senza toccare il codice), ma mostra due punti stretti:
1. **G e H sono compressi.** La camera presa, la REC che si spegne e la camera sul banco (G), poi
   make-up, hair, styling e crew (H): nello storyboard sono 7 tavole su 16 (08–14), sul sito stanno tutte
   tra la coda di `mondo-smontato` e `arrivo`. Con le clip vere probabilmente serve un **settimo momento**
   (es. `camera` tra mondo-smontato e arrivo) o i connettori della spec.
2. **Post e color (§11) non hanno un momento proprio**: vivono dentro `ritorno-meta`. Se le parole
   POST. / COLOR. entrano, conviene dare loro uno spazio di scroll leggibile.

**Altri punti del concept da tenere a mente**
- Durata: lo storyboard indica 60–90 s a 25 fps; la spec v2 3–6 s per clip a 30 fps (≈ 25–35 s in
  tutto). Le due cifre non tornano: da chiarire prima di produrre.
- A: nel loop la donna entra ed esce dalla colonna e dice HEY; sul sito l'uscita dalla colonna è
  nell'intro (spec v2). Coerente.
- §18 "Nessun prima/dopo con slider": la home lo rispetta; per lo scrub di SYSTEM vedi C3.
- §17 "Non è una dimostrazione di quanto sappiamo generare": è un argomento in più per la versione
  "stesso mondo" del §6.3bis, che però resta aperto.

### 8.6 Stato e prossimi passi (17/08)
- Conferma C2: il sito v1 a sezioni impilate (nuotatore, comparator, testi istruttivi) era stato scartato
  il 16/08.
- Il descrittore "AI GENERATIVE MEDIA" ribaltava una decisione chiusa il giorno prima: il documento
  stesso chiede una **conferma diretta di Gianluca prima del lancio**. Rafforza la domanda C.
- Le priorità di agosto (shot list, prototipo, girato o generato, revisione di Gianluca) restano tutte
  aperte e sono a monte delle clip vere: senza di esse il blocco 8 (contenuti reali) non può partire.
- Il "prototipo 20–30 s canvas o video" è superato: il motore video è stato chiuso lo stesso giorno ed è
  già montato.
- Citati ma non nel repository: `HEY_Moodboard_Viaggio_a_Ritroso.png` (utile per le scelte visive,
  non bloccante), `README_STRUTTURA.md`, `HEY_01_Istruzioni_di_Progetto.md` (non servono al sito).

---

## 9. Decisioni di Massimiliano sui conflitti (07/11/2026, sera) — applicate

| | Decisione | Sul sito |
|---|---|---|
| E | Parole del viaggio **in reverse** + domanda finale dello storyboard | loop HEY. · ritorno-inizio RESULT. · ritorno-meta COLOR. POST. · mondo-smontato PRODUCTION. · arrivo DIRECTION. → IDEA. / YOUR IDEA. Finale: "YOUR IDEA. WHAT'S YOUR IDEA? LET'S MAKE IT REAL." Solo manifest e una riga di HTML |
| A | **SYSTEM tolta.** Menu Work / About / Network / Contact | Pagina, scrub, Lab e frame del nuotatore rimossi (restano nella storia git). `system/` rimanda alla home: funziona su GitHub Pages e su Vercel senza regole server. Nessun link verso system/ rimasto |
| — | Nuotatore | Torna disponibile. Il §4.2 lo suggerisce come case study in WORK: **non messo, serve l'ok** |
| B | Telefono: **solo swipe** | Rivelazione automatica tolta; swipe avanti/indietro tra le scene resta |
| C | Descrittore **"AI GENERATIVE MEDIA"** | Lockup vettoriale `assets/img/brand/hey-lockup.svg` (wordmark del sito + descrittore vettorializzato dal raster). **In navbar solo il wordmark**: alla misura della nav (42–58 px) il descrittore è alto circa 5 px e non si legge (prova visiva). **Lockup nel footer** di tutte le pagine con footer, home compresa (sezione finale). **Da confermare con Giangi prima del lancio** (lo chiede lo Stato di agosto) |

Ancora aperti: §6.3bis (stesso mondo o mondi paralleli), credito fondatori in footer, crediti sui lavori,
clip vere e shot list, indirizzo e telefono, dominio e immagine social, "THE IDEA" come eventuale
chiusura del logo (storyboard).
