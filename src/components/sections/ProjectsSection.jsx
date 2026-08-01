// ProjectsSection: selected shipped apps and platforms.
// Views: web (title + phone-stage spacer) and mobile (inline project phone slider).
import { memo } from "react";
import { ProjectPhoneSlider } from "../phone/ProjectPhoneSlider";
import { useIsMobile } from "../../hooks/useIsMobile";

function ProjectsSectionComponent() {
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="panel">
      <div className="panel-content projects-panel-content">
        <p className="eyebrow">Selected Work</p>
        <h2>Apps and platforms that shipped</h2>
        {isMobile ? (
          <div className="projects-mobile-phones">
            <ProjectPhoneSlider />
          </div>
        ) : (
          <div className="projects-phone-space" aria-hidden="true"></div>
        )}
      </div>
    </section>
  );
}

export const ProjectsSection = memo(ProjectsSectionComponent);
