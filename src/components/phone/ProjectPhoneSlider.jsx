// ProjectPhoneSlider: project phones with autoplay.
// Web: sequential autoplay while projects panel is in view.
// Mobile: each phone autoplays independently only while that phone is visible.
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { VISIBLE_PROJECTS } from "../../data/portfolio";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ProjectPhone } from "./ProjectPhone";

const SLIDE_INTERVAL_MS = 4000;

function getSlideCount(project) {
  return 1 + (project.images?.length ?? 0);
}

function ProjectPhoneSliderComponent() {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideByPhone, setSlideByPhone] = useState(() =>
    VISIBLE_PROJECTS.map(() => 0)
  );
  const activePhoneRef = useRef(0);
  const projectsFocusedRef = useRef(false);

  useEffect(() => {
    if (isMobile) return undefined;

    const projectsPanel = document.getElementById("projects");
    if (!projectsPanel) return undefined;

    const syncPlaying = () => {
      const shouldPlay = projectsFocusedRef.current && !document.hidden;
      setIsPlaying((current) => (current === shouldPlay ? current : shouldPlay));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        projectsFocusedRef.current =
          entry.isIntersecting && entry.intersectionRatio >= 0.55;
        syncPlaying();
      },
      { threshold: [0, 0.35, 0.55, 0.75, 1] }
    );

    observer.observe(projectsPanel);
    document.addEventListener("visibilitychange", syncPlaying);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlaying);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || !isPlaying) return undefined;

    const timerId = window.setInterval(() => {
      let phoneIndex = activePhoneRef.current;
      let guards = 0;

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

        if (nextSlide === 0) {
          activePhoneRef.current = (phoneIndex + 1) % VISIBLE_PROJECTS.length;
        } else {
          activePhoneRef.current = phoneIndex;
        }

        return next;
      });
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [isMobile, isPlaying]);

  const stepPhone = useCallback((phoneIndex, direction) => {
    const slideCount = getSlideCount(VISIBLE_PROJECTS[phoneIndex]);
    if (slideCount <= 1) return;

    activePhoneRef.current = phoneIndex;
    setSlideByPhone((prev) => {
      const next = [...prev];
      next[phoneIndex] = (prev[phoneIndex] + direction + slideCount) % slideCount;
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
          independent={isMobile}
          activeSlide={slideByPhone[index]}
          onAdvance={() => stepPhone(index, 1)}
          onRetreat={() => stepPhone(index, -1)}
        />
      ))}
    </div>
  );
}

export const ProjectPhoneSlider = memo(ProjectPhoneSliderComponent);
