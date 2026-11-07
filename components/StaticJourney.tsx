"use client";

// prefers-reduced-motion: niente pin e niente scrub. Ogni stazione è una pagina ferma,
// la clip parte solo a mano (BRIEF §8, TIMELINE §E).

import { useEffect, useRef, useState } from "react";
import type { JourneyProps } from "./Journey";
import { config } from "@/config";
import { looks } from "./looks";
import { Planes } from "./Planes";

function ManualClip({ label, title }: { label: string; title?: string }) {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => {
    if (t === null || t >= config.clipSeconds) return;
    const id = setTimeout(() => setT(t + 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  const running = t !== null && t < config.clipSeconds;
  return (
    <div className="clipui static-clipui">
      <span className="clip-title">{title}</span>
      <button type="button" onClick={() => setT(0)} disabled={running}>
        {running ? `00:${String(t).padStart(2, "0")} / 00:${config.clipSeconds}` : label}
      </button>
    </div>
  );
}

export function StaticJourney({ opening, stations, allStations, arrival, ui }: JourneyProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = root.current?.querySelectorAll(".static-page");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-in", e.isIntersecting)),
      { threshold: 0.35 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="static-journey">
      <nav className="index is-static" aria-label={ui.index}>
        <ul>
          {allStations.map((s) => (
            <li key={s.id}>
              {stations.some((x) => x.id === s.id) ? <a href={`#${s.id}`}>{s.sense}</a> : <span className="is-soon">{s.sense}</span>}
            </li>
          ))}
          <li>
            <a href={`#${arrival.id}`}>{ui.arrival}</a>
          </li>
        </ul>
      </nav>
      <p className="preview-tag">{ui.preview}</p>
      <section className="static-page">
        <div className="frame-box opening-shape static-shape" />
        <p className="opening-line">{opening.line}</p>
      </section>
      {stations.map((s) => (
        <section key={s.id} id={s.id} className="static-page" aria-label={s.sense}>
          <div className="frame-box frame">
            <div className="live">
              <Planes look={looks[s.id]} />
            </div>
          </div>
          <ManualClip label={ui.playClip} title={s.clips[s.clips.length - 1]?.title} />
          <div className="static-below">
            <p className="world">{s.worlds.join(" · ")}</p>
            {s.received && <p className="received">{s.received.text}</p>}
            {s.today && <p className="received">{s.today.text}</p>}
          </div>
          <h2 className="sense static-sense">{s.sense}</h2>
        </section>
      ))}
      <section id={arrival.id} className="static-page static-arrival" aria-label={ui.arrival}>
        <div className="portrait static-portrait" role="img" aria-label={arrival.portrait.alt}>
          <span className="portrait-head" />
          <span className="portrait-body" />
          <span className="portrait-tag">{arrival.portrait.src}</span>
        </div>
        <ul className="static-senses">
          {stations.map((s) => (
            <li key={s.id}>{s.sense}</li>
          ))}
        </ul>
        <p className="instinct static-visible">{arrival.sense}</p>
        <div className="arrival-text static-text">
          <p>{arrival.line}</p>
          <p>{arrival.closing}</p>
          <p className="arrival-name">{arrival.name}</p>
          <p className="arrival-contacts">
            {arrival.contacts.map((c) => (
              <a key={c.label} href={c.href}>
                {c.label}
              </a>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
