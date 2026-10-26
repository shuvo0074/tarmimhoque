// ChipCloud: scattered phone hardware fragments that reassemble on About.
// Views: web only (inside PhoneStage).
import { memo } from "react";
import { CHIP_PARTS } from "../../data/portfolio";
import { ChipPart } from "./ChipPart";

function ChipCloudComponent() {
  return (
    <div className="chip-cloud">
      {CHIP_PARTS.map((part, index) => (
        <ChipPart
          key={part.id}
          id={part.id}
          kind={part.kind}
          variant={part.variant}
          delay={(index / CHIP_PARTS.length) * 0.3}
        />
      ))}
    </div>
  );
}

export const ChipCloud = memo(ChipCloudComponent);
