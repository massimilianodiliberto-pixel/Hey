// content/stations.ts
// CONTENUTI DI PROVA. Da sostituire con materiale confermato dal cliente.
// origin: "sua" = frase detta da lui in call | "inventata" = PLACEHOLDER scritto da noi
//
// Ogni stazione ha tre battute:
//   received = cosa ha ricevuto da quel mondo (passato)   -> lo mostrano le clip, lo dice una riga al passato
//   sense    = il senso che gli si è aperto               -> è il titolo che compare nel freeze
//   today    = come ha ampliato istinto e visione (presente)
// Budget testo: massimo 25 parole per stazione, sense escluso.
//
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

export type Station = {
  id: string;
  title: string; // parte del corpo
  sense: string; // "Senso del ritmo"
  senseOrigin: Origin;
  received: { text: string; origin: Origin };
  today: { text: string; origin: Origin };
  worlds: string[];
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
    id: "occhi",
    title: "Occhi",
    sense: "Senso dell'immagine",
    senseOrigin: "inventata",
    received: { text: "Una macchina da presa, prima ancora di un mestiere.", origin: "inventata" },
    today: { text: "Vedo l'inquadratura prima dell'idea.", origin: "inventata" },
    worlds: ["origini", "Asenawer (ORTOGRAFIA DA VERIFICARE)", "il primo spot"],
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Prima di tutto", src: "/clips/ph-01.mp4", poster: "/clips/ph-01.jpg", mode: "single" },
      { title: "PLACEHOLDER — Il primo spot", src: "/clips/ph-02.mp4", poster: "/clips/ph-02.jpg", mode: "single" },
    ],
    fragments: [{ type: "note", text: "PLACEHOLDER — foto di set, anno non indicato" }],
    links: ["fegato"],
  },
  {
    id: "orecchie",
    title: "Orecchie",
    sense: "Senso del ritmo",
    senseOrigin: "inventata",
    received: { text: "Televisione musicale tutti i giorni, senza rete.", origin: "inventata" },
    today: { text: "Monto a orecchio. Anche quando la musica non c'è.", origin: "inventata" },
    worlds: ["Match Music", "DJ Television", "video musicali"],
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
    links: ["occhi", "mani"],
  },
  {
    id: "fegato",
    title: "Fegato",
    sense: "Senso del rischio",
    senseOrigin: "inventata",
    received: { text: "Trenta secondi, soldi di altri, nessuna seconda occasione.", origin: "inventata" },
    today: { text: "So quando un'idea vale il rischio di proporla.", origin: "inventata" },
    worlds: ["pubblicità"],
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Spot A", src: "/clips/ph-06.mp4", poster: "/clips/ph-06.jpg", mode: "single" },
      { title: "PLACEHOLDER — Spot B", src: "/clips/ph-07.mp4", poster: "/clips/ph-07.jpg", mode: "single" },
    ],
    links: ["occhi", "gambe"],
  },
  {
    id: "mani",
    title: "Mani",
    sense: "Senso dello spazio",
    senseOrigin: "inventata",
    received: { text: "Cose che si toccano. Sale che si riempiono una sera sola.", origin: "inventata" },
    today: { text: "Penso un'immagine come un luogo in cui stare.", origin: "inventata" },
    worlds: ["grandi eventi", "design"],
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Un evento", src: "/clips/ph-08.mp4", poster: "/clips/ph-08.jpg", mode: "single" },
      { title: "PLACEHOLDER — Un oggetto", src: "/clips/ph-09.mp4", poster: "/clips/ph-09.jpg", mode: "single" },
    ],
    fragments: [{ type: "note", text: "PLACEHOLDER — backstage, montaggio palco" }],
    links: ["orecchie", "gambe"],
  },
  {
    id: "gambe",
    title: "Gambe",
    sense: "Senso dell'orientamento",
    senseOrigin: "inventata",
    received: {
      text: "Sono eclettico. Ho spostato il culo dove mi conveniva, o dove mi riusciva meglio in quel momento.",
      origin: "sua",
    },
    today: { text: "Quando cambia il terreno, non mi perdo.", origin: "inventata" },
    worlds: ["le società (NOMI E NUMERO DA CHIEDERE)"],
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Una società", src: "/clips/ph-10.mp4", poster: "/clips/ph-10.jpg", mode: "single" },
    ],
    // Gambe richiama tutte le altre: lo spostarsi è ciò che collega i mondi
    links: ["occhi", "orecchie", "fegato", "mani", "cuore"],
  },
  {
    id: "cuore",
    title: "Cuore",
    sense: "Senso della misura",
    senseOrigin: "inventata",
    received: {
      text: "Ci sono stati dei picchi alti che non ci sono più oggi, e che non ci saranno più domani così.",
      origin: "sua",
    },
    today: { text: "So cosa non torna. Lavoro con quello che c'è.", origin: "inventata" },
    worlds: ["i picchi"],
    scene: { type: "placeholder" },
    clips: [
      { title: "PLACEHOLDER — Il punto più alto", src: "/clips/ph-11.mp4", poster: "/clips/ph-11.jpg", mode: "single" },
    ],
    links: ["gambe"],
  },
];

export const arrival = {
  id: "lui",
  sense: "Istinto", // la somma dei sensi aperti
  senseOrigin: "inventata" as Origin,
  line: "Quello che sono ora non può tornare a essere quello che è stato.",
  origin: "sua" as Origin,
  closing: "Anche oggi mi muovo da diverse situazioni.",
  closingOrigin: "sua" as Origin,
  name: "PLACEHOLDER — Nome",
  portrait: { src: "PLACEHOLDER — ritratto", alt: "PLACEHOLDER — ritratto" },
  contacts: [{ label: "PLACEHOLDER — contatti", href: "#" }],
};
