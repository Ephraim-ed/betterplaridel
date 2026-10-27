import { useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { FilledBar } from "@/features/statistics/components/filled-bar";
import {
  chartColors,
  densityBreaks,
  densityClass,
  densityRamp,
} from "../colors";
import {
  barangays,
  density,
  fmt,
  LATEST,
  rankByPopulation,
  type Barangay,
} from "../demographics-data";

const config = { population: { label: "Residents" } } satisfies ChartConfig;

type Props = { selected?: Barangay; onSelect: (b?: Barangay) => void };

export function PopulationByBarangay({
  selected,
  onSelect,
  className,
}: Props & { className?: string }) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <DashboardCard
      title="Population by barangay"
      className={className}
      action={
        <div
          role="group"
          aria-label="Show as"
          className="flex rounded-md border border-line p-0.5"
        >
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="rounded px-2 py-0.5 capitalize aria-pressed:bg-muted aria-pressed:font-medium aria-pressed:text-foreground"
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      {view === "chart" ? (
        <PopulationChart selected={selected} onSelect={onSelect} />
      ) : (
        <PopulationTable selected={selected} onSelect={onSelect} />
      )}
    </DashboardCard>
  );
}

// Horizontal bars ranked by population, so every barangay name has its own row. On desktop the ranking is
// split into two side-by-side columns (both on the same scale) to fit the card; on narrow screens it is one.
function PopulationChart({ selected, onSelect }: Props) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const toggle = (b?: Barangay) =>
    b && onSelect(selected === b ? undefined : b);

  // Bars take the map's density shades; with a barangay selected, the others step back so it stands out.
  const data = rankByPopulation.map((b) => ({
    barangay: b,
    name: b.name,
    population: b.population[LATEST],
    fill:
      !selected || selected === b
        ? densityRamp[densityClass(density(b.population[LATEST], b.areaKm2))]
        : chartColors.context,
  }));
  const max = data[0].population;
  const columns = wide
    ? [
        data.slice(0, Math.ceil(data.length / 2)),
        data.slice(Math.ceil(data.length / 2)),
      ]
    : [data];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="grid gap-x-8 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
        {columns.map((rows, i) => (
          <ChartContainer
            key={i}
            config={config}
            className="aspect-auto w-full cursor-pointer lg:min-h-0"
            style={wide ? undefined : { height: rows.length * 26 }}
          >
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                dataKey="population"
                domain={[0, max]}
                hide
              />
              <YAxis
                type="category"
                dataKey="name"
                interval={0}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                width={wide ? 128 : 112}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={<ChartTooltipContent hideIndicator />}
              />
              {/* The transparent background makes the whole row clickable, not just the bar. */}
              <Bar
                dataKey="population"
                barSize={14}
                radius={[0, 4, 4, 0]}
                shape={FilledBar}
                background={{ fill: "transparent" }}
                onClick={(_, index) => toggle(rows[index].barangay)}
              >
                <LabelList
                  dataKey="population"
                  position="right"
                  offset={6}
                  formatter={(v) => fmt.number(Number(v))}
                  className="fill-foreground"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ))}
      </div>
      <DensityLegend />
    </div>
  );
}

function DensityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span>Shaded by residents per km²</span>
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {densityRamp.map((color, i) => {
          const lo = densityBreaks[i - 1];
          const hi = densityBreaks[i];
          const label =
            lo === undefined
              ? `Under ${fmt.number(hi)}`
              : hi === undefined
                ? `${fmt.number(lo)}+`
                : `${fmt.number(lo)}–${fmt.number(hi - 1)}`;
          return (
            <li key={color} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-3 rounded-[3px]"
                style={{ backgroundColor: color }}
              />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PopulationTable({ selected, onSelect }: Props) {
  return (
    <div className="max-h-96 min-h-0 flex-1 overflow-auto rounded-lg border border-line lg:max-h-none">
      <table className="w-full text-sm tabular-nums">
        <thead className="sticky top-0 bg-card text-left text-xs text-muted-foreground">
          <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
            <th scope="col">Barangay</th>
            <th scope="col" className="text-right">
              2015
            </th>
            <th scope="col" className="text-right">
              2020
            </th>
            <th scope="col" className="text-right">
              Change
            </th>
            <th scope="col">Class</th>
            <th scope="col" className="text-right">
              ≈ km²
            </th>
            <th scope="col" className="text-right">
              ≈ per km²
            </th>
          </tr>
        </thead>
        <tbody>
          {barangays.map((b) => (
            <tr
              key={b.psgc}
              className="border-t border-line [&>td]:px-3 [&>td]:py-1.5"
            >
              <td>
                <button
                  type="button"
                  aria-pressed={selected === b}
                  onClick={() => onSelect(selected === b ? undefined : b)}
                  className="font-medium whitespace-nowrap text-brand underline-offset-4 hover:underline aria-pressed:text-foreground"
                >
                  {b.name}
                </button>
              </td>
              <td className="text-right">{fmt.number(b.population[2015])}</td>
              <td className="text-right">{fmt.number(b.population[2020])}</td>
              <td className="text-right">
                {fmt.change(b.population[2020] / b.population[2015] - 1)}
              </td>
              <td>{b.urban ? "Urban" : "Rural"}</td>
              <td className="text-right">{b.areaKm2.toFixed(2)}</td>
              <td className="text-right">
                {fmt.number(density(b.population[LATEST], b.areaKm2))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
