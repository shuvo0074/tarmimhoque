import { memo } from "react";
import { EXPERIENCE } from "../../data/portfolio";

function ExperienceSectionComponent() {
  return (
    <section id="experience" className="panel">
      <div className="panel-content experience-panel-content">
        <div className="experience-phone-space" aria-hidden="true"></div>
        <div className="experience-mobile-fallback">
          <p className="eyebrow">Experience</p>
          <h2>{EXPERIENCE.title}</h2>
          <div className="timeline">
            {EXPERIENCE.items.map((item) => (
              <article key={item.title} className="timeline-item card">
                <p className="time">{item.time}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const ExperienceSection = memo(ExperienceSectionComponent);
