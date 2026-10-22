import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { cn } from "cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { densityBreaks, densityClass, densityInk, densityRamp } from "../colors";
import { barangays, density, fmt, LATEST, type Barangay } from "../data";
import { barangayShapes, LABEL_SIZE, MAP_SIZE } from "../map";

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

  // Clicking the selected barangay again goes back to the whole town.
  const toggle = (b: Barangay) => onSelect(selected === b ? undefined : b);
  const onKeyDown = (b: Barangay) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(b);
    }
  };

  return (
    <Card size="sm" className={cn("min-h-0", className)}>
      <CardHeader>
        <CardTitle>Geography</CardTitle>
        <CardDescription>Plaridel&apos;s 19 barangays. Select one to see its numbers.</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        {/* On desktop the map scales to fit both the width and the height of its slot. */}
        <div className="flex min-h-0 flex-1 items-center justify-center lg:[container-type:size]">
          <div
            className="relative w-full lg:w-[min(100cqw,calc(100cqh*var(--map-ratio)))]"
            style={{ "--map-ratio": MAP_SIZE.width / MAP_SIZE.height } as CSSProperties}
          >
            <svg
              viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
              role="group"
              aria-label="Map of Plaridel's barangays. Select a barangay to see its numbers."
              className="h-auto w-full overflow-visible"
            >
              {barangays.map((b) => (
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
                  className="cursor-pointer outline-none transition-opacity"
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
                    fill={faded ? "#0f172a" : densityInk(shadeOf(b))}
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
                  stroke="#0f172a"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              )}
              {selected && (
                <path
                  d={barangayShapes[selected.psgc].d}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              )}
            </svg>

            {hovered && <MapTooltip barangay={hovered} />}
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
function MapTooltip({ barangay: b }: { barangay: Barangay }) {
  const [x, y] = barangayShapes[b.psgc].center;
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
