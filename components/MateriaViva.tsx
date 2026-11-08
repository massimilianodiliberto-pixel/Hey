"use client";

// MATERIA VIVA — l'esperienza: la materia (canvas WebGL) segue lo scroll attraverso sette fasi.
// Fase A/B/C del brief: sistema particellare, sincronizzazione con lo scroll, trasformazioni e ambienti.
// I contenuti del portfolio (fase D) arriveranno dentro le fasi Ricordo, Espansione e Composizione.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { phases, materia } from "@/content/materia";

gsap.registerPlugin(ScrollTrigger);

export default function MateriaViva() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    let m: { setPhase: (p: number) => void; destroy: () => void } | null = null;
    let alive = true;
    const state = { p: 0 };

    import("@/lib/materia")
      .then(({ createMateria }) => {
        if (!alive) return;
        try {
          m = createMateria(cv, { mobile });
          m.setPhase(state.p);
        } catch {
          setFallback(true);
        }
      })
      .catch(() => setFallback(true));

    const lenis = mobile || reduced ? null : new Lenis({ lerp: 0.08 });
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Lo scroll muove la fase in modo continuo; lo scrub dà l'inerzia alla camera e alla materia.
    const n = phases.length - 1;
    const st = ScrollTrigger.create({
      trigger: el.querySelector(".mv-track"),
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? true : 1.4,
      onUpdate: (self) => {
        const raw = self.progress * n;
        // Con movimento ridotto la materia salta da una forma compiuta all'altra, senza trasformazioni.
        state.p = reduced ? Math.round(raw) : raw;
        m?.setPhase(state.p);
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
  }, []);

  return (
    <div ref={root} className={`mv${fallback ? " mv-fallback" : ""}${active === phases.length - 1 ? " mv-light" : ""}`}>
      <canvas ref={canvas} className="mv-canvas" aria-hidden="true" />

      <header className="mv-head">
        <span className="mv-brand">{materia.title}</span>
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

      <div className="mv-copy" aria-live="polite">
        {phases.map((ph, i) => (
          <section key={ph.id} className={`mv-phase${i === active ? " is-on" : ""}`} aria-hidden={i !== active}>
            {i === 0 ? (
              <>
                <h1 className="mv-hero">{materia.title}</h1>
                <p className="mv-sub">{materia.subtitle}</p>
                <p className="mv-line">{materia.opening}</p>
              </>
            ) : (
              <>
                <p className="mv-kick">
                  {String(i + 1).padStart(2, "0")} · {ph.name}
                </p>
                <h2 className="mv-title">{ph.title}</h2>
                {ph.line && <p className="mv-line">{ph.line}</p>}
                {ph.note && <p className="mv-note">{ph.note}</p>}
              </>
            )}
          </section>
        ))}
      </div>

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
