import type { LabelProps } from "recharts";

type Box = { x?: number; y?: number; width?: number; height?: number };

// LabelList content that centers a row's text inside its stacked segment, and skips it when it wouldn't fit.
// Text is looked up by row because stacked charts hand labels their stacked (not raw) values.
export function segmentLabel(text: (row: number) => string, color: string) {
  return function SegmentLabel({ viewBox, index }: LabelProps) {
    const { x = 0, y = 0, width = 0, height = 0 } = (viewBox ?? {}) as Box;
    const label = text(index ?? 0);
    if (label.length * 7 + 12 > width) return null;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill={color}
        fontSize={12}
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="central"
        pointerEvents="none"
      >
        {label}
      </text>
    );
  };
}
