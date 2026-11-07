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
| 0 | Decisioni | Prese da Massimiliano (vedi HISTORY.md); nuotatore nello scrub di SYSTEM tenuto in via provvisoria |
| 1 | Pulizia | Fatto |
| 2 | Scia lime nella rivelazione (fasce lime restano, scelta di Massimiliano) | Fatto |
| 3 | Mobile: swipe tra le scene + percorso automatico | Fatto |
| 4 | SYSTEM + scrub di processo | Fatto |
| 5 | Transformation Lab | Struttura con segnaposto fatta; mancano i frame |
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
