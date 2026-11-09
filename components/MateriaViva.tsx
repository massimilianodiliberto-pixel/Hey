"use client";

// MATERIA VIVA — l'esperienza: la materia (canvas WebGL) segue lo scroll attraverso sette fasi.
// Fasi A-D del brief: sistema particellare, scroll, trasformazioni e ambienti, progetti che emergono
// dalla materia (Ricordo, Salto, Espansione, Composizione) e si aprono in una scheda.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { phases, materia, contact } from "@/content/materia";
import type { FaceMode } from "@/lib/materia";
import { projects, sheetUi, type Project } from "@/content/projects";

// Dove emergono i lavori di una fase: tre posti a destra, a profondità diverse (desktop).
const SLOTS = [
  { x: 44, y: 13, w: 21, depth: 0.6 },
  { x: 63, y: 40, w: 16, depth: 1.0 },
  { x: 47, y: 66, w: 13, depth: 1.5 },
];
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// «Hai bisogno di me?»: un modulo che parte via email. In demo l'indirizzo non c'è e lo dice.
function ContactForm({ onClose }: { onClose: () => void }) {
  const first = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  useEffect(() => {
    first.current?.focus();
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  const f = contact.form;
  return (
    <div className="mv-sheet-wrap" onClick={onClose}>
      <aside className="mv-sheet" role="dialog" aria-modal="true" aria-label={f.title} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button type="button" className="mv-sheet-close" onClick={onClose}>
          {f.close}
        </button>
        <h3 className="mv-sheet-title">{f.title}</h3>
        <form
          className="mv-form"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            if (!contact.email) return setNote(f.demo);
            const body = `${d.get("message")}\n\n${d.get("name")} — ${d.get("mail")}`;
            window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(f.title)}&body=${encodeURIComponent(body)}`;
          }}
        >
          <label>
            <span>{f.name}</span>
            <input ref={first} name="name" autoComplete="name" required />
          </label>
          <label>
            <span>{f.mail}</span>
            <input name="mail" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>{f.message}</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className="mv-cta">
            {f.send}
          </button>
          {note && (
            <p className="mv-form-note" role="status">
              {note}
            </p>
          )}
        </form>
      </aside>
    </div>
  );
}

function Sheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState(0);
  useEffect(() => {
    close.current?.focus();
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    const id = window.setInterval(() => setT((v) => (v + 1) % 15), 1000);
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.clearInterval(id);
    };
  }, [onClose]);
  return (
    <div className="mv-sheet-wrap" onClick={onClose}>
      <aside className="mv-sheet" role="dialog" aria-modal="true" aria-label={project.title} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button ref={close} type="button" className="mv-sheet-close" onClick={onClose}>
          {sheetUi.close}
        </button>
        <div className="mv-sheet-media" style={{ background: `linear-gradient(135deg, ${project.tint[0]}, ${project.tint[1]})` }}>
          <span className="mv-sheet-clip">
            {sheetUi.clip} · 00:{String(t).padStart(2, "0")} / 00:14
          </span>
        </div>
        <p className="mv-sheet-disc">{project.discipline}</p>
        <h3 className="mv-sheet-title">{project.title}</h3>
        <dl className="mv-sheet-facts">
          <div>
            <dt>{sheetUi.year}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>{sheetUi.role}</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
        <p className="mv-sheet-desc">{project.description}</p>
        <h4 className="mv-sheet-h">{sheetUi.credits}</h4>
        <ul className="mv-sheet-credits">
          {project.credits.map((c) => (
            <li key={c.role + c.name}>
              <span>{c.role}</span> {c.name}
            </li>
          ))}
        </ul>
        <a
          className="mv-sheet-link"
          href={project.fullWorkUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!project.fullWorkUrl}
          onClick={(e) => !project.fullWorkUrl && e.preventDefault()}
        >
          {sheetUi.fullWork} ↗
        </a>
      </aside>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function MateriaViva({ face = "3d" }: { face?: FaceMode }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);
  const [form, setForm] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    if (open || form) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [open, form]);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    let m: { setPhase: (p: number) => void; setName: (i: number, f: number, r: number) => void; destroy: () => void } | null = null;
    let alive = true;
    const state = { p: 0 };

    import("@/lib/materia")
      .then(({ createMateria }) => {
        if (!alive) return;
        try {
          m = createMateria(cv, { mobile, names: projects.map((pr) => pr.title), face });
          m.setPhase(state.p);
        } catch {
          setFallback(true);
        }
      })
      .catch(() => setFallback(true));

    const lenis = mobile || reduced ? null : new Lenis({ lerp: 0.08 });
    lenisRef.current = lenis;
    const tiles = [...el.querySelectorAll<HTMLElement>(".mv-work")];
    // Polvere: una trama di granuli usata come maschera, i lavori si compongono dai granuli.
    const dust = document.createElement("canvas");
    dust.width = dust.height = 96;
    const dx = dust.getContext("2d")!;
    const img = dx.createImageData(96, 96);
    for (let i = 0; i < img.data.length; i += 4) img.data[i + 3] = Math.random() < 0.16 ? 255 : 0;
    dx.putImageData(img, 0, 0);
    el.style.setProperty("--dust", `url(${dust.toDataURL()})`);
    const opening = el.querySelector<HTMLElement>(".mv-open");
    const byPhase = phases.map((ph) => projects.filter((pr) => pr.phase === ph.id));
    // I lavori emergono dalla materia: dalla sfocatura alla nitidezza, ognuno alla sua profondità.
    const placeWorks = (raw: number) => {
      // Apertura: la frase va al contrario delle particelle. La camera avanza, lei arretra e ruota.
      if (opening) {
        const o = reduced ? (raw > 0.3 ? 1 : 0) : smoothstep(0.02, 0.62, raw);
        opening.style.opacity = String(1 - o);
        el.classList.toggle("mv-opening", o < 0.55);
        opening.style.transform = `translate(-50%, -50%) perspective(1200px) translate3d(0, 0, ${(-o * 900).toFixed(0)}px) rotateY(${(-o * 48).toFixed(1)}deg) rotateX(${(o * 16).toFixed(1)}deg)`;
        opening.style.filter = o > 0.01 ? `blur(${(o * 8).toFixed(1)}px)` : "none";
        opening.style.visibility = o > 0.99 ? "hidden" : "visible";
      }
      tiles.forEach((tile) => {
        const pi = Number(tile.dataset.phase);
        const k = Number(tile.dataset.k);
        const local = raw - pi + 0.5;
        const start = 0.16 + k * 0.1;
        const a = reduced
          ? Number(Math.round(raw) === pi)
          : smoothstep(start, start + 0.16, local) * (1 - smoothstep(0.8, 0.92, local));
        const depth = SLOTS[k % SLOTS.length].depth;
        const side = k % 2 ? 1 : -1;
        // Nascono in profondità, ruotando, e si compongono dai granuli; poi ruotano lenti nello spazio.
        const z = reduced ? 0 : -(1 - a) * 700;
        const ry = reduced ? 0 : side * ((1 - a) * 62 + (0.5 - local) * 26 * depth);
        const rx = reduced ? 0 : (1 - a) * 24 + (local - 0.5) * 8;
        const y = reduced ? 0 : (0.5 - local) * 90 * depth;
        tile.style.opacity = String(Math.min(1, a * 1.6));
        tile.style.transform = `translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(0)}px) rotateY(${ry.toFixed(1)}deg) rotateX(${rx.toFixed(1)}deg)`;
        tile.style.setProperty("--a", (smoothstep(0.35, 1, a)).toFixed(3));
        tile.style.pointerEvents = a > 0.6 ? "auto" : "none";
        tile.tabIndex = a > 0.6 ? 0 : -1;
      });
      // Grandi nomi: uno alla volta, nel tratto della fase in cui compaiono i lavori.
      const pi = Math.round(raw);
      const list = byPhase[pi] ?? [];
      const local = raw - pi + 0.5;
      if (!list.length || reduced) return m?.setName(-1, 0, 0);
      const seg = (local - 0.14) / (0.74 / list.length);
      const idx = Math.floor(seg);
      if (idx < 0 || idx >= list.length) return m?.setName(-1, 0, 0);
      const fr = seg - idx;
      const formed = smoothstep(0, 0.32, fr) * (1 - smoothstep(0.7, 1, fr));
      m?.setName(projects.indexOf(list[idx]), formed, (fr - 0.5) * 1.1 + (idx % 2 ? 0.25 : -0.25));
    };
    placeWorks(0);
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Lo scroll muove la fase con una sosta su ogni capitolo: metà del tratto la scena resta sul capitolo
    // (mentre arrivano i lavori e i nomi), l'altra metà passa al successivo. Lo scrub dà l'inerzia.
    const n = phases.length - 1;
    const HOLD = 0.25;
    const dwell = (raw: number) => {
      const k = Math.floor(raw);
      const f = raw - k;
      return Math.min(n, k + smoothstep(HOLD, 1 - HOLD, f));
    };
    const st = ScrollTrigger.create({
      trigger: el.querySelector(".mv-track"),
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? true : 1.4,
      onUpdate: (self) => {
        const raw = self.progress * n;
        // Con movimento ridotto la materia salta da una forma compiuta all'altra, senza trasformazioni.
        state.p = reduced ? Math.round(raw) : dwell(raw);
        m?.setPhase(state.p);
        placeWorks(raw);
        setActive(Math.min(n, Math.round(raw)));
      },
    });

    const onKey = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-go]");
      if (!t) return;
      const i = Number(t.dataset.go);
      const y = st.start + ((st.end - st.start) * i) / n;
      if (lenis) lenis.scrollTo(y, { duration: 1.6 });
      else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    };
    el.addEventListener("click", onKey);

    return () => {
      alive = false;
      el.removeEventListener("click", onKey);
      st.kill();
      m?.destroy();
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    };
  }, [face]);

  return (
    <div ref={root} className={`mv${fallback ? " mv-fallback" : ""}${active === phases.length - 1 ? " mv-light" : ""}`}>
      <canvas ref={canvas} className="mv-canvas" aria-hidden="true" />

      <header className="mv-head">
        <span className="mv-brand">
          <b className="mv-mark">{materia.mark}</b> {materia.title}
        </span>
        <span className="mv-tag">{materia.preview}</span>
      </header>

      {/* Indice dell'evoluzione narrativa: discreto, sempre raggiungibile */}
      <nav className="mv-index" aria-label={materia.index}>
        <ol>
          {phases.map((ph, i) => (
            <li key={ph.id} className={i === active ? "is-on" : i < active ? "is-past" : ""}>
              <button type="button" data-go={i} aria-current={i === active ? "step" : undefined}>
                <span className="mv-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="mv-name">{ph.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <p className="mv-open">{materia.opening}</p>

      <div className="mv-copy" aria-live="polite">
        {phases.map((ph, i) => (
          <section key={ph.id} className={`mv-phase${i === active ? " is-on" : ""}`} aria-hidden={i !== active}>
            {i === 0 ? (
              <>
                <p className="mv-kick">01 · {ph.name}</p>
                <h1 className="mv-hero">{materia.title}</h1>
                <p className="mv-sub">{materia.subtitle}</p>
              </>
            ) : (
              <>
                <p className="mv-kick">
                  {String(i + 1).padStart(2, "0")} · {ph.name}
                </p>
                <h2 className="mv-title">{ph.title}</h2>
                {ph.line && <p className="mv-line">{ph.line}</p>}
                {ph.note && <p className="mv-note">{ph.note}</p>}
                {i === phases.length - 1 && (
                  <>
                    <p className="mv-sign">
                      {materia.mark} · {materia.person} · {materia.nickname}
                    </p>
                    <div className="mv-actions">
                      <a
                        className="mv-cta"
                        href={contact.email ? `mailto:${contact.email}?subject=${encodeURIComponent("Ciao Giangi")}` : "#"}
                        onClick={(e) => !contact.email && e.preventDefault()}
                        aria-disabled={!contact.email}
                      >
                        {contact.hello}
                      </a>
                      <button type="button" className="mv-cta mv-cta-main" onClick={() => setForm(true)}>
                        {contact.need}
                      </button>
                      <a
                        className="mv-cta"
                        href={contact.showreel || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => !contact.showreel && e.preventDefault()}
                        aria-disabled={!contact.showreel}
                      >
                        {contact.more} ↗
                      </a>
                    </div>
                    {(!contact.email || !contact.showreel) && <p className="mv-note">{contact.placeholder} — email e showreel in arrivo</p>}
                  </>
                )}
              </>
            )}
          </section>
        ))}
      </div>

      <div className="mv-works">
        {projects.map((pr) => {
          const pi = phases.findIndex((ph) => ph.id === pr.phase);
          const k = projects.filter((x) => x.phase === pr.phase).indexOf(pr);
          const slot = SLOTS[k % SLOTS.length];
          return (
            <button
              key={pr.id}
              type="button"
              className="mv-work"
              data-phase={pi}
              data-k={k}
              style={{ left: `${slot.x}vw`, top: `${slot.y}vh`, width: `${slot.w}vw`, opacity: 0 }}
              onClick={() => setOpen(pr)}
              aria-label={`${sheetUi.open}: ${pr.title}`}
            >
              <span className="mv-work-img" style={{ background: `linear-gradient(135deg, ${pr.tint[0]}, ${pr.tint[1]})` }}>
                <span className="mv-work-ph">PLACEHOLDER</span>
              </span>
              <span className="mv-work-cap">
                <span className="mv-work-disc">{pr.discipline}</span>
                <span className="mv-work-title">{pr.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      {open && <Sheet project={open} onClose={() => setOpen(null)} />}
      {form && <ContactForm onClose={() => setForm(false)} />}

      <div className="mv-progress" aria-hidden="true">
        <span style={{ transform: `scaleY(${active / (phases.length - 1)})` }} />
      </div>

      <div className="mv-track" aria-hidden="true">
        {phases.map((ph) => (
          <div key={ph.id} className="mv-step" />
        ))}
      </div>
    </div>
  );
}
