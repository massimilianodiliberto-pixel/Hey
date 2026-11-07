// content/stations.ts
// CONTENUTI DI PROVA. Da sostituire con materiale confermato dal cliente.
// origin: "sua" = frase detta da lui in call | "inventata" = PLACEHOLDER scritto da noi
//
// Struttura (decisione di Massimiliano, 07/11/2026): le stazioni sono i SENSI, non parti del corpo.
// Ogni senso nasce da un'esperienza (worlds). Il viaggio salta avanti e indietro nel tempo.
//
// Ogni stazione segue i tre tempi della regia:
//   worlds   = l'esperienza: titolo grande durante la clip (il passato)
//   sense    = il senso che gli si è aperto: compare nel freeze
//   received = una sua frase su quell'esperienza, SOLO se è sua. Altrimenti null: nessuna riga.
//   today    = una sua frase al presente, SOLO se è sua. Altrimenti null.
// Nel sito ci sono solo le sue frasi: nessuna riga scritta da noi.
//
// era = posizione relativa dell'esperienza nel tempo. Non si vede MAI nel sito (niente date, niente
// numeri): serve al motore per scegliere il movimento di camera («prima» o «dopo»).
// Gli era attuali sono PLACEHOLDER, ordine provvisorio da confermare con Giangi.
//
// L'ordine delle stazioni in questo array è l'ordine del viaggio: alternato, lontano / recente.
// Le frasi con origin "sua" vanno riportate parola per parola: non riscriverle.

type Origin = "sua" | "inventata";

export type Clip = {
  title: string;
  src: string;
  poster: string;
  mode: "single" | "montage"; // montage = 5-10 frammenti rapidi + scritta
  caption?: string;
  fullWorkUrl?: string;
};

export type Line = { text: string; origin: Origin };

export type Station = {
  id: string;
  sense: string; // "Senso del ritmo": titolo che compare nel freeze
  senseOrigin: Origin;
  worlds: string[]; // l'esperienza da cui nasce il senso
  era: number; // ordine relativo nel tempo, mai mostrato
  received: Line | null;
  today: Line | null;
  scene: { type: "sequence" | "video" | "image" | "placeholder"; src?: string; frames?: number };
  clips: Clip[]; // l'ultima clip è quella che porta al freeze
  freeze?: { src: string; frames: number }; // sequenza congelata: parte dal fotogramma finale dell'ultima clip
  fragments?: { type: "photo" | "note"; src?: string; text?: string }[];
  links?: string[];
};

export const opening = {
  line: "Non sono mai stato un regista classico.",
  origin: "sua" as Origin,
};

export const stations: Station[] = [
  {
    id: "immagine",
    sense: "Senso dell'immagine", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["origini", "Asenawer", "il primo spot"], // Asenawer: ORTOGRAFIA DA VERIFICARE
    era: 1, // PLACEHOLDER
    received: null,
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Prima di tutto", src: "/clips/ph-01.mp4", poster: "/clips/ph-01.jpg", mode: "single" },
      { title: "PLACEHOLDER — Il primo spot", src: "/clips/ph-02.mp4", poster: "/clips/ph-02.jpg", mode: "single" },
    ],
    fragments: [{ type: "note", text: "PLACEHOLDER — foto di set, anno non indicato" }],
    links: ["rischio"],
  },
  {
    id: "orientamento",
    sense: "Senso dell'orientamento", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["le società"], // NOMI E NUMERO DA CHIEDERE
    era: 5, // PLACEHOLDER
    received: {
      text: "Sono eclettico. Ho spostato il culo dove mi conveniva, o dove mi riusciva meglio in quel momento.",
      origin: "sua",
    },
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Una società", src: "/clips/ph-10.mp4", poster: "/clips/ph-10.jpg", mode: "single" },
    ],
    // L'orientamento richiama tutti gli altri: lo spostarsi è ciò che collega le esperienze
    links: ["immagine", "ritmo", "rischio", "spazio", "misura"],
  },
  {
    id: "ritmo",
    sense: "Senso del ritmo", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["Match Music", "DJ Television", "video musicali"],
    era: 2, // PLACEHOLDER
    received: null,
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Match Music", src: "/clips/ph-03.mp4", poster: "/clips/ph-03.jpg", mode: "single" },
      { title: "PLACEHOLDER — DJ Television", src: "/clips/ph-04.mp4", poster: "/clips/ph-04.jpg", mode: "single" },
      {
        title: "Video musicali",
        src: "/clips/ph-05.mp4",
        poster: "/clips/ph-05.jpg",
        mode: "montage",
        caption: "Centinaia.",
      },
    ],
    links: ["immagine", "spazio"],
  },
  {
    id: "misura",
    sense: "Senso della misura", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["i picchi"],
    era: 6, // PLACEHOLDER
    received: {
      text: "Ci sono stati dei picchi alti che non ci sono più oggi, e che non ci saranno più domani così.",
      origin: "sua",
    },
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Il punto più alto", src: "/clips/ph-11.mp4", poster: "/clips/ph-11.jpg", mode: "single" },
    ],
    links: ["orientamento"],
  },
  {
    id: "rischio",
    sense: "Senso del rischio", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["pubblicità"],
    era: 3, // PLACEHOLDER
    received: null,
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Spot A", src: "/clips/ph-06.mp4", poster: "/clips/ph-06.jpg", mode: "single" },
      { title: "PLACEHOLDER — Spot B", src: "/clips/ph-07.mp4", poster: "/clips/ph-07.jpg", mode: "single" },
    ],
    links: ["immagine", "orientamento"],
  },
  {
    id: "spazio",
    sense: "Senso dello spazio", // PLACEHOLDER
    senseOrigin: "inventata",
    worlds: ["grandi eventi", "design"],
    era: 4, // PLACEHOLDER
    received: null,
    today: null,
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Un evento", src: "/clips/ph-08.mp4", poster: "/clips/ph-08.jpg", mode: "single" },
      { title: "PLACEHOLDER — Un oggetto", src: "/clips/ph-09.mp4", poster: "/clips/ph-09.jpg", mode: "single" },
    ],
    fragments: [{ type: "note", text: "PLACEHOLDER — backstage, montaggio palco" }],
    links: ["ritmo", "orientamento"],
  },
];

export const arrival = {
  id: "istinto",
  sense: "Istinto", // la somma dei sensi aperti — PLACEHOLDER
  senseOrigin: "inventata" as Origin,
  hub: "orientamento", // le linee dell'arrivo partono da qui
  line: "Quello che sono ora non può tornare a essere quello che è stato.",
  origin: "sua" as Origin,
  closing: "Anche oggi mi muovo da diverse situazioni.",
  closingOrigin: "sua" as Origin,
  name: "PLACEHOLDER — Nome",
  portrait: { src: "PLACEHOLDER — ritratto", alt: "PLACEHOLDER — ritratto" },
  contacts: [{ label: "PLACEHOLDER — contatti", href: "#" }],
};

// Stringhe dell'interfaccia. Struttura pronta per una seconda lingua (BRIEF §7).
export const ui = {
  index: "Indice",
  soon: "in arrivo",
  skip: "Salta",
  replay: "Rivedi",
  fullWork: "Watch full work",
  continue: "Continua",
  links: "Richiami",
  placeholderClip: "PLACEHOLDER — clip simulata",
  playClip: "Avvia clip",
  arrival: "Istinto",
  preview: "Anteprima — contenuti PLACEHOLDER",
  before: "prima",
  after: "dopo",
  now: "oggi",
};
