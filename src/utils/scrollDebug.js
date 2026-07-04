// Optional scroll logger: records wheel/panel events when debugScroll=1.
// Views: web (horizontal deck debugging).
import { SCROLL_DEBUG_MAX_ENTRIES, SCROLL_DEBUG_QUERY_PARAM } from "../constants/scroll";

export function createScrollDebug() {
  const searchParams = new URLSearchParams(window.location.search);
  const enabled =
    searchParams.get(SCROLL_DEBUG_QUERY_PARAM) === "1" ||
    window.localStorage.getItem(SCROLL_DEBUG_QUERY_PARAM) === "1";

  let logSequence = 0;
  const entries = [];
  let statusProvider = () => ({});

  const push = (eventType, details = {}) => {
    if (!enabled) return;

    logSequence += 1;
    const entry = {
      seq: logSequence,
      ts: new Date().toISOString(),
      eventType,
      ...details,
    };

    entries.push(entry);
    if (entries.length > SCROLL_DEBUG_MAX_ENTRIES) {
      entries.shift();
    }

    console.log("[scroll-debug]", entry);
  };

  const attach = (getStatus) => {
    if (!enabled) return;

    statusProvider = getStatus;
    window.__scrollDebug = {
      getLogs: () => [...entries],
      clearLogs: () => {
        entries.length = 0;
        logSequence = 0;
        console.log("[scroll-debug] logs cleared");
      },
      status: () => ({
        enabled: true,
        logCount: entries.length,
        ...statusProvider(),
      }),
    };
  };

  const detach = () => {
    if (window.__scrollDebug) {
      delete window.__scrollDebug;
    }
  };

  return { enabled, push, attach, detach };
}
