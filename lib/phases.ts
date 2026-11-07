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
  portrait: [0.02, 0.22],
  converge: [0.08, 0.34],
  lines: [0.3, 0.52],
  instinct: [0.48, 0.58],
  line: [0.6, 0.7],
  closing: [0.72, 0.8],
  name: [0.82, 0.9],
} as const;
