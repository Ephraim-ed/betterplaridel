import { Bar, BarChart, LabelList, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { chartColors } from "../colors";
import { CENSUS_YEARS, fmt, LATEST, municipality, rankByPopulation, type Barangay } from "../data";
import { DashboardCard, StatBody } from "./dashboard-card";
import { FilledBar } from "./filled-bar";
import { RollingNumber } from "./rolling-number";

const config = { population: { label: "Residents" } } satisfies ChartConfig;

export function PopulationCard({ barangay }: { barangay?: Barangay }) {
  const population = (barangay ?? municipality).population;
  const [first] = CENSUS_YEARS;

  // The latest census is the story; the earlier one is context.
  const data = CENSUS_YEARS.map((year) => ({
    year: String(year),
    population: population[year],
    fill: year === LATEST ? chartColors.accent : chartColors.context,
  }));

  return (
    <DashboardCard title="Population" action="2020 census">
      <StatBody
        value={<RollingNumber value={population[LATEST]} />}
        notes={
          <>
            <p>
              {fmt.change(population[LATEST] / population[first] - 1)} since {first}
            </p>
            {barangay && (
              <p>
                {fmt.percent(population[LATEST] / municipality.population[LATEST])} of Plaridel · #
                {rankByPopulation.indexOf(barangay) + 1} of 19
              </p>
            )}
          </>
        }
        side={
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            <BarChart data={data} margin={{ top: 18, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="year" tickLine={false} axisLine={{ stroke: "var(--border)" }} tickMargin={6} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="population" barSize={24} radius={[4, 4, 0, 0]} shape={FilledBar}>
                <LabelList
                  dataKey="population"
                  position="top"
                  offset={6}
                  formatter={(v) => fmt.number(Number(v))}
                  className="fill-foreground"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
      />
    </DashboardCard>
  );
}
