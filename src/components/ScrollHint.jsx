// ScrollHint: dual-side bouncing arrows that nudge users to scroll.
// Views: web and mobile.
import { memo } from "react";

function ScrollHintComponent() {
  return (
    <div className="scroll-hint" aria-hidden="true">
      <span className="scroll-hint-arrow scroll-hint-arrow--left">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="scroll-hint-arrow scroll-hint-arrow--right">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

export const ScrollHint = memo(ScrollHintComponent);
