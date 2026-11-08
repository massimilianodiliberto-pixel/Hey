# Punto G — Brief per Claude Code

Punto G è il nome di lavoro della nuova home page del sito di Giangi.

Fase 1: motore di scroll e prototipo. I contenuti sono segnaposto e verranno sostituiti.

---

## 0. Dove lavorare

> **Aggiornamento (decisioni del 07/10/2026).** I punti 2, 3 e 6 qui sotto sono superati:
> - il progetto vive in un **branch orfano `punto-g`** del repository HEY, vuoto, senza i file
>   di HEY e senza il workflow di GitHub Pages;
> - l'app Next.js sta **alla radice di quel branch**, non in una cartella `punto-g/`;
> - **nessun codice o stile preso da HEY**: il motore di scroll si scrive da zero;
> - nessun push sugli altri branch, nessuna pubblicazione. Il repository è pubblico: è
>   un'anteprima temporanea per Giangi, poi il progetto verrà spostato altrove.

1. Prima di creare qualsiasi file, leggi la struttura del repository e riportami: cosa contiene,
   come è organizzato, dove e come viene pubblicato. Fermati e aspetta conferma.
2. ~~Crea una cartella `punto-g/` alla radice, con una sua app Next.js autonoma: `package.json`,
   dipendenze, configurazione e build propri.~~
3. ~~Non modificare, spostare o rimuovere nessun file fuori da `punto-g/`. L'app HEY esistente
   non va toccata, nemmeno per aggiornare dipendenze o configurazioni condivise.~~
4. Lavora su un branch dedicato `punto-g`. Nessun push su `main`, nessun merge senza richiesta
   esplicita.
5. Metti nel progetto anche questo brief (`BRIEF.md`), il file `content/stations.ts` fornito e la
   cartella `reference/`.
6. ~~La pubblicazione sarà un progetto separato con root directory `punto-g/`. Non configurarla
   ora: preparala e descrivi i passaggi.~~
7. I materiali video e fotografici veri non vanno nel repository. Per ora solo segnaposto leggeri.

---

## 1. Cosa stiamo costruendo

Il sito personale di un regista che "non è mai stato un regista classico". Non è un portfolio e
non è una timeline. È un viaggio che parte da qualcosa di astratto e arriva a una persona reale.

> **Aggiornamento (decisione di Massimiliano, 07/11/2026).** Niente più metafora del corpo. Le
> stazioni sono i **sensi**. Il viaggio **va avanti e indietro, saltando nel tempo** tra
> esperienze diverse. Nel sito restano **solo le frasi di Giangi**.
>
> **Aggiornamento (08/11/2026).** Il viaggio si svolge lungo una **colonna astratta in 3D**: una
> spirale di vertebre scolpite che gira, si stringe e si allarga con lo scroll. La colonna è il
> tempo: ogni esperienza sta alla vertebra della sua epoca, il salto nel tempo è la camera che
> scatta lungo la colonna (che si svita tornando indietro). I ricordi escono dalle vertebre. Si
> chiude con i titoli di coda e «Continua». Teatro di posa al buio, luce al tungsteno. Three.js.

L'utente attraversa i sensi che il lavoro gli ha aperto, uno alla volta. Ogni senso nasce da
un'esperienza della sua vita professionale: non cosa ha fatto, ma cosa gli ha lasciato. Il
viaggio salta avanti e indietro nel tempo tra queste esperienze, senza mai diventare una
cronologia. Alla fine i sensi si collegano e compare lui.

Sensazione da ottenere: "sto attraversando un film", non "sto scrollando un sito".

---

## 2. Regola di regia: tre tempi distinti

Questa è la regola più importante. Non mescolare i tre tempi.

1. **Clip = esperienza (il tempo scorre).** Arrivando su una stazione parte da sola una clip da
   13-15 secondi. È il passato: quello che ha ricevuto.
2. **Freeze = il senso si apre (il tempo si ferma).** La clip si blocca su un fotogramma chiave.
   Da lì l'immagine è congelata e lo scroll muove la camera dentro quell'istante fermo. È il
   momento centrale di ogni stazione: mentre la camera si muove nel tempo fermo compare il nome
   del senso.
3. **Scroll = macchina da presa.** Continuando a scrollare compare la riga "oggi", poi la scena
   congelata si trasforma nella stazione successiva. Tutto in scrub, nessuna animazione
   scollegata dal movimento dell'utente.

Regole di interazione:

- Il fotogramma su cui la clip si ferma coincide con il primo frame della sequenza congelata. Il
  passaggio deve essere invisibile.
- Se l'utente scrolla prima che la clip finisca, la clip sfuma rapidamente sul fotogramma chiave
  e il freeze parte comunque.
- La stazione è una sosta, non un blocco. Il viewport resta pinnato per un tratto lungo di
  scroll, così l'utente sente di essersi fermato, ma lo scroll non viene mai disabilitato.
- Se l'utente non scrolla, il freeze avanza da solo, lentamente, fino alla fine della sequenza, e
  compaiono senso e riga "oggi". Poi un invito discreto a proseguire.
- In qualsiasi momento lo scroll prende il controllo del freeze dal punto in cui si trova, senza
  salti.
- Finito il freeze, lo scroll riprende e porta alla stazione successiva.
- Aggancio morbido alle stazioni (snap leggero, disattivabile da un flag) per aiutare l'utente ad
  atterrare sul punto giusto.
- Se una stazione ha più clip, solo l'ultima porta al freeze. Le altre si saltano con lo skip.
- Scrollando all'indietro si ripercorre il freeze al contrario e la clip non riparte.

---

## 3. Struttura: stazioni, non sezioni

Niente Opening / Intro / Projects / Closing. La struttura è:

- **Apertura:** forma astratta, nessun volto, una frase.
- **Stazioni** (i sensi, ognuno legato a un'esperienza): numero e ordine arrivano da un file dati.
  L'ordine alterna esperienze lontane e recenti.
- **Arrivo:** le stazioni si collegano con linee o richiami visivi e la forma astratta diventa
  una persona.

Ogni stazione è una scena pinnata costruita su piani (background, midground, foreground, testo).
La scena successiva emerge dalla trasformazione della precedente, non la sostituisce con uno
stacco.

### Il salto nel tempo

Ogni esperienza ha nel file dati una posizione relativa nel tempo (`era`), che **non si vede mai**:
niente date, niente numeri. Serve solo a scegliere il movimento di camera tra due stazioni:

- **dopo** (esperienza più recente): la camera spinge oltre la scena e la successiva emerge da una
  finestra aperta in un elemento della precedente;
- **prima** (esperienza più lontana): la camera arretra, il presente si ritira in un cerchio e
  l'esperienza precedente si chiude attorno, velata come un ricordo, fino a tornare nitida.

Durante la transizione compare una parola sola, piccola: «prima», «dopo» oppure «oggi» (verso
l'arrivo).

### Navigazione non lineare (obbligatoria)

- Un indice sempre raggiungibile, discreto, che permette di saltare a qualunque stazione.
- Ogni stazione può avere dei richiami: collegamenti ad altre stazioni che l'utente può seguire.
  Il salto è una transizione animata, non un reload.
- L'ordine delle stazioni non deve mai leggersi come cronologia: niente date, niente numerazione
  progressiva in evidenza.

---

## 4. Contenuti: tutto in un file dati

Nessun contenuto scritto nei componenti. Un unico file `content/stations.ts` con questo schema:

```ts
type Origin = "sua" | "inventata"; // "sua" = frase del cliente, "inventata" = PLACEHOLDER

type Clip = {
  title: string;
  src: string;          // file self-hosted, 13-15s
  poster: string;
  mode: "single" | "montage"; // montage = 5-10 frammenti rapidi + scritta finale
  caption?: string;     // scritta finale del montage
  fullWorkUrl?: string; // link Vimeo "watch full work"
};

type Line = { text: string; origin: Origin };

type Station = {
  id: string;           // "ritmo"
  sense: string;        // "Senso del ritmo": titolo che compare nel freeze
  senseOrigin: Origin;
  worlds: string[];     // l'esperienza: titolo grande durante la clip
  era: number;          // posizione relativa nel tempo, mai mostrata
  received: Line | null; // sua frase su quell'esperienza; null se non ce n'è una sua
  today: Line | null;    // sua frase al presente; null se non ce n'è una sua
  scene: {
    type: "sequence" | "video" | "image" | "placeholder";
    src?: string;       // cartella frame o file
    frames?: number;
  };
  clips: Clip[];        // l'ultima clip è quella che porta al freeze
  freeze?: { src: string; frames: number }; // sequenza congelata, parte dall'ultimo fotogramma dell'ultima clip
  fragments?: { type: "photo" | "note"; src?: string; text?: string }[]; // pop-up
  links?: string[];     // id delle stazioni richiamate
};
```

Il file esporta anche `opening` (la frase di apertura) e `arrival` (scena di arrivo: senso
"Istinto", stazione da cui partono le linee, frase, chiusura, nome, ritratto e contatti).

Aggiungere, togliere o riordinare stazioni deve richiedere solo la modifica di questo file.

### Contenuti di prova

Sei sensi, ognuno legato a un'esperienza: immagine (origini, Asenawer, il primo spot), ritmo
(Match Music, DJ Television, video musicali), rischio (pubblicità), spazio (grandi eventi,
design), orientamento (le società), misura (i picchi). Più apertura e arrivo. I sensi, «Istinto» e
gli `era` sono PLACEHOLDER. `"sua"` è una frase del cliente e non va riscritta. **Nel sito non
compaiono righe scritte da noi**: dove non c'è una sua frase, il campo è `null`.

Le clip hanno due modalità:

- `single`: una clip da 13-15 secondi.
- `montage`: 5-10 frammenti rapidi in sequenza dentro la stessa durata, con una scritta finale
  (`caption`). Serve dove la quantità è il messaggio.

**Principio:** ogni esperienza gli ha aperto un senso. Ogni stazione ha tre battute, legate ai
tre tempi della regia:

1. **Esperienza** (`worlds`, più la sua frase in `received` se c'è): cosa ha preso da quel mondo.
   Lo mostrano le clip; il nome del mondo è il titolo grande durante la clip.
2. **Senso** (`sense`): il senso che gli si è aperto, ad esempio "Senso del ritmo". È il titolo
   che compare nel freeze.
3. **Oggi** (`today`): come quel senso ha ampliato istinto e visione. Una riga al presente, che
   compare per ultima.

Sequenza in ogni stazione: clip con il mondo (e la sua frase, se c'è) → freeze con il senso →
riga "oggi" se c'è → transizione «prima» o «dopo». Massimo 25 parole di testo per stazione (`sense` escluso).

**Accumulo.** Ogni senso aperto resta visibile come traccia discreta ai margini del viewport per
tutto il resto del viaggio. Stazione dopo stazione i sensi si sommano. Nella scena di arrivo
convergono attorno alla persona e compare la parola "Istinto". Se l'utente salta con l'indice, i
sensi delle stazioni non visitate restano spenti.

La stazione dell'orientamento richiama tutte le altre: spostarsi è ciò che collega le esperienze.
Nella scena di arrivo le linee che collegano i sensi partono da lì.

Ogni segnaposto deve essere marcato PLACEHOLDER nel file dati.

Per le scene, in assenza di materiale, usare `type: "placeholder"`: forme semplici generate in
CSS o canvas su fondo neutro, sufficienti a leggere scala, profondità e transizioni. Per le clip,
generare brevi video segnaposto o campi di colore con timer visibile.

---

## 5. Il freeze: implementazione

Ogni stazione ha una sola sequenza congelata (`freeze` nel file dati): immagini WebP disegnate su
canvas e scrubbate dallo scroll. Mostrano la camera che si muove dentro un istante fermo.
Verranno prodotte in un secondo momento a partire dal fotogramma chiave della clip.

- Il primo frame della sequenza è identico all'ultimo fotogramma mostrato dalla clip: stesso
  formato, stesso crop, stessa posizione a schermo.
- Precaricamento della sequenza mentre la clip è in riproduzione.
- Scroll avanti e indietro percorre la sequenza in entrambi i versi.
- Da fermo, il frame resta nitido e immobile: niente drift, niente loop decorativi.
- Su mobile: sequenze più corte e a risoluzione ridotta, oppure fallback a fotogramma fisso con
  parallax leggero.
- Nel prototipo, in assenza di sequenze vere, simulare il freeze con il fotogramma fermo separato
  in due o tre piani e mosso in parallax.

---

## 6. Linguaggio visivo

- Fondo neutro. Molto spazio vuoto. Immagini che compaiono e spariscono.
- Minimal, editoriale, pulito, con un margine di surreale: accostamenti inattesi, scale sbagliate
  apposta, oggetti fuori posto. Mai illustrazione anatomica, mai estetica medica.
- Tipografia sobria, una famiglia, due pesi al massimo.
- Pop-up e frammenti: piccoli, sparsi, chiudibili, mai modali a tutto schermo.

**Da evitare:** neon, gradienti tecnologici, particelle, effetti futuristici, interfacce da
software, bounce, animazioni decorative senza funzione, elementi che saltano, scroll hijacking
aggressivo.

**Da preferire:** easing morbidi, dissolvenze, maschere e clip-path, scaling, parallax
controllato, sovrapposizioni.

---

## 7. Stack

- Next.js (App Router) + TypeScript
- GSAP + ScrollTrigger per pinning, scrub e timeline
- Lenis per lo scroll inerziale, solo desktop; scroll nativo su touch
- Canvas 2D per le sequenze
- Video self-hosted (MP4 H.264 + WebM), `muted`, `playsInline`, con poster. Vimeo solo come link
  esterno, nessun embed
- CSS moderno, HTML semantico

Decisioni ancora aperte, da lasciare configurabili:

- **Audio:** clip mute di default, con un controllo audio globale attivabile da un flag.
- **Lingua:** tutte le stringhe nel file dati, struttura pronta per italiano e inglese.

---

## 8. Performance e accessibilità

- Animare solo `transform` e `opacity`. Nessun layout thrashing.
- Lazy loading di scene e clip: caricare la stazione corrente e la successiva, scaricare quelle
  lontane.
- Una sola clip in riproduzione alla volta.
- `prefers-reduced-motion`: niente scrub, stazioni come pagine statiche con dissolvenza, clip con
  avvio manuale.
- Navigazione da tastiera per indice, skip e richiami.

---

## 9. Responsive

Due comportamenti, non una versione scalata.

- **Desktop:** esperienza completa, piani multipli, sequenze piene.
- **Mobile:** verticale, meno piani, pin più brevi, sequenze alleggerite. Il principio resta: lo
  scroll trasforma la scena.

---

## 10. Ordine di lavoro

**Passo 0. Riferimento.** Nella cartella `/reference` trovi fotogrammi in sequenza del sito di
riferimento e una descrizione scritta. Prima di scrivere codice, analizza: cosa resta fisso, cosa
si muove, cosa entra, cosa esce, cosa cambia scala, cosa si trasforma, cosa si sovrappone, dove
avvengono le transizioni, quanto dura ogni fase, come lo scroll controlla ogni trasformazione.
Scrivi il risultato in `TIMELINE.md` come tabella di scroll progress. Fermati e aspetta conferma.

**Passo 1. Prototipo.** Costruisci solo questo:

- apertura + due stazioni + la transizione tra loro
- una clip con autoplay, titolo, skip e link "watch full work"
- il passaggio clip → freeze sul fotogramma chiave, con il freeze simulato in parallax
- comparsa del senso durante il freeze e della riga "oggi" subito dopo
- la traccia del senso che resta accesa ai margini
- indice con salto diretto a una stazione
- un richiamo tra le due stazioni
- versione mobile dello stesso tratto

Fermati e aspetta approvazione del comportamento.

**Passo 2. Estensione.** Solo dopo l'approvazione: tutte le stazioni dal file dati, scena di
arrivo con i collegamenti, pop-up e frammenti, supporto sequenze.

---

## 11. Cosa non fare

- Non costruire tutte le stazioni prima che il prototipo sia approvato.
- Non inserire contenuti reali, nomi di clienti o premi: non sono ancora confermati.
- Non usare animazioni triggerate all'ingresso nel viewport al posto dello scrub.
- Non trasformare l'ordine delle stazioni in una cronologia.
