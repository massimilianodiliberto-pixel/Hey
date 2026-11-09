import type { Metadata } from "next";
import { versioni } from "@/content/versioni";
import "./versioni.css";

export const metadata: Metadata = {
  title: "Le proposte",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="vx">
      <header className="vx-head">
        <p className="vx-kick">{versioni.kicker}</p>
        <h1 className="vx-title">{versioni.title}</h1>
        <p className="vx-intro">{versioni.intro}</p>
      </header>
      <ol className="vx-list">
        {versioni.items.map((it) => (
          <li key={it.id} className="vx-item">
            <a className="vx-card" href={it.href} {...(it.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span className="vx-thumb">
                {it.thumb ? <img src={it.thumb} alt="" loading="lazy" /> : <span className="vx-word">{it.label}</span>}
              </span>
              <span className="vx-meta">
                <span className="vx-label">{it.label}</span>
                <span className="vx-name">{it.title}</span>
                <span className="vx-text">{it.text}</span>
                <span className="vx-open">
                  {versioni.open} {it.external ? "↗" : "→"}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="vx-note">{versioni.note}</p>
    </main>
  );
}
