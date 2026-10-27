import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { cn } from "cn";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { densityBreaks, densityClass, densityInk, densityRamp, mapInk } from "../colors";
import { barangays, density, fmt, LATEST, type Barangay } from "../demographics-data";
import { barangayShapes, LABEL_SIZE, MAP_SIZE } from "../map-data";

// Each shape's bounding box, parsed from its path (paths use absolute M/L/Z commands only).
const bounds = Object.fromEntries(
  Object.entries(barangayShapes).map(([psgc, { d }]) => {
    const n = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const xs = n.filter((_, i) => i % 2 === 0);
    const ys = n.filter((_, i) => i % 2 === 1);
    return [psgc, { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }];
  }),
);

// Zoom that frames a barangay in the middle of the map, as a transform in the map's own units.
const MAX_ZOOM = 2.6;
const FILL = 0.6;
function zoomOn(b?: Barangay) {
  if (!b) return { k: 1, x: 0, y: 0 };
  const { x0, x1, y0, y1 } = bounds[b.psgc];
  const k = Math.max(1, Math.min(MAX_ZOOM, (FILL * MAP_SIZE.width) / (x1 - x0), (FILL * MAP_SIZE.height) / (y1 - y0)));
  const x = MAP_SIZE.width / 2 - (k * (x0 + x1)) / 2;
  const y = MAP_SIZE.height / 2 - (k * (y0 + y1)) / 2;
  return { k, x, y };
}

const shadeOf = (b: Barangay) => densityClass(density(b.population[LATEST], b.areaKm2));

const legend = densityRamp.map((color, i) => {
  const lo = densityBreaks[i - 1];
  const hi = densityBreaks[i];
  const label = lo === undefined ? `Under ${fmt.number(hi)}` : hi === undefined ? `${fmt.number(lo)}+` : `${fmt.number(lo)}–${fmt.number(hi - 1)}`;
  return { color, label };
});

export function BarangayMap({
  selected,
  onSelect,
  className = "",
}: {
  selected?: Barangay;
  onSelect: (b?: Barangay) => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState<Barangay>();
  const zoom = zoomOn(selected);

  // Clicking the selected barangay again goes back to the whole town.
  const toggle = (b: Barangay) => onSelect(selected === b ? undefined : b);
  const onKeyDown = (b: Barangay) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(b);
    }
  };

  return (
    <Card size="sm" className={cn("min-h-0 overflow-visible ring-0", className)}>
      <CardHeader>
        <CardTitle>Geography</CardTitle>
        {selected && (
          <CardAction>
            <button
              type="button"
              onClick={() => onSelect(undefined)}
              className="animate-in fade-in-0 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-brand transition-colors hover:bg-muted"
            >
              Reset view
            </button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        {/* On desktop the map scales to fit both the width and the height of its slot. */}
        <div className="flex min-h-0 flex-1 items-center justify-center lg:[container-type:size]">
          <div
            className="relative w-full lg:w-[min(100cqw,calc(100cqh*var(--map-ratio)))]"
            style={{ "--map-ratio": MAP_SIZE.width / MAP_SIZE.height } as CSSProperties}
          >
            <div className="overflow-hidden rounded-lg">
            <svg
              viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
              role="group"
              aria-label="Map of Plaridel's barangays. Select a barangay to see its numbers."
              className="block h-auto w-full"
            >
              <g
                style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.k})` }}
                className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              >
              {barangays.map((b, i) => (
                <path
                  key={b.psgc}
                  d={barangayShapes[b.psgc].d}
                  fill={densityRamp[shadeOf(b)]}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  opacity={selected && selected !== b ? 0.35 : 1}
                  role="button"
                  tabIndex={0}
                  aria-label={`${b.name}, ${fmt.number(b.population[LATEST])} residents, ${b.urban ? "urban" : "rural"}`}
                  aria-pressed={selected === b}
                  onClick={() => toggle(b)}
                  onKeyDown={onKeyDown(b)}
                  onPointerEnter={() => setHovered(b)}
                  onPointerLeave={() => setHovered(undefined)}
                  onFocus={() => setHovered(b)}
                  onBlur={() => setHovered(undefined)}
                  style={{ animation: `map-shape-in 0.5s ease-out ${i * 25}ms backwards` }}
                  className="cursor-pointer outline-none transition-opacity duration-300 motion-reduce:!animate-none"
                />
              ))}

              {barangays.map((b) => {
                const { center, label } = barangayShapes[b.psgc];
                if (!label) return null;
                // Faded shapes are all light, so their names switch to dark text.
                const faded = selected && selected !== b;
                return (
                  <text
                    key={b.psgc}
                    x={center[0]}
                    y={center[1] - ((label.length - 1) * LABEL_SIZE * 1.1) / 2}
                    fontSize={LABEL_SIZE}
                    fontWeight={500}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={faded ? mapInk : densityInk(shadeOf(b))}
                    opacity={faded ? 0.6 : 1}
                    aria-hidden
                    className="pointer-events-none select-none"
                  >
                    {label.map((line, i) => (
                      <tspan key={line} x={center[0]} dy={i === 0 ? 0 : "1.1em"}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              })}

              {/* Outlines drawn last so they sit above neighboring shapes. */}
              {hovered && hovered !== selected && (
                <path
                  d={barangayShapes[hovered.psgc].d}
                  fill="none"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  className="stroke-brand-yellow"
                />
              )}
              {selected && (
                <path
                  key={selected.psgc}
                  d={barangayShapes[selected.psgc].d}
                  fill="none"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  style={{ animation: "map-outline-in 0.6s ease-out 0.15s backwards" }}
                  className="stroke-brand-yellow motion-reduce:!animate-none"
                />
              )}
              </g>
            </svg>
            </div>

            {hovered && <MapTooltip barangay={hovered} zoom={zoom} />}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Residents per km² (2020, approximate)</p>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {legend.map((l) => (
              <li key={l.label} className="flex items-center gap-1.5">
                <span className="size-3 rounded-[3px]" style={{ backgroundColor: l.color }} />
                {l.label}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Anchored inside the barangay's shape; flips below or sideways near the map's edges.
function MapTooltip({ barangay: b, zoom }: { barangay: Barangay; zoom: ReturnType<typeof zoomOn> }) {
  const [cx, cy] = barangayShapes[b.psgc].center;
  const x = zoom.k * cx + zoom.x;
  const y = zoom.k * cy + zoom.y;
  const left = (x / MAP_SIZE.width) * 100;
  const top = (y / MAP_SIZE.height) * 100;
  const shiftX = left < 25 ? "0%" : left > 75 ? "-100%" : "-50%";
  const shiftY = top < 35 ? "12px" : "calc(-100% - 12px)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 grid min-w-36 gap-0.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
      style={{ left: `${left}%`, top: `${top}%`, transform: `translate(${shiftX}, ${shiftY})` }}
    >
      <p className="font-medium">{b.name}</p>
      <p>
        <span className="font-semibold">{fmt.number(b.population[LATEST])}</span>{" "}
        <span className="text-muted-foreground">residents</span>
      </p>
      <p>
        <span className="font-semibold">≈ {fmt.number(density(b.population[LATEST], b.areaKm2))}</span>{" "}
        <span className="text-muted-foreground">per km² · {b.urban ? "Urban" : "Rural"}</span>
      </p>
    </div>
  );
}
