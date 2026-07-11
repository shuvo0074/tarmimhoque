// ProjectPhoneSlider: experience phone splits into a horizontal row of project phones.
// Autoplay advances one phone at a time through its slides, then moves to the next.
// Views: web only (inside PhoneStage).
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { VISIBLE_PROJECTS } from "../../data/portfolio";
import { ProjectPhone } from "./ProjectPhone";

const SLIDE_INTERVAL_MS = 3000;

function getSlideCount(project) {
  return 1 + (project.images?.length ?? 0);
}

function ProjectPhoneSliderComponent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideByPhone, setSlideByPhone] = useState(() =>
    VISIBLE_PROJECTS.map(() => 0)
  );
  const activePhoneRef = useRef(0);

  useEffect(() => {
    const stage = document.querySelector(".phone-stage");
    if (!stage) return undefined;

    const sync = () => {
      setIsPlaying(
        stage.classList.contains("is-projects-visible") &&
          !stage.classList.contains("is-hidden")
      );
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(stage, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timerId = window.setInterval(() => {
      let phoneIndex = activePhoneRef.current;
      let guards = 0;

      // Skip phones that have nothing to slide; move focus forward.
      while (
        getSlideCount(VISIBLE_PROJECTS[phoneIndex]) <= 1 &&
        guards < VISIBLE_PROJECTS.length
      ) {
        phoneIndex = (phoneIndex + 1) % VISIBLE_PROJECTS.length;
        guards += 1;
      }

      if (getSlideCount(VISIBLE_PROJECTS[phoneIndex]) <= 1) return;

      setSlideByPhone((prev) => {
        const next = [...prev];
        const slideCount = getSlideCount(VISIBLE_PROJECTS[phoneIndex]);
        const nextSlide = (prev[phoneIndex] + 1) % slideCount;
        next[phoneIndex] = nextSlide;

        // After a full loop on this phone, hand off to the next one.
        if (nextSlide === 0) {
          activePhoneRef.current = (phoneIndex + 1) % VISIBLE_PROJECTS.length;
        } else {
          activePhoneRef.current = phoneIndex;
        }

        return next;
      });
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [isPlaying]);

  const advancePhone = useCallback((phoneIndex) => {
    const slideCount = getSlideCount(VISIBLE_PROJECTS[phoneIndex]);
    if (slideCount <= 1) return;

    activePhoneRef.current = phoneIndex;
    setSlideByPhone((prev) => {
      const next = [...prev];
      next[phoneIndex] = (prev[phoneIndex] + 1) % slideCount;
      return next;
    });
  }, []);

  return (
    <div className="project-phone-slider">
      {VISIBLE_PROJECTS.map((project, index) => (
        <ProjectPhone
          key={project.title}
          project={project}
          index={index}
          total={VISIBLE_PROJECTS.length}
          activeSlide={slideByPhone[index]}
          onAdvance={() => advancePhone(index)}
        />
      ))}
    </div>
  );
}

export const ProjectPhoneSlider = memo(ProjectPhoneSliderComponent);
