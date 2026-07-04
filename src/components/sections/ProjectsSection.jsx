import { memo } from "react";
import { PROJECTS } from "../../data/portfolio";

function ProjectsSectionComponent() {
  return (
    <section id="projects" className="panel">
      <div className="panel-content">
        <p className="eyebrow">Selected Work</p>
        <h2>Apps and platforms that shipped</h2>
        <div className="project-row">
          {PROJECTS.map((project) => (
            <article key={project.title} className="project card" data-tilt-card>
              <h3>{project.title}</h3>
              <p>{project.body}</p>
              <div className="chip-group">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export const ProjectsSection = memo(ProjectsSectionComponent);
