import { DESKTOP_MEDIA_QUERY } from "../constants/scroll";

export function isDesktop() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}
