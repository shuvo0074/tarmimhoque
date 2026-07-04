// ProjectPhone: portrait phone card showing one project (About-style screen UI).
// Views: web only (inside ProjectPhoneSlider).
import { memo } from "react";

function ProjectPhoneComponent({ project, index, total }) {
  return (
    <article
      className="project-phone"
      style={{
        "--project-index": index,
        "--project-count": total,
      }}
    >
      <div className="project-phone-frame">
        <div className="project-phone-notch">
          <span className="project-phone-camera"></span>
          <span className="project-phone-speaker"></span>
        </div>

        <div className="project-phone-content">
          <div className="phone-bars">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="phone-text">Selected work</div>
          <div className="phone-hero-highlight">
            <div className="project-phone-badge" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="phone-hero-copy">
              <p className="phone-hero-title">{project.title}</p>
              <p className="phone-hero-subtext">{project.body}</p>
            </div>
          </div>
          <div className="phone-hero-tech">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="project-phone-gesture"></div>
        <div className="project-phone-glow"></div>
      </div>
    </article>
  );
}

export const ProjectPhone = memo(ProjectPhoneComponent);
