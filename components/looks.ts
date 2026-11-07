// Segnaposto visivi delle scene: forme semplici su fondo neutro (BRIEF §4).
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
  occhi: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 62, color: "#d8d3c8" },
        { kind: "rect", x: 0, y: 62, w: 100, h: 38, color: "#c2baa8" },
      ],
      mid: [
        { kind: "disc", x: 57, y: 14, w: 30, color: "#1f1e1c" },
        { kind: "rect", x: 33, y: 49, w: 3.5, h: 13, color: "#f3f0e8" },
      ],
      fg: [{ kind: "pill", x: 12, y: 40, w: 7, h: 70, color: "#a4492f" }],
    },
    clipTints: ["#6d5a3c", "#3b4a56"],
    trace: { x: "3vw", y: "30vh", slot: 0 },
  },
  orecchie: {
    planes: {
      bg: bands(9, "#cbd0cc", "#bcc3be"),
      mid: [
        { kind: "pill", x: 40, y: 10, w: 11, h: 74, color: "#2b2f33" },
        { kind: "ring", x: 62, y: 24, w: 22, color: "#2b2f33", stroke: 10 },
      ],
      fg: [{ kind: "disc", x: 7, y: 56, w: 19, color: "#d4ad3a" }],
    },
    clipTints: ["#4c3a5e", "#2f5a4f", "#7a3b2e"],
    trace: { x: "84vw", y: "58vh", slot: 3 },
  },
  fegato: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#d9d2c4" },
        { kind: "rect", x: 0, y: 78, w: 100, h: 22, color: "#b9ae9a" },
      ],
      mid: [
        { kind: "rect", x: 52, y: 20, w: 26, h: 52, color: "#efece5" },
        { kind: "disc", x: 60, y: 30, w: 9, color: "#1f1e1c" },
      ],
      fg: [{ kind: "pill", x: 6, y: 60, w: 46, h: 13, color: "#7e2f22" }],
    },
    clipTints: ["#5a3a2a", "#2e3b4a"],
    trace: { x: "4vw", y: "72vh", slot: 5 },
  },
  mani: {
    planes: {
      bg: [{ kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#e2ddd3" }],
      mid: [
        { kind: "rect", x: 18, y: 58, w: 12, h: 7, color: "#3a3936" },
        { kind: "rect", x: 36, y: 58, w: 12, h: 7, color: "#3a3936" },
        { kind: "rect", x: 54, y: 58, w: 12, h: 7, color: "#3a3936" },
        { kind: "rect", x: 72, y: 58, w: 12, h: 7, color: "#3a3936" },
        { kind: "rect", x: 10, y: 66, w: 80, h: 1.2, color: "#3a3936" },
      ],
      fg: [{ kind: "disc", x: 58, y: 8, w: 30, color: "#c99a2e" }],
    },
    clipTints: ["#3d4c3a", "#5b4636"],
    trace: { x: "85vw", y: "26vh", slot: 1 },
  },
  gambe: {
    planes: {
      bg: Array.from({ length: 7 }, (_, i) => ({ kind: "rect" as const, x: (100 / 7) * i, y: 0, w: 100 / 7 + 0.2, h: 100, color: i % 2 ? "#cfd2cf" : "#c3c7c3" })),
      mid: [
        { kind: "pill", x: 40, y: 18, w: 6, h: 70, color: "#2a2b2d" },
        { kind: "pill", x: 52, y: 26, w: 6, h: 62, color: "#2a2b2d" },
      ],
      fg: [{ kind: "ring", x: 70, y: 52, w: 20, color: "#a4492f", stroke: 9 }],
    },
    clipTints: ["#40384f"],
    trace: { x: "6vw", y: "88vh", slot: 4 },
  },
  cuore: {
    planes: {
      bg: [
        { kind: "rect", x: 0, y: 0, w: 100, h: 100, color: "#c9c1b4" },
        { kind: "rect", x: 0, y: 70, w: 100, h: 30, color: "#a99f8f" },
      ],
      mid: [{ kind: "disc", x: 30, y: 6, w: 38, color: "#ece7dc" }],
      fg: [{ kind: "pill", x: 66, y: 52, w: 5, h: 30, color: "#9b2f2a" }],
    },
    clipTints: ["#4a2f34"],
    trace: { x: "83vw", y: "86vh", slot: 2 },
  },
};
