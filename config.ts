// Flag e misure del prototipo. Le fasi in scroll sono in lib/phases.ts (specchio di TIMELINE.md).

export const config = {
  // Stazioni costruite. null = tutte quelle in content/stations.ts, nell'ordine del file.
  // Il Passo 1 rifinito è su apertura, Occhi e Orecchie; le altre usano lo stesso motore e i segnaposto.
  stations: null as readonly string[] | null,

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
