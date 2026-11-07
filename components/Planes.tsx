import type { CSSProperties } from "react";
import type { Look, Shape } from "./looks";

function ShapeEl({ s }: { s: Shape }) {
  const round = s.kind === "disc" || s.kind === "ring";
  const style: CSSProperties = {
    left: `${s.x}%`,
    top: `${s.y}%`,
    width: `${s.w}%`,
    background: s.kind === "ring" ? "transparent" : s.color,
    border: s.kind === "ring" ? `${s.stroke ?? 6}px solid ${s.color}` : undefined,
    borderRadius: round ? "50%" : s.kind === "pill" ? "999px" : 0,
  };
  if (s.h != null) style.height = `${s.h}%`;
  else style.aspectRatio = "1";
  return <span className="shape" style={style} />;
}

export function Planes({ look }: { look: Look }) {
  return (
    <>
      {(["bg", "mid", "fg"] as const).map((k) => (
        <div key={k} className={`plane plane-${k}`} data-plane={k}>
          {look.planes[k].map((s, i) => (
            <ShapeEl key={i} s={s} />
          ))}
        </div>
      ))}
    </>
  );
}
