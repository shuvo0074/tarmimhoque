// PhoneScreens: the HTML screen content projected onto the 3D phone glass.
// Portrait: circuit → About. Landscape: Experience grid.
// Views: web only (inside PhoneScene, positioned every frame by PhoneRig).
import { memo } from "react";
import { PhoneAboutLayer } from "../phone/PhoneAboutLayer";
import { PhoneExperienceLayer } from "../phone/PhoneExperienceLayer";
import { ProcessorSvg } from "../phone/ProcessorSvg";
import { SCREEN } from "./geometry";

export const PORTRAIT_PX_PER_UNIT = 300 / SCREEN.width;
export const LANDSCAPE_PX_PER_UNIT = 1060 / SCREEN.height;

function PhoneScreensComponent({ screenRefs }) {
  const { viewRef, cameraRef, portraitRef, landscapeRef } = screenRefs;

  return (
    <div className="phone3d-view" ref={viewRef}>
      <div className="phone3d-camera" ref={cameraRef}>
        <div className="phone3d-anchor" ref={portraitRef}>
          <div className="phone3d-screen is-portrait">
            <div className="phone3d-screen-content">
              <div className="phone-layer phone-layer-circuit">
                <div className="phone-circuit-scene">
                  <ProcessorSvg />
                </div>
              </div>
              <PhoneAboutLayer />
            </div>
            <div className="phone-gesture-bar"></div>
            <div className="phone-glow"></div>
          </div>
        </div>

        <div className="phone3d-anchor" ref={landscapeRef}>
          <div className="phone3d-screen is-landscape">
            <PhoneExperienceLayer />
            <div className="phone-glow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PhoneScreens = memo(PhoneScreensComponent);
