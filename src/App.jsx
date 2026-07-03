import { useEffect } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const dots = ["#hero", "#about", "#experience", "#projects", "#contact"];
const WHEEL_DEADZONE = 4;
const WHEEL_GESTURE_SETTLE_MS = 320;
const SCROLL_DEBUG_QUERY_PARAM = "debugScroll";
const SCROLL_DEBUG_MAX_ENTRIES = 400;

function App() {
  useEffect(() => {
    const deck = document.querySelector("#deck");
    const dotElements = Array.from(document.querySelectorAll(".dot"));
    const panels = Array.from(document.querySelectorAll(".panel"));
    const tiltCards = Array.from(document.querySelectorAll("[data-tilt-card]"));
    const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    const searchParams = new URLSearchParams(window.location.search);
    const isScrollDebugEnabled =
      searchParams.get(SCROLL_DEBUG_QUERY_PARAM) === "1" ||
      window.localStorage.getItem(SCROLL_DEBUG_QUERY_PARAM) === "1";

    const isDesktop = () => window.matchMedia("(min-width: 981px)").matches;
    let isWheelGestureConsumed = false;
    let wheelGestureUnlockTimerId = null;
    let lastActiveIndex = -1;
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

    const scrollToPanel = (index) => {
      if (!deck || panels.length === 0) return;

      const safeIndex = Math.max(0, Math.min(index, panels.length - 1));
      pushScrollDebugLog("scroll-to-panel", {
        requestedIndex: index,
        safeIndex,
        left: panels[safeIndex].offsetLeft,
      });
      deck.scrollTo({
        left: panels[safeIndex].offsetLeft,
        behavior: "smooth",
      });
    };

    const syncActiveDot = () => {
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
        target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
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

      if (window.__scrollDebug) {
        delete window.__scrollDebug;
      }
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

      <main id="deck" className="deck" aria-live="polite">
        <section id="hero" className="panel">
          <div className="panel-content hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">Lead Mobile App Developer</p>
              <h1>Sadi Md Tarmim Hoque</h1>
              <p className="lead">
                I build fast, scalable, and beautiful cross-platform mobile products with React
                Native, iOS technologies, and modern frontend systems.
              </p>
              <div className="hero-meta">
                <span>Dhaka, Bangladesh</span>
                <span>8+ years in software</span>
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

            <div className="hero-3d-wrap" data-tilt-area>
              <div className="phone-model" data-tilt-card>
                <div className="phone-screen">
                  <div className="phone-top"></div>
                  <div className="phone-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="phone-text">React Native + iOS + CI/CD</div>
                  <div className="phone-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="panel">
          <div className="panel-content">
            <p className="eyebrow">About</p>
            <h2>Product-minded engineer with leadership focus</h2>
            <p className="section-lead">
              At Magnushub I lead mobile development, manage releases, and help teams deliver with
              clean architecture, CI/CD, and reliable app-store shipping.
            </p>

            <div className="about-grid">
              <article className="card">
                <h3>What I Do</h3>
                <ul>
                  <li>Cross-platform app architecture with React Native</li>
                  <li>App Store and Play Store release management</li>
                  <li>Feature planning with clients and engineering teams</li>
                  <li>Realtime communication with WebRTC and Matrix</li>
                </ul>
              </article>
              <article className="card">
                <h3>Core Stack</h3>
                <div className="skills">
                  <span>React Native</span>
                  <span>React.js</span>
                  <span>iOS / SwiftUI</span>
                  <span>GraphQL</span>
                  <span>Node.js</span>
                  <span>Firebase</span>
                  <span>WebRTC</span>
                  <span>CI/CD</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="experience" className="panel">
          <div className="panel-content">
            <p className="eyebrow">Experience</p>
            <h2>Building mobile products across startups and global teams</h2>
            <div className="timeline">
              <article className="timeline-item card" data-tilt-card>
                <p className="time">2021 - Present</p>
                <h3>Lead Mobile App Developer · Magnushub Ltd.</h3>
                <p>
                  Leading React Native app maintenance, release workflows, CI/CD, and team task
                  distribution while translating business requirements into stable product features.
                </p>
              </article>
              <article className="timeline-item card" data-tilt-card>
                <p className="time">2024 - 2025</p>
                <h3>Lead Mobile App Developer (Part-time) · Synesis IT Ltd.</h3>
                <p>
                  Worked on WebRTC, Jitsi Meet, and Matrix integrations in React Native and
                  modified SwiftUI iOS chat modules for production communication use cases.
                </p>
              </article>
              <article className="timeline-item card" data-tilt-card>
                <p className="time">2020 - 2022</p>
                <h3>Lead App Developer · Self Aware Machines Pvt. Ltd.</h3>
                <p>
                  Built meeting-room SDK solutions and web apps using React, GraphQL, Firebase
                  auth, and realtime collaboration technologies for online classroom experiences.
                </p>
              </article>
              <article className="timeline-item card" data-tilt-card>
                <p className="time">2018 - 2021</p>
                <h3>Software Developer / Engineer · Multiple Teams</h3>
                <p>
                  Delivered commerce, media, and event apps with React Native, Redux, MobX,
                  Sentry, and push notifications while maintaining agile team processes.
                </p>
              </article>
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
