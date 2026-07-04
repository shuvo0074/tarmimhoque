// PhoneAboutLayer: About-state phone UI (status bars, React badge, quote).
// Views: web only (inside PhoneStage).
import { memo } from "react";
import { PHONE_ABOUT } from "../../data/portfolio";

function PhoneAboutLayerComponent() {
  return (
    <div className="phone-layer phone-layer-about-composite">
      <div className="phone-top"></div>
      <div className="phone-bars">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="phone-text">{PHONE_ABOUT.statusText}</div>
      <div className="phone-hero-highlight">
        <div className="phone-react-badge" aria-hidden="true">
          <svg
            className="phone-react-logo"
            viewBox="-11.5 -10.5 23 21"
            role="presentation"
          >
            <ellipse rx="11" ry="4.2"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
            <circle r="1.7"></circle>
          </svg>
        </div>
        <div className="phone-hero-copy">
          <p className="phone-hero-title">{PHONE_ABOUT.title}</p>
          <p className="phone-hero-subtext">{PHONE_ABOUT.subtext}</p>
        </div>
      </div>
    </div>
  );
}

export const PhoneAboutLayer = memo(PhoneAboutLayerComponent);
