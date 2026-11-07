// Motore di scroll di Punto G (Passo 1).
//
// Il palco è fisso. Sotto scorre una pila di "tracce" alte quanto il pin di ogni stazione:
// la posizione di scroll dentro una traccia è il p di TIMELINE.md, e ogni timeline GSAP
// è scrubbata da lì. Unica cosa a tempo: la clip (primo tempo della regia, BRIEF §2).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Station } from "@/content/stations";
import { config } from "@/config";
import { looks } from "@/components/looks";
import { A, P, span } from "./phases";

gsap.registerPlugin(ScrollTrigger);

type Phase = "waiting" | "playing" | "frozen";
type PlaneKey = "bg" | "mid" | "fg";

type St = {
  data: Station;
  entry: HTMLElement;
  zoom: HTMLElement;
  exit: HTMLElement;
  frame: HTMLElement;
  text: HTMLElement;
  track: HTMLElement;
  planes: Record<PlaneKey, HTMLElement>;
  clipLayer: HTMLElement;
  clipCam: HTMLElement;
  clipTint: HTMLElement;
  clipCaption: HTMLElement;
  clipTc: HTMLElement;
  clipUi: HTMLElement;
  clipUiWrap: HTMLElement;
  clipTitle: HTMLElement;
  world: HTMLElement;
  worldWrap: HTMLElement;
  received: HTMLElement | null; // solo se la stazione ha una sua frase
  receivedWrap: HTMLElement | null;
  sense: HTMLElement;
  today: HTMLElement | null;
  timeword: HTMLElement;
  wash: HTMLElement;
  links: HTMLElement | null;
  trace: HTMLElement | null;
  indexBtn: HTMLElement | null;
  tl: gsap.core.Timeline | null;
  st: ScrollTrigger | null;
  phase: Phase;
  clipTl: gsap.core.Timeline | null;
  visited: boolean;
  traceLit: boolean;
};

// Ampiezze del parallax nel freeze simulato (TIMELINE §B). Su mobile dimezzate.
const CAMERA: Record<PlaneKey, { scale: number; x: number; y: number }> = {
  bg: { scale: 0.05, x: 2, y: 0 },
  mid: { scale: 0.12, x: 4, y: -1 },
  fg: { scale: 0.22, x: 8, y: 3 },
};

const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const power2Out = (t: number) => 1 - (1 - t) * (1 - t);
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const circ = (r: number, c: { x: number; y: number }) => `circle(${r.toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)`;
// Tutto lo schermo meno un foro circolare: la scena precedente nel tempo entra dai bordi.
const hole = (r: number, c: { x: number; y: number }) => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const f = (n: number) => n.toFixed(1);
  return `path(evenodd, "M0 0H${W}V${H}H0Z M${f(c.x - r)} ${f(c.y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z")`;
};

// Ciò che emerge alla fine di una stazione: la stazione successiva o la scena di arrivo.
type Next = {
  entry: HTMLElement;
  zoom: HTMLElement | null;
  text: HTMLElement | null;
  wash: HTMLElement | null;
  center: () => { x: number; y: number };
  back: boolean; // true = si torna a un'esperienza precedente nel tempo
};

export function createEngine(root: HTMLElement, opts: { stations: Station[]; hub: string; arrivalId: string }) {
  const q = <T extends HTMLElement = HTMLElement>(el: ParentNode, sel: string) => el.querySelector(sel) as T;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  // Lenis solo con puntatore fine; su touch scroll nativo (BRIEF §7).
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const lenis = touch ? null : new Lenis({ lerp: 0.1 });
  const lenisRaf = (t: number) => lenis?.raf(t * 1000);
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);
  }

  const S: St[] = opts.stations.map((data) => {
    const scene = q(root, `[data-scene="${data.id}"]`);
    const live = q(scene, ".live");
    return {
      data,
      entry: q(scene, ".scene-entry"),
      zoom: q(scene, ".scene-zoom"),
      exit: q(scene, ".scene-exit"),
      frame: q(scene, ".frame"),
      text: q(scene, ".scene-text"),
      track: q(root, `[data-track="${data.id}"]`),
      planes: { bg: q(live, '[data-plane="bg"]'), mid: q(live, '[data-plane="mid"]'), fg: q(live, '[data-plane="fg"]') },
      clipLayer: q(scene, ".clip-layer"),
      clipCam: q(scene, ".clip-cam"),
      clipTint: q(scene, ".clip-tint"),
      clipCaption: q(scene, ".clip-caption"),
      clipTc: q(scene, ".clip-tc"),
      clipUi: q(scene, ".clipui"),
      clipUiWrap: q(scene, ".clipui-wrap"),
      clipTitle: q(scene, ".clip-title"),
      world: q(scene, ".world"),
      worldWrap: q(scene, ".world-wrap"),
      received: scene.querySelector<HTMLElement>(".received"),
      receivedWrap: scene.querySelector<HTMLElement>(".received-wrap"),
      sense: q(scene, ".sense"),
      today: scene.querySelector<HTMLElement>(".today"),
      timeword: q(scene, ".timeword"),
      wash: q(scene, ".scene-wash"),
      links: scene.querySelector<HTMLElement>(".links"),
      trace: root.querySelector<HTMLElement>(`[data-trace="${data.id}"]`),
      indexBtn: root.querySelector<HTMLElement>(`[data-index="${data.id}"]`),
      tl: null,
      st: null,
      phase: "waiting",
      clipTl: null,
      visited: false,
      traceLit: false,
    };
  });

  const opening = {
    shape: q(root, ".opening-shape"),
    line: q(root, ".opening-line"),
    track: q(root, '[data-track="opening"]'),
    st: null as ScrollTrigger | null,
  };
  const stage = q(root, ".stage");
  const arr = {
    entry: q(root, ".arrival-entry"),
    track: q(root, `[data-track="${opts.arrivalId}"]`),
    portrait: q(root, ".portrait"),
    instinct: q(root, ".instinct"),
    line: q(root, ".arrival-line"),
    closing: q(root, ".arrival-closing"),
    name: q(root, ".arrival-name"),
    contacts: q(root, ".arrival-contacts"),
    rings: S.map((s) => ({ s, el: q(root, `[data-ring="${s.data.id}"]`) })),
    lines: [...root.querySelectorAll<SVGLineElement>("[data-line]")],
    indexBtn: root.querySelector<HTMLElement>(`[data-index="${opts.arrivalId}"]`),
    st: null as ScrollTrigger | null,
    p: 0,
  };
  const veil = q(root, ".veil");
  const invite = q(root, ".invite");

  // Prima della clip, riga "ricevuto" e comandi della clip sono spenti.
  S.forEach((s) => gsap.set([s.world, s.received, s.clipUi].filter(Boolean), { autoAlpha: 0 }));

  // ---------- Scroll programmato (avanzamento automatico, aggancio, salti) ----------

  let jumping = false;
  let lastInput = performance.now();
  let auto: { cancel: () => void } | null = null;
  let inviteOn = false;

  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

  function cancelAuto() {
    const a = auto;
    auto = null;
    a?.cancel();
  }

  function scrollToY(y: number, seconds: number, ease: (t: number) => number, onDone?: () => void) {
    cancelAuto();
    const done = () => {
      auto = null;
      onDone?.();
    };
    if (lenis) {
      lenis.scrollTo(y, { duration: seconds, easing: ease, force: true, onComplete: done });
      auto = { cancel: () => lenis.scrollTo(lenis.scroll, { immediate: true, force: true }) };
    } else {
      const o = { y: window.scrollY };
      const tw = gsap.to(o, { y, duration: seconds, ease, onUpdate: () => window.scrollTo(0, o.y), onComplete: done });
      auto = { cancel: () => tw.kill() };
    }
  }

  function jumpY(y: number) {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    ScrollTrigger.update();
  }

  // Qualunque gesto dell'utente riprende il controllo dal punto in cui si trova (BRIEF §2).
  const onInput = () => {
    lastInput = performance.now();
    if (auto) cancelAuto();
    showInvite(false);
  };
  const inputEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  inputEvents.forEach((ev) => window.addEventListener(ev, onInput, { capture: true, passive: true }));

  function showInvite(on: boolean) {
    if (on === inviteOn) return;
    inviteOn = on;
    gsap.to(invite, { autoAlpha: on ? 0.8 : 0, duration: on ? 0.6 : 0.2 });
  }

  // ---------- Geometria (misurata dal layout, mai dalle trasformazioni) ----------

  const frameBox = (s: St) => ({ x: s.frame.offsetLeft, y: s.frame.offsetTop, w: s.frame.offsetWidth, h: s.frame.offsetHeight });
  const frameCenter = (s: St) => {
    const f = frameBox(s);
    return { x: f.x + f.w / 2, y: f.y + f.h / 2 };
  };
  const maxR = () => Math.hypot(window.innerWidth, window.innerHeight);

  // Centro dell'elemento in primo piano di A a fine sosta: da lì si apre la finestra su B.
  function windowOrigin(s: St, amp: number) {
    const f = frameBox(s);
    const shape = looks[s.data.id]?.planes.fg[0];
    if (!shape) return frameCenter(s);
    const cx = (shape.x + shape.w / 2) / 100;
    const cy = (shape.y + (shape.h ?? (shape.w * f.w) / f.h) / 2) / 100;
    const k = 1 + CAMERA.fg.scale * amp;
    return {
      x: f.x + f.w * (0.5 + (cx - 0.5) * k + (CAMERA.fg.x * amp) / 100),
      y: f.y + f.h * (0.5 + (cy - 0.5) * k + (CAMERA.fg.y * amp) / 100),
    };
  }

  // Dove va il senso: il suo posto al margine.
  function travel(s: St) {
    if (!s.trace) return { x: 0, y: 0 };
    const c = frameCenter(s);
    return {
      x: s.trace.offsetLeft + s.trace.offsetWidth / 2 - window.innerWidth / 2,
      y: s.trace.offsetTop + s.trace.offsetHeight / 2 - c.y,
    };
  }

  // ---------- Clip segnaposto (tempo) ----------

  const lastClip = (s: St) => s.data.clips[s.data.clips.length - 1];

  function playClips(s: St) {
    S.forEach((o) => o !== s && o.phase === "playing" && finishClip(o, "instant")); // una clip alla volta
    s.clipTl?.kill();
    s.phase = "playing";
    s.clipUi.classList.remove("is-frozen");
    gsap.set(s.clipLayer, { autoAlpha: 1 });
    gsap.set(s.clipCaption, { opacity: 0 });
    gsap.set(s.clipCam, { autoAlpha: 1 });
    // Il mondo è il titolo grande della clip: l'esperienza, il passato.
    gsap.fromTo(s.world, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" });
    if (s.received) gsap.fromTo(s.received, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out" });
    gsap.fromTo(s.clipUi, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });

    const D = config.clipSeconds;
    const tints = looks[s.data.id]?.clipTints ?? [];
    const tint = (i: number) => tints[i % Math.max(tints.length, 1)] ?? "#555";
    const clips = s.data.clips;
    const tl = gsap.timeline({ onComplete: () => finishClip(s, "natural") });

    clips.forEach((c, i) => {
      const at = `c${i}`;
      const last = i === clips.length - 1;
      tl.addLabel(at);
      tl.call(() => void (s.clipTitle.textContent = c.title), undefined, at);
      tl.set(s.clipTint, { backgroundColor: tint(i), opacity: 0.5 }, at);
      if (i > 0) tl.fromTo(s.clipCam, { autoAlpha: 0.15 }, { autoAlpha: 1, duration: 0.4, ease: "power1.out", immediateRender: false }, at);

      if (c.mode === "montage") {
        // 8 frammenti rapidi, la scritta, poi la camera torna al fotogramma chiave.
        const n = 8;
        const frag = (D * 0.62) / n;
        for (let k = 0; k < n; k++) {
          tl.set(s.clipCam, { scale: 1.1 + (k % 3) * 0.15, xPercent: ((k * 37) % 21) - 10, yPercent: ((k * 23) % 13) - 6 }, `${at}+=${k * frag}`);
          tl.set(s.clipTint, { backgroundColor: tint(k), opacity: 0.3 + (k % 3) * 0.15 }, `${at}+=${k * frag}`);
        }
        tl.call(() => void (s.clipCaption.textContent = c.caption ?? ""), undefined, `${at}+=${D * 0.62}`);
        tl.set(s.clipCaption, { opacity: 1 }, `${at}+=${D * 0.62}`);
        tl.set(s.clipTint, { backgroundColor: "#1b1b19", opacity: 0.75 }, `${at}+=${D * 0.62}`);
        tl.set(s.clipCam, { scale: 1.15, xPercent: 0, yPercent: 0 }, `${at}+=${D * 0.62}`);
        tl.to(s.clipCaption, { opacity: 0, duration: 0.5 }, `${at}+=${D * 0.8 - 0.5}`);
        tl.to(s.clipCam, { scale: 1, xPercent: 0, yPercent: 0, duration: D * 0.2, ease: "sine.inOut" }, `${at}+=${D * 0.8}`);
        tl.to(s.clipTint, { opacity: 0, duration: D * 0.2, ease: "none" }, `${at}+=${D * 0.8}`);
      } else if (last) {
        // L'ultima clip finisce esattamente sulla posa del freeze a p = 0.
        tl.fromTo(s.clipCam, { scale: 1.25, xPercent: 6, yPercent: -3 }, { scale: 1, xPercent: 0, yPercent: 0, duration: D, ease: "sine.inOut" }, at);
        tl.to(s.clipTint, { opacity: 0, duration: D * 0.4, ease: "none" }, `${at}+=${D * 0.6}`);
      } else {
        tl.fromTo(s.clipCam, { scale: 1.3, xPercent: 8, yPercent: -4 }, { scale: 1.12, xPercent: -6, yPercent: 2, duration: D }, at);
      }
      tl.set({}, {}, `${at}+=${D}`); // ogni clip dura D
    });

    tl.eventCallback("onUpdate", () => {
      const local = tl.time() % D;
      s.clipTc.textContent = `00:${pad(local)} / 00:${pad(D)}`;
    });
    s.clipTl = tl;
  }

  // natural: fine vera, scambio invisibile sul fotogramma chiave. fade: scroll durante la clip.
  function finishClip(s: St, how: "natural" | "fade" | "instant") {
    if (s.phase !== "playing") return;
    s.clipTl?.kill();
    s.clipTl = null;
    if (how === "fade") gsap.to(s.clipLayer, { autoAlpha: 0, duration: 0.35, ease: "power1.out" });
    else gsap.set(s.clipLayer, { autoAlpha: 0 });
    gsap.set(s.clipCaption, { opacity: 0 });
    s.clipTitle.textContent = lastClip(s)?.title ?? "";
    s.clipUi.classList.add("is-frozen");
    s.phase = "frozen";
    lastInput = performance.now();
  }

  // Si è entrati oltre p = 0 senza fermarsi: niente clip, ma mondo, frase e comandi visibili.
  function showFrozen(s: St) {
    s.phase = "frozen";
    gsap.set(s.clipLayer, { autoAlpha: 0 });
    gsap.set([s.world, s.received, s.clipUi].filter(Boolean), { autoAlpha: 1, y: 0 });
    s.clipTitle.textContent = lastClip(s)?.title ?? "";
    s.clipUi.classList.add("is-frozen");
  }

  function skip(s: St) {
    const tl = s.clipTl;
    if (s.phase !== "playing" || !tl) return;
    const next = Object.values(tl.labels)
      .sort((a, b) => a - b)
      .find((t) => t > tl.time() + 0.01);
    if (next != null) tl.seek(next);
    else tl.progress(1);
  }

  // ---------- Stato per stazione: clip, tracce, indice ----------

  const inRange = (st: ScrollTrigger, y = scrollY()) => y >= st.start - 1 && y < st.end - 1;

  function onStationScroll(s: St) {
    const st = s.st;
    if (!st || jumping) return;
    const y = scrollY();
    const px = y - st.start;
    if (s.phase === "waiting" && inRange(st, y) && px <= 4) playClips(s);
    else if (s.phase === "waiting" && inRange(st, y)) showFrozen(s); // entrati a stazione avviata
    else if (s.phase === "playing" && (px > 12 || !inRange(st, y))) finishClip(s, "fade");
  }

  function onStationTimeline(s: St) {
    const tl = s.tl;
    if (!tl) return;
    const tp = tl.progress();
    // Acceso solo se la stazione è sullo schermo quando il senso si apre: i sensi delle stazioni
    // saltate (indice, richiami, salti di scroll) restano spenti.
    if (!jumping && tp >= P.traceOn && !!s.st && inRange(s.st)) s.visited = true;
    const senseOnScreen = !!s.st && inRange(s.st) && tp > P.senseIn[0] && tp < P.traceOn;
    const lit = s.visited && !senseOnScreen && arr.p < A.converge[0];
    if (lit !== s.traceLit && s.trace) {
      s.traceLit = lit;
      gsap.set(s.trace, { autoAlpha: lit ? 0.7 : 0 });
    }
  }

  let currentId = "";
  function updateCurrent() {
    const y = scrollY();
    let cur: St | null = null;
    S.forEach((s, i) => {
      if (!s.st) return;
      const prev = S[i - 1]?.st ?? opening.st;
      const lead = prev ? (1 - P.indexSwap) * (prev.end - prev.start) : 0;
      if (y >= s.st.start - lead) cur = s;
    });
    let id = (cur as St | null)?.data.id ?? "";
    const last = S[S.length - 1]?.st;
    if (arr.st && last && y >= arr.st.start - (1 - P.indexSwap) * (last.end - last.start)) id = opts.arrivalId;
    if (id === currentId) return;
    currentId = id;
    S.forEach((s) => s.indexBtn?.classList.toggle("is-current", s.data.id === id));
    arr.indexBtn?.classList.toggle("is-current", id === opts.arrivalId);
  }

  // ---------- Timeline in scrub ----------

  function buildOpening() {
    const first = S[0];
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    tl.to(opening.line, { autoAlpha: 0, y: -16, duration: 0.25, ease: "power1.in" }, 0.25);
    tl.fromTo(opening.shape, { clipPath: "circle(14% at 50% 50%)" }, { clipPath: "circle(42% at 50% 50%)", duration: 0.5, ease: "power2.inOut" }, 0.3);
    if (first) {
      // La forma astratta diventa la prima scena: il quadro della prima stazione si apre da dentro il disco.
      tl.fromTo(
        first.entry,
        { clipPath: () => circ(0, frameCenter(first)) },
        { clipPath: () => circ(maxR(), frameCenter(first)), duration: 0.5, ease: "power3.in" },
        0.5,
      );
      tl.fromTo(first.zoom, { scale: 1.2 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0.5);
      tl.fromTo(first.text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.94);
    }
    tl.to(opening.shape, { autoAlpha: 0, duration: 0.15 }, 0.85);
    return tl;
  }

  const asNext = (from: St, n: St): Next => ({
    entry: n.entry,
    zoom: n.zoom,
    text: n.text,
    wash: n.wash,
    center: () => frameCenter(n),
    back: n.data.era < from.data.era,
  });
  const arrivalNext: Next = {
    entry: arr.entry,
    zoom: null,
    text: null,
    wash: null,
    back: false,
    center: () => ({ x: arr.portrait.offsetLeft + arr.portrait.offsetWidth / 2, y: arr.portrait.offsetTop + arr.portrait.offsetHeight / 2 }),
  };

  function buildStation(s: St, next: Next, mobile: boolean) {
    const amp = mobile ? 0.5 : 1;
    const fe = P.freezeEnd;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => onStationTimeline(s) });

    // Freeze simulato: la camera si muove nel fotogramma fermo, tre piani in parallax.
    // Su mobile due piani in movimento invece di tre: fondo e medio si muovono insieme.
    (Object.keys(CAMERA) as PlaneKey[]).forEach((k) => {
      const c = CAMERA[mobile && k === "mid" ? "bg" : k];
      tl.fromTo(
        s.planes[k],
        { scale: 1, xPercent: 0, yPercent: 0 },
        { scale: 1 + c.scale * amp, xPercent: c.x * amp, yPercent: c.y * amp, duration: fe },
        0,
      );
    });

    // Il mondo esce quando si apre il senso. La sua frase, se c'è, resta più a lungo: è l'unico testo.
    tl.fromTo(s.worldWrap, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: span(P.worldOut), ease: "power1.in" }, P.worldOut[0]);
    if (s.receivedWrap)
      tl.fromTo(s.receivedWrap, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: span(P.quoteOut), ease: "power1.in" }, P.quoteOut[0]);
    tl.fromTo(s.clipUiWrap, { autoAlpha: 1 }, { autoAlpha: 0, duration: span(P.receivedOut), ease: "power1.in" }, P.receivedOut[0]);

    gsap.set(s.sense, { xPercent: -50, yPercent: -50 });
    tl.fromTo(
      s.sense,
      { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 0 },
      { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: span(P.senseIn), ease: "power2.out" },
      P.senseIn[0],
    );
    tl.fromTo(
      s.sense,
      { x: 0, y: 0, scale: 1 },
      { x: () => travel(s).x, y: () => travel(s).y, scale: 0.32, duration: span(P.senseTravel), ease: "power2.inOut", immediateRender: false },
      P.senseTravel[0],
    );
    tl.to(s.sense, { opacity: 0.7, duration: 0.03 }, P.traceOn - 0.034);
    tl.to(s.sense, { autoAlpha: 0, duration: 0.004 }, P.traceOn - 0.004);

    if (s.today) {
      tl.fromTo(s.today, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: span(P.todayIn), ease: "power2.out" }, P.todayIn[0]);
      tl.to(s.today, { autoAlpha: 0, duration: span(P.todayOut), ease: "power1.in" }, P.todayOut[0]);
    }
    if (s.links) {
      tl.fromTo(s.links, { autoAlpha: 0 }, { autoAlpha: 1, duration: span(P.linksIn) }, P.linksIn[0]);
      tl.to(s.links, { autoAlpha: 0, duration: 0.03 }, 0.84);
    }

    // La parola del tempo: «dopo», «prima» o «oggi». Mai una data.
    tl.fromTo(s.timeword, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: span(P.timeIn), ease: "power2.out" }, P.timeIn[0]);
    tl.to(s.timeword, { autoAlpha: 0, duration: span(P.timeOut), ease: "power1.in" }, P.timeOut[0]);
    tl.to(s.text, { autoAlpha: 0, duration: 0.03 }, 0.9);

    if (next.back) {
      // Indietro nel tempo: la camera arretra, il presente si rimpicciolisce in un foro e
      // l'esperienza precedente entra dai bordi, velata come un ricordo che torna nitido.
      tl.to(s.exit, { scale: 0.55, duration: span(P.pushA), ease: "power2.inOut" }, P.pushA[0]);
      tl.to(s.exit, { autoAlpha: 0, duration: span(P.fadeA), ease: "power1.in" }, P.fadeA[0]);
      // GSAP non interpola path(): si anima il raggio e il foro si ricalcola a ogni fotogramma.
      const h = { r: 0 };
      const entry = next.entry;
      tl.fromTo(
        h,
        { r: () => maxR() },
        {
          r: 0,
          duration: 1 - P.windowOpen[0],
          ease: "power2.inOut",
          onUpdate: () => void (entry.style.clipPath = hole(h.r, frameCenter(s))),
        },
        P.windowOpen[0],
      );
      if (next.zoom) tl.fromTo(next.zoom, { scale: mobile ? 1.5 : 1.75 }, { scale: 1, duration: 1 - P.windowOpen[0], ease: "power2.inOut" }, P.windowOpen[0]);
      if (next.wash) tl.fromTo(next.wash, { opacity: 0.55 }, { opacity: 0, duration: 1 - P.windowOpen[0], ease: "power1.in" }, P.windowOpen[0]);
      if (next.text) tl.fromTo(next.text, { autoAlpha: 0 }, { autoAlpha: 1, duration: span(P.textB) }, P.textB[0]);
      return tl;
    }

    // Avanti nel tempo: la camera spinge oltre A, B emerge dalla finestra aperta in A.
    tl.to(s.exit, { scale: mobile ? 1.3 : 1.45, duration: span(P.pushA), ease: "power2.in" }, P.pushA[0]);
    tl.to(s.exit, { autoAlpha: 0, duration: span(P.fadeA), ease: "power1.in" }, P.fadeA[0]);
    {
      const r0 = () => 0.06 * maxR();
      tl.fromTo(
        next.entry,
        { clipPath: () => circ(0, windowOrigin(s, amp)) },
        { clipPath: () => circ(r0(), windowOrigin(s, amp)), duration: span(P.windowOpen), ease: "power2.in" },
        P.windowOpen[0],
      );
      tl.to(next.entry, { clipPath: () => circ(maxR(), next.center()), duration: span(P.windowGrow), ease: "power3.inOut" }, P.windowGrow[0]);
      if (!mobile && next.zoom) tl.fromTo(next.zoom, { scale: 1.25 }, { scale: 1, duration: span(P.windowGrow), ease: "power2.out" }, P.windowGrow[0]);
      if (next.text) tl.fromTo(next.text, { autoAlpha: 0 }, { autoAlpha: 1, duration: span(P.textB) }, P.textB[0]);
    }
    return tl;
  }

  // ---------- Arrivo: i sensi convergono attorno alla persona, le linee partono dall'orientamento ----------

  const center = (el: HTMLElement) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });

  // Posizioni dei sensi attorno al ritratto, nell'ordine del file dati.
  // Desktop: ellisse larga e bassa che parte a −60°, così nessun senso cade sopra o sotto il
  // centro, dove stanno «Istinto» e le frasi. Mobile: tre sopra e tre sotto il ritratto.
  function ringPos(i: number, mobile: boolean) {
    const c = center(arr.portrait);
    const n = arr.rings.length;
    const H = arr.portrait.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (mobile) {
      const half = Math.ceil(n / 2);
      const row = i < half ? 0 : 1;
      const k = row ? i - half : i;
      const cols = row ? n - half : half;
      const x = vw * (cols > 1 ? 0.18 + (0.64 * k) / (cols - 1) : 0.5);
      return { x, y: row ? c.y + H / 2 + vh * 0.06 : c.y - H / 2 - vh * 0.07 };
    }
    const a = -Math.PI / 3 + (i / n) * Math.PI * 2;
    return { x: c.x + Math.cos(a) * vw * 0.38, y: c.y + Math.sin(a) * H * 0.66 };
  }

  function layoutArrival(mobile: boolean) {
    arr.rings.forEach(({ el }, i) => {
      const r = ringPos(i, mobile);
      gsap.set(el, { left: r.x, top: r.y, xPercent: -50, yPercent: -50 });
    });
    const hub = arr.rings.findIndex((r) => r.s.data.id === opts.hub);
    const h = hub >= 0 ? ringPos(hub, mobile) : center(arr.portrait);
    arr.lines.forEach((ln) => {
      const i = arr.rings.findIndex((r) => r.s.data.id === ln.dataset.line);
      const t = ringPos(i, mobile);
      // Le linee si fermano prima delle parole, per non attraversarle.
      const k = 0.16;
      ln.setAttribute("x1", String(h.x + (t.x - h.x) * k));
      ln.setAttribute("y1", String(h.y + (t.y - h.y) * k));
      ln.setAttribute("x2", String(t.x - (t.x - h.x) * k));
      ln.setAttribute("y2", String(t.y - (t.y - h.y) * k));
      ln.setAttribute("pathLength", "1");
    });
  }

  function onArrivalUpdate(tl: gsap.core.Timeline) {
    arr.p = tl.progress();
    const on = arr.p >= A.converge[0];
    arr.rings.forEach(({ s, el }) => gsap.set(el, { autoAlpha: on ? (s.visited ? 0.9 : 0.18) : 0 }));
    arr.lines.forEach((ln) => {
      const s = S.find((x) => x.data.id === ln.dataset.line);
      ln.style.strokeOpacity = s?.visited ? "0.55" : "0.15";
    });
    S.forEach(onStationTimeline);
  }

  function buildArrival(mobile: boolean) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    tl.eventCallback("onUpdate", () => onArrivalUpdate(tl));
    layoutArrival(mobile);
    // La forma astratta dell'apertura torna e diventa la persona.
    tl.fromTo(arr.portrait, { clipPath: "circle(22% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: span(A.portrait), ease: "power2.inOut" }, A.portrait[0]);
    arr.rings.forEach(({ s, el }) => {
      const from = () => {
        const t = s.trace ? center(s.trace) : center(arr.portrait);
        const r = { x: el.offsetLeft, y: el.offsetTop };
        return { x: t.x - r.x, y: t.y - r.y };
      };
      tl.fromTo(el, { x: () => from().x, y: () => from().y, scale: 0.85 }, { x: 0, y: 0, scale: 1, duration: span(A.converge), ease: "power2.inOut" }, A.converge[0]);
    });
    tl.fromTo(arr.lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: span(A.lines), ease: "power1.inOut", stagger: 0.02 }, A.lines[0]);
    tl.fromTo(arr.instinct, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: span(A.instinct), ease: "power2.out" }, A.instinct[0]);
    tl.fromTo(arr.line, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: span(A.line), ease: "power2.out" }, A.line[0]);
    tl.fromTo(arr.closing, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: span(A.closing), ease: "power2.out" }, A.closing[0]);
    tl.fromTo([arr.name, arr.contacts], { autoAlpha: 0 }, { autoAlpha: 1, duration: span(A.name) }, A.name[0]);
    tl.set({}, {}, 1);
    return tl;
  }

  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 769px)", mobile: "(max-width: 768px)" }, (ctx) => {
    const mobile = !!ctx.conditions?.mobile;
    const scrub = mobile ? config.scrub.mobile : config.scrub.desktop;

    const otl = buildOpening();
    opening.st = ScrollTrigger.create({ trigger: opening.track, start: "top top", end: "bottom top", animation: otl, scrub, invalidateOnRefresh: true });

    S.forEach((s, i) => {
      const n = S[i + 1];
      s.tl = buildStation(s, n ? asNext(s, n) : arrivalNext, mobile);
      s.st = ScrollTrigger.create({
        trigger: s.track,
        start: "top top",
        end: "bottom top",
        animation: s.tl,
        scrub,
        invalidateOnRefresh: true,
      });
    });
    const atl = buildArrival(mobile);
    arr.st = ScrollTrigger.create({
      trigger: arr.track,
      start: "top top",
      end: "bottom bottom",
      animation: atl,
      scrub,
      invalidateOnRefresh: true,
      onRefresh: () => layoutArrival(mobile),
    });
    updateCurrent();
  });

  // ---------- Avanzamento automatico, invito, aggancio ----------

  const poll = window.setInterval(() => {
    if (jumping) return;
    const y = scrollY();
    const s = S.find((x) => x.st && inRange(x.st, y));
    if (!s?.st || s.phase !== "frozen") return showInvite(false);
    const len = s.st.end - s.st.start;
    const p = (y - s.st.start) / len;
    const idle = performance.now() - lastInput;
    if (!auto && p < P.freezeEnd - 0.005 && idle > config.autoplay.idleMs) {
      const secs = config.autoplay.freezeSeconds * (1 - p / P.freezeEnd);
      scrollToY(s.st.start + P.freezeEnd * len, Math.max(secs, 1), sineInOut, () => (lastInput = performance.now()));
    }
    showInvite(!auto && Math.abs(p - P.freezeEnd) < 0.01 && idle > config.autoplay.inviteDelayMs);
  }, 200);

  let snapTimer = 0;
  function maybeSnap() {
    if (!config.snap || auto || jumping) return;
    const y = scrollY();
    let target: number | null = null;
    const o = opening.st;
    if (o && S[0]?.st) {
      const op = (y - o.start) / (o.end - o.start);
      if (op > 0.6 && op < 0.998) target = S[0].st.start;
    }
    S.forEach((s, i) => {
      if (!s.st) return;
      const len = s.st.end - s.st.start;
      const p = (y - s.st.start) / len;
      if (p > P.freezeEnd + 0.005 && p < 0.998) {
        const nextStart = S[i + 1]?.st?.start ?? arr.st?.start ?? y;
        target = p >= P.indexSwap ? nextStart : s.st.start + P.freezeEnd * len;
      }
    });
    if (target != null && Math.abs(target - y) > 1) scrollToY(target, 0.6, power2Out);
  }

  // Salto grande senza passare dall'indice (barra trascinata, ancora, scrollTo): la scena va
  // subito al punto giusto invece di recuperare con lo smorzamento, e le stazioni attraversate
  // non accendono il loro senso, come per i salti dall'indice.
  let lastY = scrollY();
  function settleAfterJump() {
    const was = jumping;
    jumping = true;
    [opening.st, ...S.map((x) => x.st), arr.st].forEach((st) => st?.getTween()?.progress(1));
    jumping = was;
  }

  const onScroll = () => {
    const y = scrollY();
    if (!auto && !jumping && Math.abs(y - lastY) > window.innerHeight * 1.5) settleAfterJump();
    lastY = y;
    updateCurrent();
    S.forEach(onStationScroll); // anche l'arrivo esatto a p = 0, che ScrollTrigger non segnala
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(maybeSnap, 220);
  };
  if (lenis) lenis.on("scroll", onScroll);
  else window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Salti: indice e richiami (TIMELINE §F) ----------

  function jumpTo(id: string) {
    const s = S.find((x) => x.data.id === id);
    const targetSt = id === opts.arrivalId ? arr.st : s?.st;
    if (!targetSt || jumping) return;
    jumping = true;
    cancelAuto();
    showInvite(false);
    S.forEach((o) => finishClip(o, "instant"));
    gsap.to(veil, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        jumpY(targetSt.start);
        // Niente scrub attraverso le stazioni intermedie: ogni timeline va subito al suo posto.
        [opening.st, ...S.map((x) => x.st), arr.st].forEach((st) => {
          st?.getTween()?.progress(1);
          st?.animation?.progress(st.progress);
        });
        updateCurrent();
        if (s) {
          s.phase = "waiting";
          playClips(s);
        }
        gsap.to(veil, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", onComplete: () => void (jumping = false) });
      },
    });
  }

  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const jump = t.closest<HTMLElement>("[data-jump]");
    if (jump?.dataset.jump) return jumpTo(jump.dataset.jump);
    const scene = t.closest<HTMLElement>("[data-scene]");
    const s = scene && S.find((x) => x.data.id === scene.dataset.scene);
    if (!s) return;
    if (t.closest(".clip-skip")) skip(s);
    else if (t.closest(".clip-replay") && s.phase === "frozen") playClips(s);
    else if (t.closest('.clip-full[aria-disabled="true"]')) e.preventDefault();
  };
  root.addEventListener("click", onClick);

  stage.dataset.ready = "true";

  return () => {
    window.clearInterval(poll);
    window.clearTimeout(snapTimer);
    root.removeEventListener("click", onClick);
    window.removeEventListener("scroll", onScroll);
    inputEvents.forEach((ev) => window.removeEventListener(ev, onInput, { capture: true }));
    S.forEach((s) => s.clipTl?.kill());
    mm.revert();
    if (lenis) {
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
    }
  };
}
