import { useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { chartColors } from "../colors";
import { barangays, density, fmt, LATEST, rankByPopulation, type Barangay } from "../data";
import { DashboardCard } from "./dashboard-card";
import { FilledBar } from "./filled-bar";

const config = { population: { label: "Residents" } } satisfies ChartConfig;

type Props = { selected?: Barangay; onSelect: (b?: Barangay) => void };

export function PopulationByBarangay({ selected, onSelect, className }: Props & { className?: string }) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <DashboardCard
      title="Population by barangay"
      className={className}
      action={
        <div role="group" aria-label="Show as" className="flex rounded-md border border-line p-0.5">
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

// Columns across the full width on desktop; horizontal bars on narrow screens, where 19 columns won't fit.
function PopulationChart({ selected, onSelect }: Props) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const toggle = (b?: Barangay) => b && onSelect(selected === b ? undefined : b);

  // With a barangay selected, the other bars step back so it stands out.
  const data = rankByPopulation.map((b) => ({
    name: b.name,
    population: b.population[LATEST],
    fill: !selected || selected === b ? chartColors.accent : chartColors.context,
  }));

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full cursor-pointer lg:min-h-0 lg:flex-1"
      style={wide ? undefined : { height: data.length * 26 }}
    >
      <BarChart
        data={data}
        layout={wide ? "horizontal" : "vertical"}
        margin={wide ? { top: 18, right: 0, bottom: 0, left: 0 } : { top: 0, right: 48, bottom: 0, left: 0 }}
      >
        {wide ? (
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            height={36}
            tick={(props) => <NameTick {...props} selected={selected?.name} />}
          />
        ) : (
          <>
            <XAxis type="number" dataKey="population" hide />
            <YAxis type="category" dataKey="name" interval={0} tickLine={false} axisLine={{ stroke: "var(--border)" }} width={112} />
          </>
        )}
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideIndicator />} />
        {/* The transparent background makes the whole row or column clickable, not just the bar. */}
        <Bar
          dataKey="population"
          barSize={wide ? 24 : 16}
          radius={wide ? [4, 4, 0, 0] : [0, 4, 4, 0]}
          shape={FilledBar}
          background={{ fill: "transparent" }}
          onClick={(_, index) => toggle(rankByPopulation[index])}
        >
          <LabelList
            dataKey="population"
            position={wide ? "top" : "right"}
            offset={6}
            formatter={(v) => fmt.number(Number(v))}
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// Two-word names wrap onto two lines so all 19 fit under their columns.
function NameTick({ x, y, payload, selected }: { x?: number | string; y?: number | string; payload?: { value?: string }; selected?: string }) {
  const name = String(payload?.value ?? "");
  const lines = name.includes(" ") && name.length > 8 ? name.split(" ") : [name];
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

function PopulationTable({ selected, onSelect }: Props) {
  return (
    <div className="max-h-96 min-h-0 flex-1 overflow-auto rounded-lg border border-line lg:max-h-none">
      <table className="w-full text-sm tabular-nums">
        <thead className="sticky top-0 bg-card text-left text-xs text-muted-foreground">
          <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
            <th scope="col">Barangay</th>
            <th scope="col" className="text-right">2015</th>
            <th scope="col" className="text-right">2020</th>
            <th scope="col" className="text-right">Change</th>
            <th scope="col">Class</th>
            <th scope="col" className="text-right">≈ km²</th>
            <th scope="col" className="text-right">≈ per km²</th>
          </tr>
        </thead>
        <tbody>
          {barangays.map((b) => (
            <tr key={b.psgc} className="border-t border-line [&>td]:px-3 [&>td]:py-1.5">
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
              <td className="text-right">{fmt.change(b.population[2020] / b.population[2015] - 1)}</td>
              <td>{b.urban ? "Urban" : "Rural"}</td>
              <td className="text-right">{b.areaKm2.toFixed(2)}</td>
              <td className="text-right">{fmt.number(density(b.population[LATEST], b.areaKm2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
