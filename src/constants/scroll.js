// Scroll interaction constants: timing, panel indexes, and debug settings.
// Views: web (horizontal deck); mobile uses normal vertical scroll.
export const WHEEL_DEADZONE = 4;
export const WHEEL_GESTURE_SETTLE_MS = 320;
export const PANEL_SCROLL_MS = 720;
export const PHONE_HIDE_PROGRESS = 3.08;
// The 3D phone has fully faded behind the project phones by here; stop rendering it.
export const SCENE_HIDE_PROGRESS = 2.6;
export const PROJECTS_SLIDER_ACTIVE_PROGRESS = 2.45;
export const MAX_SCROLL_PROGRESS = 4.2;
export const DESKTOP_MEDIA_QUERY = "(min-width: 981px)";
export const SCROLL_DEBUG_QUERY_PARAM = "debugScroll";
export const SCROLL_DEBUG_MAX_ENTRIES = 400;
