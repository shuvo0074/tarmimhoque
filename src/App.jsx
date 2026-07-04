import { useEffect } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const dots = ["#hero", "#about", "#experience", "#projects", "#contact"];
const ABOUT_TITLE = "Product-minded engineer with leadership focus";
const ABOUT_LEAD =
  "At Magnushub I lead mobile development, manage releases, and help teams deliver with clean architecture, CI/CD, and reliable app-store shipping.";
const ABOUT_WHAT_I_DO_ITEMS = [
  "Cross-platform app architecture with React Native",
  "App Store and Play Store release management",
  "Feature planning with clients and engineering teams",
  "Realtime communication with WebRTC and Matrix",
];
const CORE_STACK_ITEMS = [
  "React Native",
  "React.js",
  "iOS / SwiftUI",
  "GraphQL",
  "Node.js",
  "Firebase",
  "WebRTC",
  "CI/CD",
];
const EXPERIENCE_TITLE = "Building mobile products across startups and global teams";
const EXPERIENCE_ITEMS = [
  {
    time: "2021 - Present",
    title: "Lead Mobile App Developer · Magnushub Ltd.",
    body: "Leading React Native app maintenance, release workflows, CI/CD, and team task distribution while translating business requirements into stable product features.",
  },
  {
    time: "2024 - 2025",
    title: "Lead Mobile App Developer (Part-time) · Synesis IT Ltd.",
    body: "Worked on WebRTC, Jitsi Meet, and Matrix integrations in React Native and modified SwiftUI iOS chat modules for production communication use cases.",
  },
  {
    time: "2020 - 2022",
    title: "Lead App Developer · Self Aware Machines Pvt. Ltd.",
    body: "Built meeting-room SDK solutions and web apps using React, GraphQL, Firebase auth, and realtime collaboration technologies for online classroom experiences.",
  },
  {
    time: "2018 - 2021",
    title: "Software Developer / Engineer · Multiple Teams",
    body: "Delivered commerce, media, and event apps with React Native, Redux, MobX, Sentry, and push notifications while maintaining agile team processes.",
  },
];
const CHIP_PARTS = [
  { id: "camera", kind: "chip-camera-module", variant: "camera" },
  { id: "board", kind: "chip-motherboard", variant: "board" },
  { id: "battery", kind: "chip-battery", variant: "battery" },
  { id: "screen", kind: "chip-screen-layer", variant: "screen" },
  { id: "core", kind: "chip-core-processor", variant: "core" },
  { id: "lens", kind: "chip-lens-ring", variant: "lens" },
  { id: "connector1", kind: "chip-connector", variant: "connector" },
  { id: "connector2", kind: "chip-connector", variant: "connector" },
  { id: "tiny1", kind: "chip-tiny-block", variant: "ic" },
  { id: "tiny2", kind: "chip-tiny-block", variant: "capacitor" },
  { id: "tiny3", kind: "chip-tiny-block", variant: "resistor" },
  { id: "tiny4", kind: "chip-tiny-block", variant: "ic" },
];

function ChipPartInner({ variant }) {
  if (variant === "camera") {
    return (
      <>
        <span className="chip-cam-body"></span>
        <span className="chip-cam-lens chip-cam-lens-lg"></span>
        <span className="chip-cam-lens chip-cam-lens-sm"></span>
        <span className="chip-cam-flash"></span>
        <span className="chip-cam-mic"></span>
      </>
    );
  }

  if (variant === "board") {
    return (
      <>
        <span className="chip-pcb-trace t1"></span>
        <span className="chip-pcb-trace t2"></span>
        <span className="chip-pcb-trace t3"></span>
        <span className="chip-pcb-ic"></span>
        <span className="chip-pcb-pad p1"></span>
        <span className="chip-pcb-pad p2"></span>
        <span className="chip-pcb-pad p3"></span>
        <span className="chip-pcb-pad p4"></span>
      </>
    );
  }

  if (variant === "battery") {
    return (
      <>
        <span className="chip-batt-cell"></span>
        <span className="chip-batt-label"></span>
        <span className="chip-batt-tab"></span>
        <span className="chip-batt-stripe"></span>
      </>
    );
  }

  if (variant === "screen") {
    return (
      <>
        <span className="chip-screen-glass"></span>
        <span className="chip-screen-notch"></span>
        <span className="chip-screen-shine"></span>
      </>
    );
  }

  if (variant === "core") {
    return (
      <>
        <span className="chip-die"></span>
        <span className="chip-die-mark"></span>
        <span className="chip-pin-row top"></span>
        <span className="chip-pin-row bottom"></span>
        <span className="chip-pin-row left"></span>
        <span className="chip-pin-row right"></span>
      </>
    );
  }

  if (variant === "lens") {
    return (
      <>
        <span className="chip-lens-outer"></span>
        <span className="chip-lens-glass"></span>
        <span className="chip-lens-iris"></span>
        <span className="chip-lens-glint"></span>
      </>
    );
  }

  if (variant === "connector") {
    return (
      <>
        <span className="chip-flex-body"></span>
        <span className="chip-flex-pins"></span>
        <span className="chip-flex-tip"></span>
      </>
    );
  }

  if (variant === "capacitor") {
    return (
      <>
        <span className="chip-cap-body"></span>
        <span className="chip-cap-band"></span>
      </>
    );
  }

  if (variant === "resistor") {
    return (
      <>
        <span className="chip-res-body"></span>
        <span className="chip-res-band b1"></span>
        <span className="chip-res-band b2"></span>
        <span className="chip-res-band b3"></span>
      </>
    );
  }

  return (
    <>
      <span className="chip-ic-body"></span>
      <span className="chip-ic-mark"></span>
    </>
  );
}
const WHEEL_DEADZONE = 4;
const WHEEL_GESTURE_SETTLE_MS = 320;
const ABOUT_PANEL_INDEX = 1;
const EXPERIENCE_PANEL_INDEX = 2;
const ABOUT_TO_EXPERIENCE_SCROLL_MS = 280;
const SCROLL_DEBUG_QUERY_PARAM = "debugScroll";
const SCROLL_DEBUG_MAX_ENTRIES = 400;

function App() {
  useEffect(() => {
    const deck = document.querySelector("#deck");
    const dotElements = Array.from(document.querySelectorAll(".dot"));
    const panels = Array.from(document.querySelectorAll(".panel"));
    const tiltCards = Array.from(document.querySelectorAll("[data-tilt-card]"));
    const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    const phoneStageEl = document.querySelector(".phone-stage");
    const rootEl = document.documentElement;
    const searchParams = new URLSearchParams(window.location.search);
    const isScrollDebugEnabled =
      searchParams.get(SCROLL_DEBUG_QUERY_PARAM) === "1" ||
      window.localStorage.getItem(SCROLL_DEBUG_QUERY_PARAM) === "1";

    const isDesktop = () => window.matchMedia("(min-width: 981px)").matches;
    let isWheelGestureConsumed = false;
    let wheelGestureUnlockTimerId = null;
    let lastActiveIndex = -1;
    let isPhoneStageHidden = false;
    let logSequence = 0;
    const scrollDebugEntries = [];

    const pushScrollDebugLog = (eventType, details = {}) => {
      if (!isScrollDebugEnabled) return;

      logSequence += 1;
      const entry = {
        seq: logSequence,
        ts: new Date().toISOString(),
        eventType,
        ...details,
      };

      scrollDebugEntries.push(entry);
      if (scrollDebugEntries.length > SCROLL_DEBUG_MAX_ENTRIES) {
        scrollDebugEntries.shift();
      }

      console.log("[scroll-debug]", entry);
    };

    if (isScrollDebugEnabled) {
      window.__scrollDebug = {
        getLogs: () => [...scrollDebugEntries],
        clearLogs: () => {
          scrollDebugEntries.length = 0;
          logSequence = 0;
          console.log("[scroll-debug] logs cleared");
        },
        status: () => ({
          enabled: true,
          isWheelGestureConsumed,
          activePanelIndex: lastActiveIndex,
          logCount: scrollDebugEntries.length,
        }),
      };

      pushScrollDebugLog("debug-enabled", {
        queryParam: SCROLL_DEBUG_QUERY_PARAM,
        isDesktop: isDesktop(),
      });
    }

    const resetWheelGestureTimer = () => {
      if (wheelGestureUnlockTimerId) {
        window.clearTimeout(wheelGestureUnlockTimerId);
        pushScrollDebugLog("gesture-timer-reset", { reason: "existing-timer-cleared" });
      }

      wheelGestureUnlockTimerId = window.setTimeout(() => {
        isWheelGestureConsumed = false;
        wheelGestureUnlockTimerId = null;
        pushScrollDebugLog("gesture-unlocked");
      }, WHEEL_GESTURE_SETTLE_MS);
    };

    const getActivePanelIndex = () => {
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
    };

    let scrollAnimationFrameId = null;
    let fastTransitionClearTimerId = null;

    const clearFastAboutExperienceTransition = () => {
      rootEl?.classList.remove("is-fast-about-experience");
      if (fastTransitionClearTimerId) {
        window.clearTimeout(fastTransitionClearTimerId);
        fastTransitionClearTimerId = null;
      }
    };

    const animateScrollTo = (targetLeft, durationMs) => {
      if (!deck) return;

      if (scrollAnimationFrameId) {
        window.cancelAnimationFrame(scrollAnimationFrameId);
        scrollAnimationFrameId = null;
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
          scrollAnimationFrameId = window.requestAnimationFrame(step);
          return;
        }
        scrollAnimationFrameId = null;
        deck.scrollLeft = targetLeft;
      };

      scrollAnimationFrameId = window.requestAnimationFrame(step);
    };

    const scrollToPanel = (index) => {
      if (!deck || panels.length === 0) return;

      const safeIndex = Math.max(0, Math.min(index, panels.length - 1));
      const fromIndex = getActivePanelIndex();
      const isAboutToExperience =
        fromIndex === ABOUT_PANEL_INDEX && safeIndex === EXPERIENCE_PANEL_INDEX;
      const targetLeft = panels[safeIndex].offsetLeft;

      pushScrollDebugLog("scroll-to-panel", {
        requestedIndex: index,
        safeIndex,
        fromIndex,
        isAboutToExperience,
        left: targetLeft,
      });

      if (isAboutToExperience) {
        rootEl?.classList.add("is-fast-about-experience");
        if (fastTransitionClearTimerId) {
          window.clearTimeout(fastTransitionClearTimerId);
        }
        fastTransitionClearTimerId = window.setTimeout(() => {
          clearFastAboutExperienceTransition();
        }, ABOUT_TO_EXPERIENCE_SCROLL_MS + 80);
        animateScrollTo(targetLeft, ABOUT_TO_EXPERIENCE_SCROLL_MS);
        return;
      }

      clearFastAboutExperienceTransition();
      if (scrollAnimationFrameId) {
        window.cancelAnimationFrame(scrollAnimationFrameId);
        scrollAnimationFrameId = null;
      }
      deck.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
    };

    const updateHeroPhoneTransition = () => {
      if (!rootEl || !deck || !phoneStageEl || !isDesktop()) {
        rootEl?.style.setProperty("--hero-about-progress", "0");
        rootEl?.style.setProperty("--about-experience-progress", "0");
        phoneStageEl?.classList.remove("is-hidden");
        isPhoneStageHidden = false;
        return;
      }

      const viewportWidth = deck.clientWidth || window.innerWidth || 1;
      const rawProgress = deck.scrollLeft / viewportWidth;
      const progress = Math.max(0, Math.min(3.4, rawProgress));
      const heroAboutProgress = Math.max(0, Math.min(1, progress));
      const aboutExperienceProgress = Math.max(0, Math.min(1, progress - 1));
      rootEl.style.setProperty("--hero-about-progress", heroAboutProgress.toFixed(3));
      rootEl.style.setProperty("--about-experience-progress", aboutExperienceProgress.toFixed(3));

      const shouldHidePhoneStage = progress > 2.08;
      if (shouldHidePhoneStage !== isPhoneStageHidden) {
        phoneStageEl.classList.toggle("is-hidden", shouldHidePhoneStage);
        isPhoneStageHidden = shouldHidePhoneStage;
        pushScrollDebugLog("phone-stage-visibility", {
          visible: !shouldHidePhoneStage,
          progress,
        });
      }
    };

    const syncActiveDot = () => {
      updateHeroPhoneTransition();
      if (!deck || dotElements.length === 0 || panels.length === 0 || !isDesktop()) {
        return;
      }

      const activeIndex = getActivePanelIndex();
      if (activeIndex !== lastActiveIndex) {
        pushScrollDebugLog("active-panel-changed", {
          previousIndex: lastActiveIndex,
          activeIndex,
          scrollLeft: deck?.scrollLeft ?? null,
        });
        lastActiveIndex = activeIndex;
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
        pushScrollDebugLog("wheel-ignored-deadzone", {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          dominantDelta,
        });
        return;
      }

      event.preventDefault();
      pushScrollDebugLog("wheel-received", {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        dominantDelta,
        consumed: isWheelGestureConsumed,
      });

      if (isWheelGestureConsumed) {
        resetWheelGestureTimer();
        pushScrollDebugLog("wheel-ignored-consumed", {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          dominantDelta,
        });
        return;
      }

      isWheelGestureConsumed = true;
      resetWheelGestureTimer();

      const activeIndex = getActivePanelIndex();
      const direction = dominantDelta > 0 ? 1 : -1;
      const targetIndex = activeIndex + direction;
      pushScrollDebugLog("wheel-accepted", {
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
      const activeIndex = getActivePanelIndex();
      const targetIndex = activeIndex + direction;
      pushScrollDebugLog("keyboard-nav", {
        key: event.key,
        activeIndex,
        targetIndex,
      });
      scrollToPanel(targetIndex);
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
    pushScrollDebugLog("mounted", {
      activePanelIndex: getActivePanelIndex(),
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

      if (scrollAnimationFrameId) {
        window.cancelAnimationFrame(scrollAnimationFrameId);
      }

      clearFastAboutExperienceTransition();

      if (window.__scrollDebug) {
        delete window.__scrollDebug;
      }

      rootEl?.style.setProperty("--hero-about-progress", "0");
      rootEl?.style.setProperty("--about-experience-progress", "0");
    };
  }, []);

  return (
    <>
      <div className="noise"></div>

      <header className="topbar">
        <a className="brand" href="#hero">
          ST
        </a>
        <nav className="topbar-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button button-ghost" href="mailto:tarmimhoqueshuvo@gmail.com">
          Hire Me
        </a>
      </header>

      <div className="phone-stage" aria-hidden="true">
        <div className="phone-model">
          <div className="chip-cloud">
            {CHIP_PARTS.map((part) => (
              <span
                key={part.id}
                className={`chip-fragment ${part.id} ${part.kind} is-${part.variant}`}
              >
                <ChipPartInner variant={part.variant} />
              </span>
            ))}
          </div>
          <div className="phone-screen">
            <div className="phone-notch">
              <span className="phone-camera"></span>
              <span className="phone-speaker"></span>
            </div>

            <div className="phone-screen-content">
              <div className="phone-layer phone-layer-circuit">
                <div className="phone-circuit-scene">
                  <svg
                    className="processor-svg"
                    viewBox="0 0 200 240"
                    fill="none"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <defs>
                      <filter
                        id="processorGlow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur stdDeviation="1.6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter
                        id="processorBloom"
                        x="-80%"
                        y="-80%"
                        width="260%"
                        height="260%"
                      >
                        <feGaussianBlur stdDeviation="3.2" result="bloom" />
                        <feMerge>
                          <feMergeNode in="bloom" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <g
                      className="processor-traces"
                      stroke="#3de8ff"
                      strokeWidth="1.2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      filter="url(#processorGlow)"
                    >
                      {/* Top — from pins at 85.6, 92.6, 100, 107.4, 114.4 */}
                      <path d="M85.6 105.2 V82 H68 V54" />
                      <path d="M92.6 105.2 V74 H80 V38" />
                      <path d="M100 105.2 V48" />
                      <path d="M107.4 105.2 V74 H120 V38" />
                      <path d="M114.4 105.2 V82 H132 V54" />
                      <path d="M85.6 105.2 V90 H54 V70 H36" />
                      <path d="M114.4 105.2 V90 H146 V70 H164" />

                      {/* Bottom — from pins at 85.6, 92.6, 100, 107.4, 114.4 */}
                      <path d="M85.6 150.8 V174 H68 V202" />
                      <path d="M92.6 150.8 V182 H80 V218" />
                      <path d="M100 150.8 V208" />
                      <path d="M107.4 150.8 V182 H120 V218" />
                      <path d="M114.4 150.8 V174 H132 V202" />
                      <path d="M85.6 150.8 V166 H54 V186 H36" />
                      <path d="M114.4 150.8 V166 H146 V186 H164" />

                      {/* Left — from pins at 115.6, 122.6, 128, 135.4 */}
                      <path d="M77.2 115.6 H54 V96 H30" />
                      <path d="M77.2 122.6 H48 V112 H20" />
                      <path d="M77.2 128 H42" />
                      <path d="M77.2 135.4 H48 V144 H20" />
                      <path d="M77.2 140.4 H54 V160 H30" />

                      {/* Right — from pins at 115.6, 122.6, 128, 135.4 */}
                      <path d="M122.8 115.6 H146 V96 H170" />
                      <path d="M122.8 122.6 H152 V112 H180" />
                      <path d="M122.8 128 H158" />
                      <path d="M122.8 135.4 H152 V144 H180" />
                      <path d="M122.8 140.4 H146 V160 H170" />
                    </g>

                    <g
                      className="processor-nodes"
                      fill="none"
                      stroke="#3de8ff"
                      strokeWidth="1.25"
                      filter="url(#processorGlow)"
                    >
                      {/* Top nodes */}
                      <circle cx="68" cy="54" r="2.35" />
                      <circle cx="80" cy="38" r="2.35" />
                      <circle cx="100" cy="48" r="2.35" />
                      <circle cx="120" cy="38" r="2.35" />
                      <circle cx="132" cy="54" r="2.35" />
                      <circle cx="36" cy="70" r="2.35" />
                      <circle cx="164" cy="70" r="2.35" />

                      {/* Bottom nodes */}
                      <circle cx="68" cy="202" r="2.35" />
                      <circle cx="80" cy="218" r="2.35" />
                      <circle cx="100" cy="208" r="2.35" />
                      <circle cx="120" cy="218" r="2.35" />
                      <circle cx="132" cy="202" r="2.35" />
                      <circle cx="36" cy="186" r="2.35" />
                      <circle cx="164" cy="186" r="2.35" />

                      {/* Left nodes */}
                      <circle cx="30" cy="96" r="2.35" />
                      <circle cx="20" cy="112" r="2.35" />
                      <circle cx="42" cy="128" r="2.35" />
                      <circle cx="20" cy="144" r="2.35" />
                      <circle cx="30" cy="160" r="2.35" />

                      {/* Right nodes */}
                      <circle cx="170" cy="96" r="2.35" />
                      <circle cx="180" cy="112" r="2.35" />
                      <circle cx="158" cy="128" r="2.35" />
                      <circle cx="180" cy="144" r="2.35" />
                      <circle cx="170" cy="160" r="2.35" />
                    </g>

                    <g className="processor-core" filter="url(#processorBloom)">
                      <rect
                        x="80"
                        y="108"
                        width="40"
                        height="40"
                        rx="3.2"
                        fill="#05080f"
                        stroke="#3de8ff"
                        strokeWidth="2.6"
                      />
                      <g fill="#3de8ff">
                        {/* Top pins */}
                        <rect x="84" y="105.2" width="3.2" height="2.8" rx="0.35" />
                        <rect x="91" y="105.2" width="3.2" height="2.8" rx="0.35" />
                        <rect x="98.4" y="105.2" width="3.2" height="2.8" rx="0.35" />
                        <rect x="105.8" y="105.2" width="3.2" height="2.8" rx="0.35" />
                        <rect x="112.8" y="105.2" width="3.2" height="2.8" rx="0.35" />
                        {/* Bottom pins */}
                        <rect x="84" y="148" width="3.2" height="2.8" rx="0.35" />
                        <rect x="91" y="148" width="3.2" height="2.8" rx="0.35" />
                        <rect x="98.4" y="148" width="3.2" height="2.8" rx="0.35" />
                        <rect x="105.8" y="148" width="3.2" height="2.8" rx="0.35" />
                        <rect x="112.8" y="148" width="3.2" height="2.8" rx="0.35" />
                        {/* Left pins */}
                        <rect x="77.2" y="114" width="2.8" height="3.2" rx="0.35" />
                        <rect x="77.2" y="121" width="2.8" height="3.2" rx="0.35" />
                        <rect x="77.2" y="126.4" width="2.8" height="3.2" rx="0.35" />
                        <rect x="77.2" y="133.8" width="2.8" height="3.2" rx="0.35" />
                        <rect x="77.2" y="138.8" width="2.8" height="3.2" rx="0.35" />
                        {/* Right pins */}
                        <rect x="120" y="114" width="2.8" height="3.2" rx="0.35" />
                        <rect x="120" y="121" width="2.8" height="3.2" rx="0.35" />
                        <rect x="120" y="126.4" width="2.8" height="3.2" rx="0.35" />
                        <rect x="120" y="133.8" width="2.8" height="3.2" rx="0.35" />
                        <rect x="120" y="138.8" width="2.8" height="3.2" rx="0.35" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="phone-layer phone-layer-about-composite">
                <div className="phone-top"></div>
                <div className="phone-bars">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="phone-text">React Native, shipped fast</div>
                <div className="phone-hero-highlight">
                  <div className="phone-react-badge" aria-hidden="true">
                    <svg
                      className="phone-react-logo"
                      viewBox="-11.5 -10.5 23 21"
                      role="presentation"
                    >
                      <ellipse rx="11" ry="4.2"></ellipse>
                      <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
                      <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
                      <circle r="1.7"></circle>
                    </svg>
                  </div>
                  <div className="phone-hero-copy">
                    <p className="phone-hero-title">Think twice, code once</p>
                    <p className="phone-hero-subtext">
                      It is 10% coding and 90% asking why it works on Android but breaks on
                      iOS !!
                    </p>
                  </div>
                </div>
              </div>

              <div className="phone-layer phone-layer-experience">
                <p className="phone-experience-tag">Experience</p>
                <h4>{EXPERIENCE_TITLE}</h4>
                <div className="phone-experience-timeline">
                  {EXPERIENCE_ITEMS.map((item) => (
                    <article key={item.time} className="phone-experience-card">
                      <p className="phone-experience-time">{item.time}</p>
                      <h5>{item.title}</h5>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="phone-gesture-bar"></div>
            <div className="phone-glow"></div>
          </div>
        </div>
      </div>

      <main id="deck" className="deck" aria-live="polite">
        <section id="hero" className="panel">
          <div className="panel-content hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">Lead Mobile App Developer</p>
              <h1>Sadi Md Tarmim Hoque</h1>
              <p className="lead">
                I build fast, scalable mobile apps and websites with JavaScript—mostly powered by
                React Native. I enjoy turning "that sounds complicated" into "wow, that just
                works."
              </p>
              <div className="hero-meta">
                <span>Dhaka, Bangladesh</span>
                <span>9+ years in software</span>
                <span>1000+ LinkedIn followers</span>
              </div>
              <div className="hero-actions">
                <a className="button button-solid" href="#projects">
                  Explore Work
                </a>
                <a
                  className="button button-ghost"
                  href="https://www.linkedin.com/in/sadi-md-tarmim-hoque-6b3b4179/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="hero-phone-space" aria-hidden="true"></div>
          </div>
        </section>

        <section id="about" className="panel">
          <div className="panel-content about-layout">
            <div className="about-copy">
              <p className="eyebrow">About</p>
              <h2>{ABOUT_TITLE}</h2>
              <p className="section-lead">{ABOUT_LEAD}</p>
              <div className="about-grid">
                <article className="card">
                  <h3>What I Do</h3>
                  <ul>
                    {ABOUT_WHAT_I_DO_ITEMS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <article className="card">
                  <h3>Core Stack</h3>
                  <div className="skills">
                    {CORE_STACK_ITEMS.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
            <div className="about-phone-space" aria-hidden="true"></div>
          </div>
        </section>

        <section id="experience" className="panel">
          <div className="panel-content experience-panel-content">
            <div className="experience-phone-space" aria-hidden="true"></div>
            <div className="experience-mobile-fallback">
              <p className="eyebrow">Experience</p>
              <h2>{EXPERIENCE_TITLE}</h2>
              <div className="timeline">
                {EXPERIENCE_ITEMS.map((item) => (
                  <article key={item.time} className="timeline-item card">
                    <p className="time">{item.time}</p>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="panel">
          <div className="panel-content">
            <p className="eyebrow">Selected Work</p>
            <h2>Apps and platforms that shipped</h2>
            <div className="project-row">
              <article className="project card" data-tilt-card>
                <h3>Convay</h3>
                <p>Webinar and meeting solution with WebRTC and Matrix-backed realtime flows.</p>
                <div className="chip-group">
                  <span>React Native</span>
                  <span>WebRTC</span>
                  <span>Matrix</span>
                </div>
              </article>
              <article className="project card" data-tilt-card>
                <h3>Skootel / Benji / HFX E-Scooters</h3>
                <p>
                  Ride-sharing apps with geo features, support modules, and production releases.
                </p>
                <div className="chip-group">
                  <span>React Native</span>
                  <span>Redux</span>
                  <span>Google Maps</span>
                </div>
              </article>
              <article className="project card" data-tilt-card>
                <h3>magnusai-chatbot-react-native</h3>
                <p>Reusable React Native chatbot library published for integration flexibility.</p>
                <div className="chip-group">
                  <span>NPM Package</span>
                  <span>React Native</span>
                  <span>SDK Thinking</span>
                </div>
              </article>
              <article className="project card" data-tilt-card>
                <h3>Imagine Radio</h3>
                <p>Streaming platform across Android, iOS, and web player experiences.</p>
                <div className="chip-group">
                  <span>React Native</span>
                  <span>React.js</span>
                  <span>MobX</span>
                </div>
              </article>
              <article className="project card" data-tilt-card>
                <h3>Pipra Store / Jirabo / Express Ticket</h3>
                <p>
                  Commerce and ticketing apps with checkout, search, and scalable frontend
                  patterns.
                </p>
                <div className="chip-group">
                  <span>React Native</span>
                  <span>Node.js</span>
                  <span>E-commerce</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="panel">
          <div className="panel-content contact-layout">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Let&apos;s build the next mobile product</h2>
              <p className="section-lead">
                Available for leadership, product engineering, and high-impact mobile projects.
              </p>
              <div className="contact-list">
                <a href="mailto:tarmimhoqueshuvo@gmail.com">tarmimhoqueshuvo@gmail.com</a>
                <a href="tel:+8801673552194">+8801673552194</a>
                <a href="https://github.com/shuvo0074" target="_blank" rel="noreferrer">
                  github.com/shuvo0074
                </a>
                <a
                  href="https://www.linkedin.com/in/sadi-md-tarmim-hoque-6b3b4179/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/sadi-md-tarmim-hoque-6b3b4179
                </a>
              </div>
            </div>
            <div className="contact-card card" data-tilt-card>
              <p className="quote">
                &quot;Enthusiastic in coding, eager to learn, and committed to shipping quality
                experiences.&quot;
              </p>
              <p className="signature">— Sadi Md Tarmim Hoque</p>
            </div>
          </div>
        </section>
      </main>

      <div className="dots" aria-hidden="true">
        {dots.map((dot, index) => (
          <a key={dot} href={dot} className={`dot ${index === 0 ? "is-active" : ""}`}></a>
        ))}
      </div>
    </>
  );
}

export default App;
