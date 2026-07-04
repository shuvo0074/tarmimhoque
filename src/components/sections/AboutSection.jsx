import { memo } from "react";
import { ABOUT } from "../../data/portfolio";

function AboutSectionComponent() {
  return (
    <section id="about" className="panel">
      <div className="panel-content about-layout">
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h2>{ABOUT.title}</h2>
          <p className="section-lead">{ABOUT.lead}</p>
          <div className="about-grid">
            <article className="card">
              <h3>What I Do</h3>
              <ul>
                {ABOUT.whatIDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <h3>Core Stack</h3>
              <div className="skills">
                {ABOUT.coreStack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
        <div className="about-phone-space" aria-hidden="true"></div>
      </div>
    </section>
  );
}

export const AboutSection = memo(AboutSectionComponent);
