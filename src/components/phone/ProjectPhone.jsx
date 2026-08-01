// ProjectPhone: portrait phone card with intro + image slides.
// Desktop: slides controlled by parent (sequential autoplay).
// Mobile: independent autoplay only while this phone is visible; swipe to change slides.
import { memo, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD_PX = 40;
const SLIDE_INTERVAL_MS = 4000;
const VISIBLE_RATIO = 0.45;

function ProjectPhoneComponent({
  project,
  index,
  total,
  activeSlide: controlledSlide,
  onAdvance,
  onRetreat,
  independent = false,
}) {
  const images = project.images ?? [];
  const slideCount = 1 + images.length;
  const rootRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const ignoreSwipeRef = useRef(false);
  const [localSlide, setLocalSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const activeSlide = independent ? localSlide : controlledSlide;
  const currentHasButtons =
    activeSlide > 0 && Boolean(images[activeSlide - 1]?.buttons?.length);

  useEffect(() => {
    if (!independent || !rootRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(
          entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO
        );
      },
      { threshold: [0, 0.25, 0.45, 0.65, 1] }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [independent]);

  useEffect(() => {
    // Pause on the CTA/buttons slide — no loop past the last action image.
    if (!independent || !isVisible || slideCount <= 1 || currentHasButtons) {
      return undefined;
    }

    let timerId = null;

    const stop = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const start = () => {
      if (document.hidden || timerId !== null) return;
      timerId = window.setInterval(() => {
        setLocalSlide((current) => {
          const next = current + 1;
          return next < slideCount ? next : current;
        });
      }, SLIDE_INTERVAL_MS);
    };

    const sync = () => {
      stop();
      start();
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [currentHasButtons, independent, isVisible, slideCount]);

  const step = (direction) => {
    if (slideCount <= 1) return;

    if (independent) {
      setLocalSlide((current) => (current + direction + slideCount) % slideCount);
      return;
    }

    if (direction > 0) onAdvance?.();
    else onRetreat?.();
  };

  const handleMouseEnter = () => {
    if (independent || slideCount <= 1 || currentHasButtons) return;
    onAdvance?.();
  };

  const handleTouchStart = (event) => {
    if (slideCount <= 1) return;
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    ignoreSwipeRef.current = false;
  };

  const handleTouchMove = (event) => {
    if (touchStartXRef.current == null || touchStartYRef.current == null) return;
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - touchStartXRef.current);
    const dy = Math.abs(touch.clientY - touchStartYRef.current);
    if (dy > dx && dy > 10) {
      ignoreSwipeRef.current = true;
    }
  };

  const handleTouchEnd = (event) => {
    if (
      touchStartXRef.current == null ||
      ignoreSwipeRef.current ||
      slideCount <= 1
    ) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    const dx = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    step(dx < 0 ? 1 : -1);
  };

  return (
    <article
      ref={rootRef}
      className="project-phone"
      style={{
        "--project-index": index,
        "--project-count": total,
      }}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
