// Viewport helper: true when horizontal-deck desktop layout is active.
// Views: used to branch web vs mobile behavior.
import { DESKTOP_MEDIA_QUERY } from "../constants/scroll";

export function isDesktop() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}
