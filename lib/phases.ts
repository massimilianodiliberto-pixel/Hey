// Valori di p della stazione tipo. Devono restare allineati a TIMELINE.md.

export const P = {
  freezeEnd: 0.86,
  receivedOut: [0, 0.08], // comandi della clip
  worldOut: [0.08, 0.14],
  quoteOut: [0.42, 0.5],
  timeIn: [0.87, 0.91],
  timeOut: [0.96, 1],
  senseIn: [0.14, 0.28],
  senseTravel: [0.48, 0.6],
  traceOn: 0.6,
  todayIn: [0.58, 0.7],
  todayOut: [0.8, 0.86],
  linksIn: [0.62, 0.7],
  windowOpen: [0.86, 0.9],
  pushA: [0.88, 1],
  windowGrow: [0.9, 1],
  fadeA: [0.94, 1],
  textB: [0.96, 1],
  indexSwap: 0.93,
} as const;

export const span = (r: readonly [number, number]) => r[1] - r[0];

// Scena di arrivo: p dentro la sua traccia (TIMELINE §G).
export const A = {
  portrait: [0.02, 0.18],
  converge: [0.06, 0.26],
  lines: [0.22, 0.38],
  instinct: [0.36, 0.44],
  line: [0.44, 0.52],
  credits: [0.54, 0.64],
  clear: [0.68, 0.74],
  continua: [0.74, 0.84],
  closing: [0.82, 0.88],
  name: [0.88, 0.94],
} as const;
