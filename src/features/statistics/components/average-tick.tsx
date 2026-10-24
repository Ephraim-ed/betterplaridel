import type { BarShapeProps } from "recharts";

export const AVERAGE_COLOR = "#334155";

// Bar shape that draws only a tick at the bar's end, used to mark an average on top of the real bar.
// The white halo keeps the tick visible both over the colored bar and over the empty card.
export function averageTick(layout: "columns" | "rows") {
  return function AverageTick({ x, y, width, height }: BarShapeProps) {
    const [x1, y1, x2, y2] =
      layout === "rows" ? [x + width, y - 3, x + width, y + height + 3] : [x - 3, y, x + width + 3, y];
    return (
      <g pointerEvents="none">
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={AVERAGE_COLOR} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  };
}
