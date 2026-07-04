import { memo } from "react";

const TRACE_PATHS = [
  "M85.6 105.2 V82 H68 V54",
  "M92.6 105.2 V74 H80 V38",
  "M100 105.2 V48",
  "M107.4 105.2 V74 H120 V38",
  "M114.4 105.2 V82 H132 V54",
  "M85.6 105.2 V90 H54 V70 H36",
  "M114.4 105.2 V90 H146 V70 H164",
  "M85.6 150.8 V174 H68 V202",
  "M92.6 150.8 V182 H80 V218",
  "M100 150.8 V208",
  "M107.4 150.8 V182 H120 V218",
  "M114.4 150.8 V174 H132 V202",
  "M85.6 150.8 V166 H54 V186 H36",
  "M114.4 150.8 V166 H146 V186 H164",
  "M77.2 115.6 H54 V96 H30",
  "M77.2 122.6 H48 V112 H20",
  "M77.2 128 H42",
  "M77.2 135.4 H48 V144 H20",
  "M77.2 140.4 H54 V160 H30",
  "M122.8 115.6 H146 V96 H170",
  "M122.8 122.6 H152 V112 H180",
  "M122.8 128 H158",
  "M122.8 135.4 H152 V144 H180",
  "M122.8 140.4 H146 V160 H170",
];

const NODE_POINTS = [
  [68, 54],
  [80, 38],
  [100, 48],
  [120, 38],
  [132, 54],
  [36, 70],
  [164, 70],
  [68, 202],
  [80, 218],
  [100, 208],
  [120, 218],
  [132, 202],
  [36, 186],
  [164, 186],
  [30, 96],
  [20, 112],
  [42, 128],
  [20, 144],
  [30, 160],
  [170, 96],
  [180, 112],
  [158, 128],
  [180, 144],
  [170, 160],
];

const PIN_RECTS = [
  [84, 105.2, 3.2, 2.8],
  [91, 105.2, 3.2, 2.8],
  [98.4, 105.2, 3.2, 2.8],
  [105.8, 105.2, 3.2, 2.8],
  [112.8, 105.2, 3.2, 2.8],
  [84, 148, 3.2, 2.8],
  [91, 148, 3.2, 2.8],
  [98.4, 148, 3.2, 2.8],
  [105.8, 148, 3.2, 2.8],
  [112.8, 148, 3.2, 2.8],
  [77.2, 114, 2.8, 3.2],
  [77.2, 121, 2.8, 3.2],
  [77.2, 126.4, 2.8, 3.2],
  [77.2, 133.8, 2.8, 3.2],
  [77.2, 138.8, 2.8, 3.2],
  [120, 114, 2.8, 3.2],
  [120, 121, 2.8, 3.2],
  [120, 126.4, 2.8, 3.2],
  [120, 133.8, 2.8, 3.2],
  [120, 138.8, 2.8, 3.2],
];

function ProcessorSvgComponent() {
  return (
    <svg
      className="processor-svg"
      viewBox="0 0 200 240"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <filter id="processorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="processorBloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.2" result="bloom" />
          <feMerge>
            <feMergeNode in="bloom" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className="processor-traces"
        stroke="#3de8ff"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        filter="url(#processorGlow)"
      >
        {TRACE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g
        className="processor-nodes"
        fill="none"
        stroke="#3de8ff"
        strokeWidth="1.25"
        filter="url(#processorGlow)"
      >
        {NODE_POINTS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.35" />
        ))}
      </g>

      <g className="processor-core" filter="url(#processorBloom)">
        <rect
          x="80"
          y="108"
          width="40"
          height="40"
          rx="3.2"
          fill="#05080f"
          stroke="#3de8ff"
          strokeWidth="2.6"
        />
        <g fill="#3de8ff">
          {PIN_RECTS.map(([x, y, width, height]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} rx="0.35" />
          ))}
        </g>
      </g>
    </svg>
  );
}

export const ProcessorSvg = memo(ProcessorSvgComponent);
