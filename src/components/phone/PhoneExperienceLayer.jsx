// PhoneExperienceLayer: landscape Experience grid rendered inside the phone screen.
// Views: web only (inside PhoneStage).
import { memo } from "react";
import { EXPERIENCE } from "../../data/portfolio";

function PhoneExperienceLayerComponent() {
  return (
    <div className="phone-layer phone-layer-experience">
      <p className="phone-experience-tag">Experience</p>
      <h4>{EXPERIENCE.title}</h4>
      <div className="phone-experience-timeline">
        {EXPERIENCE.items.map((item) => (
          <article key={item.title} className="phone-experience-card">
            <p className="phone-experience-time">{item.time}</p>
            <h5>{item.title}</h5>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export const PhoneExperienceLayer = memo(PhoneExperienceLayerComponent);
