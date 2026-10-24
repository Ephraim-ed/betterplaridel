import { Rectangle, type BarShapeProps } from "recharts";

// Paints each bar with its data row's `fill` (Recharts' replacement for the deprecated <Cell>).
export function FilledBar(props: BarShapeProps) {
  const { fill } = props.payload as { fill?: string };
  return <Rectangle {...props} fill={fill ?? props.fill} />;
}
