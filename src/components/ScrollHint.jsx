// ScrollHint: dual-side stacked chevrons that blink in sequence to nudge scroll.
// Views: web and mobile.
import { memo } from "react";

function Chevron() {
  return (
    <svg viewBox="0 0 24 14" fill="none" aria-hidden="true">
      <path
        d="M4 2l8 8 8-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowStack({ side }) {
  return (
    <span className={`scroll-hint-stack scroll-hint-stack--${side}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="scroll-hint-chevron"
          style={{ "--i": i }}
        >
          <Chevron />
        </span>
      ))}
    </span>
  );
}

function ScrollHintComponent() {
  return (
    <div className="scroll-hint" aria-hidden="true">
      <ArrowStack side="left" />
      <ArrowStack side="right" />
    </div>
  );
}

export const ScrollHint = memo(ScrollHintComponent);
