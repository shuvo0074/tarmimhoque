import { memo } from "react";
import { DOTS } from "../data/portfolio";

function DotsComponent() {
  return (
    <div className="dots" aria-hidden="true">
      {DOTS.map((dot, index) => (
        <a key={dot} href={dot} className={`dot ${index === 0 ? "is-active" : ""}`}></a>
      ))}
    </div>
  );
}

export const Dots = memo(DotsComponent);
