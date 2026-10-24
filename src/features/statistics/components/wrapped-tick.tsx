type TickProps = { x?: number | string; y?: number | string; payload?: { value?: string } };

// Category-axis label that wraps two-word names onto two lines so long names fit under narrow columns.
export function WrappedTick({ x, y, payload, selected }: TickProps & { selected?: string }) {
  const name = String(payload?.value ?? "");
  const space = name.lastIndexOf(" ");
  const lines = space > 0 && name.length > 8 ? [name.slice(0, space), name.slice(space + 1)] : [name];
  return (
    <text
      x={Number(x)}
      y={Number(y)}
      textAnchor="middle"
      fontSize={11}
      className={name === selected ? "fill-foreground font-semibold" : "fill-muted-foreground"}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={Number(x)} dy={i === 0 ? 10 : 12}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
