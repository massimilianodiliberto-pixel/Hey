// MATERIA VIVA — testi dell'esperienza. Tutto qui, niente testo nei componenti.
// Nomi delle fasi e sottotitoli dal moodboard di Massimiliano. Le frasi tra virgolette sono di Giangi
// (origin "sua" in content/stations.ts): non riscriverle.

export const materia = {
  title: "Materia Viva",
  subtitle: "Un viaggio attraverso esperienze, progetti e trasformazioni.",
  opening: "Non sono mai stato un regista classico.",
  claim: "Everything is in motion.",
  index: "Evoluzione narrativa",
  preview: "Anteprima — contenuti PLACEHOLDER",
};

export type Phase = { id: string; name: string; title: string; line?: string; note?: string };

export const phases: Phase[] = [
  { id: "nascita", name: "Nascita", title: "L'idea" },
  {
    id: "ricordo",
    name: "Ricordo",
    title: "Le origini",
    note: "Il primo spot · Copertine di dischi · Match Music",
  },
  {
    id: "salto",
    name: "Salto",
    title: "Il cambiamento",
    line: "Sono eclettico. Ho spostato il culo dove mi conveniva, o dove mi riusciva meglio in quel momento.",
    note: "Crash Test · K+ Imaginary Studio",
  },
  {
    id: "espansione",
    name: "Espansione",
    title: "Nuove esperienze",
    note: "Video musicali · Interior design · Wella al Cosmoprof",
  },
  {
    id: "composizione",
    name: "Composizione",
    title: "Produzione e VFX",
    note: "Spot · VFX · Regia",
  },
  {
    id: "sintesi",
    name: "Sintesi",
    title: "Istinto",
    line: "Quello che sono ora non può tornare a essere quello che è stato.",
  },
  {
    id: "continua",
    name: "Continua",
    title: "Il futuro",
    line: "Anche oggi mi muovo da diverse situazioni.",
    note: "PLACEHOLDER — contatti",
  },
];
