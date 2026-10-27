// A faint banig weave: strips plaited over and under in a checkerboard, each with fibre lines along it, turned 45°
// like a woven mat. It's decoration only.

const CELL = 12;

// One woven segment: its outline plus two fibre lines running the way the strip runs.
function Segment({ x, y, across }: { x: number; y: number; across: boolean }) {
  const fibres = [CELL * 0.38, CELL * 0.62];
  return (
    <g>
      <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={1.5} />
      {fibres.map((f) =>
        across ? (
          <line key={f} x1={x + 2.5} y1={y + f} x2={x + CELL - 2.5} y2={y + f} />
        ) : (
          <line key={f} x1={x + f} y1={y + 2.5} x2={x + f} y2={y + CELL - 2.5} />
        ),
      )}
    </g>
  );
}

export function BanigTexture({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className}>
      <defs>
        <pattern
          id="banig-weave"
          width={CELL * 2}
          height={CELL * 2}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45) scale(2.6)"
        >
          <g fill="none" stroke="currentColor" strokeWidth={0.45}>
            <Segment x={0} y={0} across />
            <Segment x={CELL} y={0} across={false} />
            <Segment x={0} y={CELL} across={false} />
            <Segment x={CELL} y={CELL} across />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#banig-weave)" />
    </svg>
  );
}
