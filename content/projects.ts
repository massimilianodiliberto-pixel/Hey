// MATERIA VIVA — i progetti. Si aggiornano qui, senza toccare il sistema particellare.
// Fatti confermati da Massimiliano: Crash Test e K+ Imaginary Studio (case di produzione create da
// Giangi, direzione generale artistica), Match Music (creato da lui, tra i primi programmi TV in
// Italia su musica e video), copertine di dischi di artisti italiani (nomi da confermare: non
// citarli), interior design per grandi strutture, art director di Wella al Cosmoprof per molti anni.
// Tutto il resto è PLACEHOLDER. L'anno compare solo nella scheda, mai nel percorso.

export type Discipline =
  | "Regia"
  | "Video production"
  | "Television"
  | "Advertising"
  | "Music video"
  | "Visual effects"
  | "Color grading"
  | "AI & Digital Creative Production"
  | "Art direction"
  | "Interior design";

export type Project = {
  id: string;
  phase: "ricordo" | "salto" | "espansione" | "composizione"; // dove emerge dalla materia
  discipline: Discipline;
  title: string;
  year: string;
  role: string;
  description: string;
  credits: { role: string; name: string }[];
  video?: { src: string; poster: string }; // file self-hosted: per ora clip simulata
  images?: string[];
  fullWorkUrl?: string;
  tint: [string, string]; // colori del segnaposto, finché non arrivano immagini vere
};

const ph = "PLACEHOLDER";

export const projects: Project[] = [
  {
    id: "primo-spot",
    phase: "ricordo",
    discipline: "Advertising",
    title: "Il primo spot",
    year: `${ph} — anno`,
    role: "Regia",
    description: `${ph} — il primo spot: cliente, idea, cosa ha lasciato.`,
    credits: [{ role: "Regia", name: "Gianluca Magnoni" }],
    tint: ["#3a2412", "#8a5a2b"],
  },
  {
    id: "copertine",
    phase: "ricordo",
    discipline: "Art direction",
    title: "Copertine di dischi",
    year: `${ph} — anni`,
    role: "Art direction",
    description: `Copertine per artisti italiani. ${ph} — artisti e titoli da confermare.`,
    credits: [{ role: "Art direction", name: "Gianluca Magnoni" }],
    tint: ["#2a1810", "#b8692a"],
  },
  {
    id: "match-music",
    phase: "ricordo",
    discipline: "Television",
    title: "Match Music",
    year: `${ph} — anni`,
    role: "Ideazione",
    description: `Un programma televisivo sulla musica e i suoi video, tra i primi in Italia. ${ph} — dettagli da confermare.`,
    credits: [{ role: "Ideazione", name: "Gianluca Magnoni" }],
    tint: ["#2b1408", "#d08a3c"],
  },
  {
    id: "crash-test",
    phase: "salto",
    discipline: "Video production",
    title: "Crash Test",
    year: `${ph} — anni`,
    role: "Fondatore · Direzione generale artistica",
    description: `Casa di produzione video: spot, video musicali, VFX. ${ph} — lavori da selezionare.`,
    credits: [{ role: "Direzione artistica", name: "Gianluca Magnoni" }],
    tint: ["#2a0806", "#c23a1c"],
  },
  {
    id: "k-plus",
    phase: "salto",
    discipline: "Video production",
    title: "K+ Imaginary Studio",
    year: `${ph} — anni`,
    role: "Fondatore · Direzione generale artistica",
    description: `Casa di produzione video: spot, video musicali, VFX all'avanguardia per l'epoca. ${ph} — lavori da selezionare.`,
    credits: [{ role: "Direzione artistica", name: "Gianluca Magnoni" }],
    tint: ["#1d0605", "#8f2a14"],
  },
  {
    id: "video-musicali",
    phase: "espansione",
    discipline: "Music video",
    title: "Video musicali",
    year: `${ph} — anni`,
    role: "Regia",
    description: `${ph} — una selezione di video musicali.`,
    credits: [{ role: "Regia", name: "Gianluca Magnoni" }],
    tint: ["#06181b", "#1f5a60"],
  },
  {
    id: "interior",
    phase: "espansione",
    discipline: "Interior design",
    title: "Interior design",
    year: `${ph} — anni`,
    role: "Progetto degli spazi",
    description: `Interni per grandi strutture. ${ph} — luoghi e immagini da confermare.`,
    credits: [{ role: "Progetto", name: "Gianluca Magnoni" }],
    tint: ["#0b1f22", "#c99a4a"],
  },
  {
    id: "wella",
    phase: "espansione",
    discipline: "Art direction",
    title: "Wella al Cosmoprof",
    year: `${ph} — anni`,
    role: "Art director",
    description: `Art director di Wella al Cosmoprof per molti anni. ${ph} — edizioni e immagini da confermare.`,
    credits: [{ role: "Art director", name: "Gianluca Magnoni" }],
    tint: ["#081416", "#7fa9ac"],
  },
  {
    id: "spot",
    phase: "composizione",
    discipline: "Advertising",
    title: "Spot",
    year: `${ph} — anno`,
    role: "Regia",
    description: `${ph} — uno spot: cliente, idea, produzione.`,
    credits: [{ role: "Regia", name: "Gianluca Magnoni" }],
    tint: ["#16181a", "#8c8f92"],
  },
  {
    id: "vfx",
    phase: "composizione",
    discipline: "Visual effects",
    title: "VFX",
    year: `${ph} — anno`,
    role: "Supervisione VFX",
    description: `${ph} — un lavoro di effetti visivi, dal set alla composizione finale.`,
    credits: [{ role: "VFX", name: "Gianluca Magnoni" }],
    tint: ["#111214", "#c7c9cc"],
  },
  {
    id: "regia",
    phase: "composizione",
    discipline: "Regia",
    title: "Regia",
    year: `${ph} — anno`,
    role: "Regia",
    description: `${ph} — un lavoro di regia.`,
    credits: [{ role: "Regia", name: "Gianluca Magnoni" }],
    tint: ["#1a1b1d", "#5f6266"],
  },
];

export const sheetUi = {
  close: "Chiudi",
  open: "Apri il progetto",
  role: "Ruolo",
  year: "Anno",
  credits: "Crediti",
  fullWork: "Watch full work",
  clip: "PLACEHOLDER — clip simulata",
};
