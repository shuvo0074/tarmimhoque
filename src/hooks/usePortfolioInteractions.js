// Portfolio interactions: horizontal deck scroll, phone CSS progress, tilt, and section links.
// Keeps animation off the React render path by updating DOM/CSS variables imperatively.
// Views: web (primary); mobile falls back to native vertical scrolling.
import { useEffect } from "react";
import {
  ABOUT_PANEL_INDEX,
  ABOUT_TO_EXPERIENCE_SCROLL_MS,
  EXPERIENCE_PANEL_INDEX,
  MAX_SCROLL_PROGRESS,
  PHONE_HIDE_PROGRESS,
  PROJECTS_SLIDER_ACTIVE_PROGRESS,
  SCROLL_DEBUG_QUERY_PARAM,
  WHEEL_DEADZONE,
  WHEEL_GESTURE_SETTLE_MS,
} from "../constants/scroll";
import { isDesktop } from "../utils/isDesktop";
import { createScrollDebug } from "../utils/scrollDebug";

function getActivePanelIndex(deck, panels) {
  if (!deck || panels.length === 0) return 0;

  const center = deck.scrollLeft + deck.clientWidth / 2;
  let activeIndex = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  panels.forEach((panel, index) => {
    const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
    const distance = Math.abs(center - panelCenter);
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = index;
    }
  });

  return activeIndex;
}

function animateScrollTo(deck, targetLeft, durationMs, onFrameRef) {
  if (!deck) return;

  if (onFrameRef.current) {
    window.cancelAnimationFrame(onFrameRef.current);
    onFrameRef.current = null;
  }

  const startLeft = deck.scrollLeft;
  const delta = targetLeft - startLeft;
  if (Math.abs(delta) < 1) {
    deck.scrollLeft = targetLeft;
    return;
  }

  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - startTime) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    deck.scrollLeft = startLeft + delta * eased;
    if (t < 1) {
      onFrameRef.current = window.requestAnimationFrame(step);
      return;
    }
    onFrameRef.current = null;
    deck.scrollLeft = targetLeft;
  };

  onFrameRef.current = window.requestAnimationFrame(step);
}

function updatePhoneTransition(rootEl, deck, phoneStageEl, state, debug) {
  if (!rootEl || !deck || !phoneStageEl || !isDesktop()) {
    rootEl?.style.setProperty("--hero-about-progress", "0");
    rootEl?.style.setProperty("--about-experience-progress", "0");
    rootEl?.style.setProperty("--experience-projects-progress", "0");
    phoneStageEl?.classList.remove("is-hidden", "is-projects-visible");
    state.isPhoneStageHidden = false;
    state.isProjectsVisible = false;
    return;
  }

  const viewportWidth = deck.clientWidth || window.innerWidth || 1;
  const progress = Math.max(0, Math.min(MAX_SCROLL_PROGRESS, deck.scrollLeft / viewportWidth));
  const heroAboutProgress = Math.max(0, Math.min(1, progress));
  const aboutExperienceProgress = Math.max(0, Math.min(1, progress - 1));
  const experienceProjectsProgress = Math.max(0, Math.min(1, progress - 2));

  rootEl.style.setProperty("--hero-about-progress", heroAboutProgress.toFixed(3));
  rootEl.style.setProperty("--about-experience-progress", aboutExperienceProgress.toFixed(3));
  rootEl.style.setProperty(
    "--experience-projects-progress",
    experienceProjectsProgress.toFixed(3)
  );

  const shouldHidePhoneStage = progress > PHONE_HIDE_PROGRESS;
  if (shouldHidePhoneStage !== state.isPhoneStageHidden) {
    phoneStageEl.classList.toggle("is-hidden", shouldHidePhoneStage);
    state.isPhoneStageHidden = shouldHidePhoneStage;
    debug.push("phone-stage-visibility", {
      visible: !shouldHidePhoneStage,
      progress,
    });
  }

  const shouldShowProjectsSlider = progress >= PROJECTS_SLIDER_ACTIVE_PROGRESS;
  if (shouldShowProjectsSlider !== state.isProjectsVisible) {
    phoneStageEl.classList.toggle("is-projects-visible", shouldShowProjectsSlider);
    state.isProjectsVisible = shouldShowProjectsSlider;
  }
}

export function usePortfolioInteractions({ deckRef, phoneStageRef }) {
  useEffect(() => {
    const deck = deckRef.current;
    const phoneStageEl = phoneStageRef.current;
    const rootEl = document.documentElement;
    const panels = deck ? Array.from(deck.querySelectorAll(".panel")) : [];
    const dotElements = Array.from(document.querySelectorAll(".dot"));
    const tiltCards = Array.from(document.querySelectorAll("[data-tilt-card]"));
    const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

    const debug = createScrollDebug();
    const state = {
      isWheelGestureConsumed: false,
      isPhoneStageHidden: false,
      isProjectsVisible: false,
      lastActiveIndex: -1,
    };

    let wheelGestureUnlockTimerId = null;
    const scrollAnimationFrameRef = { current: null };
    let fastTransitionClearTimerId = null;

    debug.attach(() => ({
      isWheelGestureConsumed: state.isWheelGestureConsumed,
      activePanelIndex: state.lastActiveIndex,
    }));

    if (debug.enabled) {
      debug.push("debug-enabled", {
        queryParam: SCROLL_DEBUG_QUERY_PARAM,
        isDesktop: isDesktop(),
      });
    }

    const clearFastAboutExperienceTransition = () => {
      rootEl.classList.remove("is-fast-about-experience");
      if (fastTransitionClearTimerId) {
        window.clearTimeout(fastTransitionClearTimerId);
        fastTransitionClearTimerId = null;
      }
    };

    const resetWheelGestureTimer = () => {
      if (wheelGestureUnlockTimerId) {
        window.clearTimeout(wheelGestureUnlockTimerId);
        debug.push("gesture-timer-reset", { reason: "existing-timer-cleared" });
      }

      wheelGestureUnlockTimerId = window.setTimeout(() => {
        state.isWheelGestureConsumed = false;
        wheelGestureUnlockTimerId = null;
        debug.push("gesture-unlocked");
      }, WHEEL_GESTURE_SETTLE_MS);
    };

    const scrollToPanel = (index) => {
      if (!deck || panels.length === 0) return;

      const safeIndex = Math.max(0, Math.min(index, panels.length - 1));
      const fromIndex = getActivePanelIndex(deck, panels);
      const isAboutToExperience =
        fromIndex === ABOUT_PANEL_INDEX && safeIndex === EXPERIENCE_PANEL_INDEX;
      const targetLeft = panels[safeIndex].offsetLeft;

      debug.push("scroll-to-panel", {
        requestedIndex: index,
        safeIndex,
        fromIndex,
        isAboutToExperience,
        left: targetLeft,
      });

      if (isAboutToExperience) {
        rootEl.classList.add("is-fast-about-experience");
        if (fastTransitionClearTimerId) {
          window.clearTimeout(fastTransitionClearTimerId);
        }
        fastTransitionClearTimerId = window.setTimeout(() => {
          clearFastAboutExperienceTransition();
        }, ABOUT_TO_EXPERIENCE_SCROLL_MS + 80);
        animateScrollTo(deck, targetLeft, ABOUT_TO_EXPERIENCE_SCROLL_MS, scrollAnimationFrameRef);
        return;
      }

      clearFastAboutExperienceTransition();
      if (scrollAnimationFrameRef.current) {
        window.cancelAnimationFrame(scrollAnimationFrameRef.current);
        scrollAnimationFrameRef.current = null;
      }
      deck.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
    };

    const syncActiveDot = () => {
      updatePhoneTransition(rootEl, deck, phoneStageEl, state, debug);
      if (!deck || dotElements.length === 0 || panels.length === 0 || !isDesktop()) {
        return;
      }

      const activeIndex = getActivePanelIndex(deck, panels);
      if (activeIndex !== state.lastActiveIndex) {
        debug.push("active-panel-changed", {
          previousIndex: state.lastActiveIndex,
          activeIndex,
          scrollLeft: deck.scrollLeft,
        });
        state.lastActiveIndex = activeIndex;
      }

      dotElements.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    };

    const onWheel = (event) => {
      if (!deck || !isDesktop()) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < WHEEL_DEADZONE) {
        debug.push("wheel-ignored-deadzone", {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          dominantDelta,
        });
        return;
      }

      event.preventDefault();
      debug.push("wheel-received", {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        dominantDelta,
        consumed: state.isWheelGestureConsumed,
      });

      if (state.isWheelGestureConsumed) {
        resetWheelGestureTimer();
        debug.push("wheel-ignored-consumed", {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          dominantDelta,
        });
        return;
      }

      state.isWheelGestureConsumed = true;
      resetWheelGestureTimer();

      const activeIndex = getActivePanelIndex(deck, panels);
      const direction = dominantDelta > 0 ? 1 : -1;
      const targetIndex = activeIndex + direction;
      debug.push("wheel-accepted", {
        activeIndex,
        targetIndex,
        direction,
        dominantDelta,
      });
      scrollToPanel(targetIndex);
    };

    const onKeyDown = (event) => {
      if (!deck || !isDesktop()) return;
      if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const activeIndex = getActivePanelIndex(deck, panels);
      scrollToPanel(activeIndex + direction);
    };

    const tiltListeners = tiltCards.map((card) => {
      const onMouseMove = (event) => {
        if (!isDesktop()) return;

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) * 2 - 1) * 8;
        const rotateX = (1 - (y / rect.height) * 2) * 8;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      };

      const onMouseLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
      return { card, onMouseMove, onMouseLeave };
    });

    const linkListeners = sectionLinks.map((link) => {
      const onClick = (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        const targetIndex = panels.indexOf(target);
        if (targetIndex >= 0 && isDesktop()) {
          scrollToPanel(targetIndex);
        } else {
          target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        }
        window.history.replaceState(null, "", hash);
      };

      link.addEventListener("click", onClick);
      return { link, onClick };
    });

    if (deck) {
      deck.addEventListener("wheel", onWheel, { passive: false });
      deck.addEventListener("scroll", syncActiveDot, { passive: true });
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", syncActiveDot);
    window.addEventListener("load", syncActiveDot);

    syncActiveDot();
    debug.push("mounted", {
      activePanelIndex: getActivePanelIndex(deck, panels),
      panelCount: panels.length,
    });

    return () => {
      if (deck) {
        deck.removeEventListener("wheel", onWheel);
        deck.removeEventListener("scroll", syncActiveDot);
      }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncActiveDot);
      window.removeEventListener("load", syncActiveDot);

      tiltListeners.forEach(({ card, onMouseMove, onMouseLeave }) => {
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      });

      linkListeners.forEach(({ link, onClick }) => {
        link.removeEventListener("click", onClick);
      });

      if (wheelGestureUnlockTimerId) {
        window.clearTimeout(wheelGestureUnlockTimerId);
      }

      if (scrollAnimationFrameRef.current) {
        window.cancelAnimationFrame(scrollAnimationFrameRef.current);
      }

      clearFastAboutExperienceTransition();
      debug.detach();

      rootEl.style.setProperty("--hero-about-progress", "0");
      rootEl.style.setProperty("--about-experience-progress", "0");
      rootEl.style.setProperty("--experience-projects-progress", "0");
      phoneStageEl?.classList.remove("is-hidden", "is-projects-visible");
    };
  }, [deckRef, phoneStageRef]);
}
