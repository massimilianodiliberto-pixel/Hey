// Flag e misure del prototipo. Le fasi in scroll sono in lib/phases.ts (specchio di TIMELINE.md).

export const config = {
  // Passo 1: solo apertura + queste due stazioni. Passo 2: tutte quelle in content/stations.ts.
  prototypeStations: ["occhi", "orecchie"],

  // Aggancio morbido alle stazioni (BRIEF §2). Disattivabile.
  snap: true,

  // Controllo audio globale (BRIEF §7, decisione aperta). Le clip segnaposto sono mute.
  audioControl: false,

  // Durata di ogni clip in secondi (BRIEF §2: 13-15 s).
  clipSeconds: 14,

  autoplay: {
    idleMs: 2000, // fermo da tanto così -> la sosta avanza da sola
    freezeSeconds: 14, // durata di un avanzamento completo da p 0 a fine sosta
    inviteDelayMs: 1500, // dopo la fine della sosta, l'invito a proseguire
  },

  scrub: { desktop: 0.6, mobile: 0.3 },
} as const;
