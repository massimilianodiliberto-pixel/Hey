"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Station, arrival as Arrival } from "@/content/stations";
import { createEngine } from "@/lib/engine";
import { looks } from "./looks";
import { Planes } from "./Planes";
import { StaticJourney } from "./StaticJourney";

export type JourneyProps = {
  opening: { line: string };
  stations: Station[]; // quelle costruite in questo passo
  allStations: Station[]; // tutte, per indice e tracce
  arrival: typeof Arrival;
  ui: Record<string, string>;
};

export default function Journey(props: JourneyProps) {
  const { opening, stations, allStations, arrival, ui } = props;
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
    return createEngine(root.current, { stations, hub: arrival.hub, arrivalId: arrival.id });
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
          // «prima» / «dopo» / «oggi»: solo dalla posizione relativa nel tempo, mai una data
          const next = stations[i + 1];
          const timeWord = !next ? ui.now : next.era < s.era ? ui.before : ui.after;
          return (
            <section key={s.id} className="scene" data-scene={s.id} style={{ zIndex: 10 + i }} aria-label={s.sense}>
              <div className="scene-entry">
                <div className="scene-wash" />
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
                <div className="world-wrap">
                  <p className="world">{s.worlds.join(" · ")}</p>
                </div>
                {s.received && (
                  <div className="received-wrap">
                    <p className="received">{s.received.text}</p>
                  </div>
                )}
                <h2 className="sense">{s.sense}</h2>
                {s.today && <p className="today">{s.today.text}</p>}
                {links.length > 0 && (
                  <nav className="links" aria-label={ui.links}>
                    {links.map((id) => (
                      <button key={id} type="button" data-jump={id}>
                        → {allStations.find((x) => x.id === id)?.sense}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
              <p className="timeword" aria-hidden="true">
                {timeWord}
              </p>
            </section>
          );
        })}

        <section className="arrival" data-scene={arrival.id} aria-label={ui.arrival}>
          <div className="arrival-entry">
            <svg className="arrival-lines" aria-hidden="true">
              {stations
                .filter((s) => s.id !== arrival.hub)
                .map((s) => (
                  <line key={s.id} data-line={s.id} />
                ))}
            </svg>
            <div className="portrait" role="img" aria-label={arrival.portrait.alt}>
              <span className="portrait-head" />
              <span className="portrait-body" />
              <span className="portrait-tag">{arrival.portrait.src}</span>
            </div>
            <div className="ring">
              {stations.map((s) => (
                <span key={s.id} className="ring-sense" data-ring={s.id}>
                  {s.sense}
                </span>
              ))}
            </div>
            <p className="instinct">{arrival.sense}</p>
            <div className="arrival-text">
              <p className="arrival-line">{arrival.line}</p>
              <p className="arrival-closing">{arrival.closing}</p>
              <p className="arrival-name">{arrival.name}</p>
              <p className="arrival-contacts">
                {arrival.contacts.map((c) => (
                  <a key={c.label} href={c.href}>
                    {c.label}
                  </a>
                ))}
              </p>
            </div>
          </div>
        </section>
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
                  {s.sense}
                  <span className="index-world">{s.worlds.join(" · ")}</span>
                </button>
              ) : (
                <span className="is-soon" title={ui.soon}>
                  {s.sense}
                </span>
              )}
            </li>
          ))}
          <li>
            <button type="button" data-jump={arrival.id} data-index={arrival.id} onClick={() => setIndexOpen(false)}>
              {ui.arrival}
            </button>
          </li>
        </ul>
      </nav>

      <p className="preview-tag">{ui.preview}</p>

      <div className="invite" aria-hidden="true">
        {ui.continue}
        <span className="invite-line" />
      </div>

      <div className="tracks" aria-hidden="true">
        <div className="track track-opening" data-track="opening" />
        {stations.map((s) => (
          <div key={s.id} className="track track-station" data-track={s.id} />
        ))}
        <div className="track track-arrival" data-track={arrival.id} />
      </div>
    </div>
  );
}
