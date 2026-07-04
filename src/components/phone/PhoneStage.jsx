// PhoneStage: fixed 3D phone shell that animates across Hero → About → Experience.
// Views: web only.
import { forwardRef, memo } from "react";
import { ChipCloud } from "./ChipCloud";
import { PhoneAboutLayer } from "./PhoneAboutLayer";
import { PhoneExperienceLayer } from "./PhoneExperienceLayer";
import { ProcessorSvg } from "./ProcessorSvg";

const PhoneStageComponent = forwardRef(function PhoneStageComponent(_, ref) {
  return (
    <div className="phone-stage" aria-hidden="true" ref={ref}>
      <div className="phone-model">
        <ChipCloud />
        <div className="phone-screen">
          <div className="phone-notch">
            <span className="phone-camera"></span>
            <span className="phone-speaker"></span>
          </div>

          <div className="phone-screen-content">
            <div className="phone-layer phone-layer-circuit">
              <div className="phone-circuit-scene">
                <ProcessorSvg />
              </div>
            </div>
            <PhoneAboutLayer />
            <PhoneExperienceLayer />
          </div>

          <div className="phone-gesture-bar"></div>
          <div className="phone-glow"></div>
        </div>
      </div>
    </div>
  );
});

export const PhoneStage = memo(PhoneStageComponent);
