// ChipPart: one realistic hardware fragment (camera, battery, PCB, etc.).
// Views: web only (inside PhoneStage).
import { memo } from "react";

const VARIANT_MARKUP = {
  camera: (
    <>
      <span className="chip-cam-body"></span>
      <span className="chip-cam-lens chip-cam-lens-lg"></span>
      <span className="chip-cam-lens chip-cam-lens-sm"></span>
      <span className="chip-cam-flash"></span>
      <span className="chip-cam-mic"></span>
    </>
  ),
  board: (
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
  ),
  battery: (
    <>
      <span className="chip-batt-cell"></span>
      <span className="chip-batt-label"></span>
      <span className="chip-batt-tab"></span>
      <span className="chip-batt-stripe"></span>
    </>
  ),
  screen: (
    <>
      <span className="chip-screen-glass"></span>
      <span className="chip-screen-notch"></span>
      <span className="chip-screen-shine"></span>
    </>
  ),
  core: (
    <>
      <span className="chip-die"></span>
      <span className="chip-die-mark"></span>
      <span className="chip-pin-row top"></span>
      <span className="chip-pin-row bottom"></span>
      <span className="chip-pin-row left"></span>
      <span className="chip-pin-row right"></span>
    </>
  ),
  lens: (
    <>
      <span className="chip-lens-outer"></span>
      <span className="chip-lens-glass"></span>
      <span className="chip-lens-iris"></span>
      <span className="chip-lens-glint"></span>
    </>
  ),
  connector: (
    <>
      <span className="chip-flex-body"></span>
      <span className="chip-flex-pins"></span>
      <span className="chip-flex-tip"></span>
    </>
  ),
  capacitor: (
    <>
      <span className="chip-cap-body"></span>
      <span className="chip-cap-band"></span>
    </>
  ),
  resistor: (
    <>
      <span className="chip-res-body"></span>
      <span className="chip-res-band b1"></span>
      <span className="chip-res-band b2"></span>
      <span className="chip-res-band b3"></span>
    </>
  ),
  ic: (
    <>
      <span className="chip-ic-body"></span>
      <span className="chip-ic-mark"></span>
    </>
  ),
};

function ChipPartComponent({ id, kind, variant }) {
  return (
    <span className={`chip-fragment ${id} ${kind} is-${variant}`}>
      {VARIANT_MARKUP[variant] ?? VARIANT_MARKUP.ic}
    </span>
  );
}

export const ChipPart = memo(ChipPartComponent);
