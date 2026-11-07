"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Station } from "@/content/stations";
import { createEngine } from "@/lib/engine";
import { looks } from "./looks";
import { Planes } from "./Planes";
import { StaticJourney } from "./StaticJourney";

export type JourneyProps = {
  opening: { line: string };
  stations: Station[]; // quelle costruite in questo passo
  allStations: Station[]; // tutte, per indice e tracce
  ui: Record<string, string>;
};

export default function Journey(props: JourneyProps) {
  const { opening, stations, allStations, ui } = props;
  const root = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced !== false || !root.current) return;
    return createEngine(root.current, { stations });
  }, [reduced, stations]);

  if (reduced) return <StaticJourney {...props} />;

  const built = new Set(stations.map((s) => s.id));

  return (
    <div ref={root} className="journey">
      <div className="stage">
        <div className="opening">
          <div className="frame-box opening-shape" />
          <p className="opening-line">{opening.line}</p>
        </div>

        {stations.map((s, i) => {
          const look = looks[s.id];
          const links = (s.links ?? []).filter((id) => built.has(id));
          return (
            <section key={s.id} className="scene" data-scene={s.id} style={{ zIndex: 10 + i }} aria-label={s.title}>
              <div className="scene-entry">
                <div className="scene-zoom">
                  <div className="scene-exit">
                    <div className="frame-box frame">
                      <div className="live">
                        <Planes look={look} />
                      </div>
                      <div className="clip-layer" aria-hidden="true">
                        <div className="clip-cam">
                          <Planes look={look} />
                        </div>
                        <div className="clip-tint" />
                        <div className="clip-caption" />
                        <div className="clip-hud">
                          <span className="clip-tc">00:00</span>
                          <span>{ui.placeholderClip}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scene-text">
                <div className="clipui-wrap">
                  <div className="clipui">
                    <span className="clip-title">{s.clips[0]?.title}</span>
                    <button type="button" className="clip-skip">
                      {ui.skip}
                    </button>
                    <button type="button" className="clip-replay">
                      {ui.replay}
                    </button>
                    <a
                      className="clip-full"
                      href={s.clips[s.clips.length - 1]?.fullWorkUrl ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-disabled={!s.clips[s.clips.length - 1]?.fullWorkUrl}
                    >
                      {ui.fullWork} ↗
                    </a>
                  </div>
                </div>
                <div className="received-wrap">
                  <p className="received">{s.received.text}</p>
                </div>
                <h2 className="sense">{s.sense}</h2>
                <p className="today">{s.today.text}</p>
                {links.length > 0 && (
                  <nav className="links" aria-label={ui.links}>
                    {links.map((id) => (
                      <button key={id} type="button" data-jump={id}>
                        → {allStations.find((x) => x.id === id)?.title}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </section>
          );
        })}

        <div className="end">
          <p>{ui.end}</p>
        </div>
      </div>

      <div className="veil" />

      <div className="traces" aria-label="Sensi aperti">
        {allStations.map((s) => {
          const t = looks[s.id]?.trace;
          const slot = t?.slot ?? 0;
          const style = {
            "--tx": t?.x,
            "--ty": t?.y,
            "--mx": `${4 + (slot % 3) * 31}vw`,
            "--my": `${3 + Math.floor(slot / 3) * 2.6}vh`,
          } as CSSProperties;
          return (
            <span key={s.id} className="trace" data-trace={s.id} style={style}>
              {s.sense}
            </span>
          );
        })}
      </div>

      <nav className={`index${indexOpen ? " is-open" : ""}`} aria-label={ui.index}>
        <button type="button" className="index-toggle" aria-expanded={indexOpen} onClick={() => setIndexOpen((o) => !o)}>
          {ui.index}
        </button>
        <ul>
          {allStations.map((s) => (
            <li key={s.id}>
              {built.has(s.id) ? (
                <button type="button" data-jump={s.id} data-index={s.id} onClick={() => setIndexOpen(false)}>
                  {s.title}
                </button>
              ) : (
                <span className="is-soon" title={ui.soon}>
                  {s.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="invite" aria-hidden="true">
        {ui.continue}
        <span className="invite-line" />
      </div>

      <div className="tracks" aria-hidden="true">
        <div className="track track-opening" data-track="opening" />
        {stations.map((s) => (
          <div key={s.id} className="track track-station" data-track={s.id} />
        ))}
        <div className="track track-end" data-track="end" />
      </div>
    </div>
  );
}
