import { memo } from "react";
import { CHIP_PARTS } from "../../data/portfolio";
import { ChipPart } from "./ChipPart";

function ChipCloudComponent() {
  return (
    <div className="chip-cloud">
      {CHIP_PARTS.map((part) => (
        <ChipPart key={part.id} id={part.id} kind={part.kind} variant={part.variant} />
      ))}
    </div>
  );
}

export const ChipCloud = memo(ChipCloudComponent);
