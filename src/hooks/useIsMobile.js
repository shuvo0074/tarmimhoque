// Viewport hook: true when the mobile (vertical) layout is active.
// Views: used to branch web vs mobile rendering.
import { useSyncExternalStore } from "react";
import { DESKTOP_MEDIA_QUERY } from "../constants/scroll";

function subscribe(onStoreChange) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return !window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
