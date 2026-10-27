import { useId } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { chartColors } from "../colors";
import { barangays, CENSUS_YEARS, fmt, LATEST, municipality, type Barangay } from "../demographics-data";

const FIRST = CENSUS_YEARS[0];
const YEARS = LATEST - FIRST;

const growth = (p: Record<typeof FIRST | typeof LATEST, number>) => p[LATEST] / p[FIRST] - 1;
const perYear = (g: number) => (1 + g) ** (1 / YEARS) - 1;
const ranked = [...barangays].sort((a, b) => growth(b.population) - growth(a.population));

export function GrowthCard({ barangay }: { barangay?: Barangay }) {
  const population = (barangay ?? municipality).population;
  const g = growth(population);
  const added = population[LATEST] - population[FIRST];

  return (
    <DashboardCard title="Population growth" action={`${FIRST} to ${LATEST}`}>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-3xl leading-none font-semibold tracking-tight whitespace-nowrap">
            {g > 0 && "+"}
            <RollingNumber value={g * 100} decimals={1} />%
          </p>
          <p className="mt-2 text-xs whitespace-nowrap text-muted-foreground">
            {added >= 0 ? "+" : "−"}
            {fmt.number(Math.abs(added))} residents · about {fmt.percent(perYear(g))} a year
            {barangay && ` · #${ranked.indexOf(barangay) + 1} of 19`}
          </p>
        </div>
        <GrowthChart barangay={barangay} />
      </div>
    </DashboardCard>
  );
}

// A sparkline drawn straight onto the card: no axes or grid. For a barangay, it and the town are both
// indexed to 2015 = 100 so their growth can be compared on one scale.
function GrowthChart({ barangay }: { barangay?: Barangay }) {
  const gradientId = useId();
  const town = municipality.population;
  const config = {
    town: { label: "Plaridel", color: barangay ? "#94a3b8" : chartColors.accent },
    barangay: { label: barangay?.name ?? "", color: chartColors.accent },
  } satisfies ChartConfig;

  const data = CENSUS_YEARS.map((year) => ({
    year: String(year),
    town: barangay ? (town[year] / town[FIRST]) * 100 : town[year],
    barangay: barangay ? (barangay.population[year] / barangay.population[FIRST]) * 100 : undefined,
  }));
  const main = barangay ? "barangay" : "town";

  return (
    // Bleeds to the card's left, right and bottom edges.
    <div className="pointer-events-none relative -mx-(--card-spacing) -mb-(--card-spacing) h-16 shrink-0 overflow-hidden rounded-b-xl">
      {barangay && (
        <p className="absolute top-0 left-(--card-spacing) z-10 text-[10px] text-muted-foreground">Index, {FIRST} = 100</p>
      )}
      <ChartContainer config={config} className="aspect-auto h-full w-full">
        <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" hide />
          <YAxis hide domain={["dataMin - 2", "dataMax + 1"]} />
          {barangay && (
            <Area dataKey="town" type="monotone" stroke="var(--color-town)" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
          )}
          <Area
            dataKey={main}
            type="monotone"
            stroke={chartColors.accent}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
