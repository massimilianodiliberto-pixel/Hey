// Segnaposto visivi delle scene: forme semplici in toni di teatro di posa, la luce solo dove serve (BRIEF §4).
// Non sono contenuti: verranno sostituiti dal fotogramma chiave vero di ogni stazione.
// Coordinate in percentuale del quadro. Senza h, la forma è quadrata (o tonda).

export type Shape = {
  kind: "rect" | "disc" | "pill" | "ring";
  x: number;
  y: number;
  w: number;
  h?: number;
  color: string;
  stroke?: number;
};

export type Look = {
  planes: { bg: Shape[]; mid: Shape[]; fg: Shape[] };
  clipTints: string[]; // un colore per clip, nell'ordine
  trace: { x: string; y: string; slot: number }; // posto al margine (desktop) e posizione in riga (mobile)
};

const bands = (n: number, a: string, b: string): Shape[] =>
  Array.from({ length: n }, (_, i) => ({ kind: "rect", x: 0, y: (100 / n) * i, w: 100, h: 100 / n + 0.2, color: i % 2 ? a : b }));

export const looks: Record<string, Look> = {
  immagine: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 62, color: "#35322f" },
        { kind: "rect", x: 0, y: 62, w: 100, h: 38, color: "#2f2c29" },
      ],
      mid: [
        { kind: "disc", x: 57, y: 14, w: 30, color: "#4a4744" },
        { kind: "rect", x: 33, y: 49, w: 3.5, h: 13, color: "#3c3936" },
      ],
      fg: [{ kind: "pill", x: 12, y: 40, w: 7, h: 70, color: "#b9894a" }],
    },
    clipTints: ["#3b3121", "#20282f"],
    trace: { x: "3vw", y: "30vh", slot: 0 },
  },
  ritmo: {
    planes: {
      bg: bands(9, "#34312e", "#312e2b"),
      mid: [
        { kind: "pill", x: 40, y: 10, w: 11, h: 74, color: "#4a4744" },
        { kind: "ring", x: 62, y: 24, w: 22, color: "#4a4744", stroke: 10 },
      ],
      fg: [{ kind: "disc", x: 7, y: 56, w: 19, color: "#b9894a" }],
    },
    clipTints: ["#291f33", "#19312b", "#432019"],
    trace: { x: "84vw", y: "58vh", slot: 3 },
  },
  rischio: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#35322f" },
        { kind: "rect", x: 0, y: 78, w: 100, h: 22, color: "#2c2926" },
      ],
      mid: [
        { kind: "rect", x: 52, y: 20, w: 26, h: 52, color: "#3b3835" },
        { kind: "disc", x: 60, y: 30, w: 9, color: "#4a4744" },
      ],
      fg: [{ kind: "pill", x: 6, y: 60, w: 46, h: 13, color: "#8a6436" }],
    },
    clipTints: ["#311f17", "#192028"],
    trace: { x: "4vw", y: "72vh", slot: 5 },
  },
  spazio: {
    planes: {
      bg: [{ kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#383532" }],
      mid: [
        { kind: "rect", x: 18, y: 58, w: 12, h: 7, color: "#4a4744" },
        { kind: "rect", x: 36, y: 58, w: 12, h: 7, color: "#4a4744" },
        { kind: "rect", x: 54, y: 58, w: 12, h: 7, color: "#4a4744" },
        { kind: "rect", x: 72, y: 58, w: 12, h: 7, color: "#4a4744" },
        { kind: "rect", x: 10, y: 66, w: 80, h: 1.2, color: "#4a4744" },
      ],
      fg: [{ kind: "disc", x: 58, y: 8, w: 30, color: "#b9894a" }],
    },
    clipTints: ["#21291f", "#32261d"],
    trace: { x: "85vw", y: "26vh", slot: 1 },
  },
  orientamento: {
    planes: {
      bg: Array.from({ length: 7 }, (_, i) => ({ kind: "rect" as const, x: (100 / 7) * i, y: 0, w: 100 / 7 + 0.2, h: 100, color: i % 2 ? "#35322f" : "#322f2c" })),
      mid: [
        { kind: "pill", x: 40, y: 18, w: 6, h: 70, color: "#4a4744" },
        { kind: "pill", x: 52, y: 26, w: 6, h: 62, color: "#4a4744" },
      ],
      fg: [{ kind: "ring", x: 70, y: 52, w: 20, color: "#b9894a", stroke: 9 }],
    },
    clipTints: ["#231e2b"],
    trace: { x: "6vw", y: "88vh", slot: 4 },
  },
  misura: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#312e2b" },
        { kind: "rect", x: 0, y: 70, w: 100, h: 30, color: "#282522" },
      ],
      mid: [{ kind: "disc", x: 30, y: 6, w: 38, color: "#3a3734" }],
      fg: [{ kind: "pill", x: 66, y: 52, w: 5, h: 30, color: "#8a6436" }],
    },
    clipTints: ["#28191c"],
    trace: { x: "83vw", y: "86vh", slot: 2 },
  },
};
