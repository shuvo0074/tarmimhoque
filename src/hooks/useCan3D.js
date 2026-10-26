// 3D capability hook: true when the WebGL phone scene should replace the CSS phone.
// Views: web only (mobile keeps the lightweight vertical layout).
import { useIsMobile } from "./useIsMobile";

let webglSupport = null;

function supportsWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

export function useCan3D() {
  const isMobile = useIsMobile();
  return !isMobile && supportsWebGL();
}
