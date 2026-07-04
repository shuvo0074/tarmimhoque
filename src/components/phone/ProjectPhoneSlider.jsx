// ProjectPhoneSlider: experience phone splits into a horizontal row of project phones.
// Views: web only (inside PhoneStage).
import { memo } from "react";
import { VISIBLE_PROJECTS } from "../../data/portfolio";
import { ProjectPhone } from "./ProjectPhone";

function ProjectPhoneSliderComponent() {
  return (
    <div className="project-phone-slider">
      {VISIBLE_PROJECTS.map((project, index) => (
        <ProjectPhone
          key={project.title}
          project={project}
          index={index}
          total={VISIBLE_PROJECTS.length}
        />
      ))}
    </div>
  );
}

export const ProjectPhoneSlider = memo(ProjectPhoneSliderComponent);
