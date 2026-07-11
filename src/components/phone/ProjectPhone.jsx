// ProjectPhone: portrait phone card with intro + image slides (controlled autoplay).
// Views: web only (inside ProjectPhoneSlider).
import { memo } from "react";

function ProjectPhoneComponent({
  project,
  index,
  total,
  activeSlide,
  onAdvance,
}) {
  const images = project.images ?? [];
  const slideCount = 1 + images.length;

  const handleMouseEnter = () => {
    if (slideCount <= 1) return;

    // Keep image slides with action buttons steady so the link can be clicked.
    if (activeSlide > 0) {
      const currentImage = images[activeSlide - 1];
      if (currentImage?.buttons?.length > 0) return;
    }

    onAdvance?.();
  };

  return (
    <article
      className="project-phone"
      style={{
        "--project-index": index,
        "--project-count": total,
      }}
      onMouseEnter={handleMouseEnter}
    >
      <div className="project-phone-frame">
        <div className="project-phone-notch">
          <span className="project-phone-camera"></span>
          <span className="project-phone-speaker"></span>
        </div>

        <div className="project-phone-content">
          <div
            className="project-phone-slides"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            <div className="project-phone-slide project-phone-slide-intro">
              <div className="phone-bars">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="phone-text">Selected work</div>
              <div className="phone-hero-highlight">
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

            {images.map((image) => {
              const isSplash = Boolean(image.buttons?.length);

              return (
                <div
                  key={image.alt ?? image.src}
                  className={`project-phone-slide project-phone-slide-media${isSplash ? " is-splash" : ""}`}
                >
                  {isSplash ? (
                    <div className="project-phone-splash">
                      <img
                        className="project-phone-logo"
                        src={image.src}
                        alt={image.alt ?? project.title}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                    </div>
                  ) : (
                    <img
                      className="project-phone-image"
                      src={image.src}
                      alt={image.alt ?? project.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  )}
                  {isSplash && (
                    <div className="project-phone-actions">
                      {image.buttons.map((button) => (
                        <a
                          key={button.url}
                          className="project-phone-link"
                          href={button.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {button.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="project-phone-gesture"></div>
        <div className="project-phone-glow"></div>
      </div>
    </article>
  );
}

export const ProjectPhone = memo(ProjectPhoneComponent);
