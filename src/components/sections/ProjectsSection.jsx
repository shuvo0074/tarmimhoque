// ProjectsSection: selected shipped apps and platforms.
// Views: web (title + phone slider spacer) and mobile (card fallback).
import { memo } from "react";
import { VISIBLE_PROJECTS } from "../../data/portfolio";

function getProjectButtons(project) {
  return (project.images ?? []).flatMap((image) => image.buttons ?? []);
}

function ProjectsSectionComponent() {
  return (
    <section id="projects" className="panel">
      <div className="panel-content projects-panel-content">
        <p className="eyebrow">Selected Work</p>
        <h2>Apps and platforms that shipped</h2>
        <div className="projects-phone-space" aria-hidden="true"></div>
        <div className="projects-mobile-fallback">
          <div className="project-row">
            {VISIBLE_PROJECTS.map((project) => {
              const buttons = getProjectButtons(project);

              return (
                <article key={project.title} className="project card">
                  <h3>{project.title}</h3>
                  <p>{project.body}</p>
                  <div className="chip-group">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {buttons.length > 0 && (
                    <div className="project-card-actions">
                      {buttons.map((button) => (
                        <a
                          key={button.url}
                          className="button button-ghost"
                          href={button.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {button.label}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const ProjectsSection = memo(ProjectsSectionComponent);
