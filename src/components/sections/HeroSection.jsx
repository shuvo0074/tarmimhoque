import { memo } from "react";
import { HERO, PROFILE } from "../../data/portfolio";

function HeroSectionComponent() {
  return (
    <section id="hero" className="panel">
      <div className="panel-content hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">{PROFILE.role}</p>
          <h1>{PROFILE.name}</h1>
          <p className="lead">{HERO.lead}</p>
          <div className="hero-meta">
            {HERO.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button button-solid" href="#projects">
              Explore Work
            </a>
            <a
              className="button button-ghost"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="hero-phone-space" aria-hidden="true"></div>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
