// A faint "neural network" of dots joined to their near neighbours, drawn once from a fixed seed so it looks the
// same on every visit. It's decoration only.

const WIDTH = 1600;
const HEIGHT = 900;
const COLS = 16;
const ROWS = 9;
const LINK_DISTANCE = 150;

// A small seeded random number generator (mulberry32), so the layout never changes between renders.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One dot per grid cell, nudged randomly within it, spreads the dots evenly without looking like a grid.
const random = seeded(17);
const nodes = Array.from({ length: COLS * ROWS }, (_, i) => {
  const cellW = WIDTH / COLS;
  const cellH = HEIGHT / ROWS;
  return {
    x: ((i % COLS) + 0.15 + random() * 0.7) * cellW,
    y: (Math.floor(i / COLS) + 0.15 + random() * 0.7) * cellH,
    r: 1.5 + random() * 2,
    pulse: random() < 0.12,
  };
});
const links = nodes.flatMap((a, i) =>
  nodes.slice(i + 1).flatMap((b) => {
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    return d < LINK_DISTANCE ? [{ a, b, opacity: 1 - d / LINK_DISTANCE }] : [];
  }),
);

export function NetworkTexture({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <g stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {links.map(({ a, b, opacity }, i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={opacity} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            className={n.pulse ? "animate-pulse motion-reduce:animate-none" : undefined}
            style={n.pulse ? { animationDelay: `${(i % 7) * 0.4}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
