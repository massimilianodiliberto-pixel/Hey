// MATERIA VIVA — testi dell'esperienza. Tutto qui, niente testo nei componenti.
// Nomi delle fasi e sottotitoli dal moodboard di Massimiliano. Le frasi tra virgolette sono di Giangi
// (origin "sua" in content/stations.ts): non riscriverle.

export const materia = {
  mark: "G",
  person: "Gianluca Magnoni",
  nickname: "Giangi",
  title: "Materia Viva",
  subtitle: "Un viaggio attraverso esperienze, progetti e trasformazioni.",
  opening: "Non sono mai stato un regista classico.",
  claim: "Everything is in motion.",
  index: "Evoluzione narrativa",
  preview: "Anteprima — contenuti PLACEHOLDER",
};

export type Phase = { id: string; name: string; title: string; line?: string; note?: string };

export const phases: Phase[] = [
  { id: "nascita", name: "Nascita", title: "L'idea", note: "Materia Viva · Everything is in motion" },
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
    title: "To be continued.",
    line: "La prossima la scriviamo insieme.",
  },
];

// Chiusura: contatto diretto con Giangi. Demo: indirizzo e showreel arrivano da lui.
export const contact = {
  email: "", // PLACEHOLDER — indirizzo email di Giangi
  showreel: "", // PLACEHOLDER — link alla showreel
  hello: "Mandami un saluto",
  need: "Hai bisogno di me?",
  more: "Approfondisci Giangi",
  form: {
    title: "Hai bisogno di me?",
    name: "Nome",
    mail: "La tua email",
    message: "Raccontami il progetto",
    send: "Invia",
    close: "Chiudi",
    demo: "Demo: l'indirizzo email di Giangi è in arrivo. Il messaggio non è stato inviato.",
  },
  placeholder: "PLACEHOLDER",
};
