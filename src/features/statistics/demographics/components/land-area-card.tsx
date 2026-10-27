import { useId } from "react";
import { Area, AreaChart, ReferenceDot, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { chartColors } from "../colors";
import { barangays, density, fmt, LATEST, municipality, type Barangay } from "../demographics-data";

const config = { areaKm2: { label: "Land area", color: chartColors.accent } } satisfies ChartConfig;

const bySize = [...barangays].sort((a, b) => b.areaKm2 - a.areaKm2);
const townDensity = density(municipality.population[LATEST], municipality.landAreaKm2);

export function LandAreaCard({ barangay }: { barangay?: Barangay }) {
  const area = barangay ? barangay.areaKm2 : municipality.landAreaKm2;
  const population = (barangay ?? municipality).population[LATEST];
  const perKm2 = density(population, area);
  const approx = barangay ? "≈ " : "";

  return (
    <DashboardCard title="Land area" action={barangay ? "Approximate" : "Official"}>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-3xl leading-none font-semibold tracking-tight whitespace-nowrap">
            {approx}
            <RollingNumber value={area} decimals={2} />
            <span className="text-base font-medium"> km²</span>
          </p>
          <p className="mt-2 text-xs whitespace-nowrap text-muted-foreground">
            {approx}
            {fmt.number(perKm2)} residents per km²
          </p>
          <p className="text-xs whitespace-nowrap text-muted-foreground">
            {barangay
              ? `#${bySize.indexOf(barangay) + 1} of ${barangays.length} in size · ${(perKm2 / townDensity).toFixed(1)}× town density`
              : `${barangays.length} barangays · ${municipality.incomeClass} class`}
          </p>
        </div>
        <SizeProfile barangay={barangay} />
      </div>
    </DashboardCard>
  );
}

// Every barangay's land area, largest to smallest, drawn edge to edge along the bottom of the card.
// A selected barangay is marked on the curve. Decorative: it has no hover.
function SizeProfile({ barangay }: { barangay?: Barangay }) {
  const gradientId = useId();
  const data = bySize.map((b) => ({ name: b.name, areaKm2: b.areaKm2 }));
  const marked = barangay ? data.findIndex((d) => d.name === barangay.name) : -1;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative -mx-(--card-spacing) -mb-(--card-spacing) h-14 shrink-0 overflow-hidden rounded-b-xl"
    >
      <ChartContainer config={config} className="aspect-auto h-full w-full">
        <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, "dataMax"]} />
          <Area
            dataKey="areaKm2"
            type="monotone"
            stroke={chartColors.accent}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          {marked >= 0 && (
            <ReferenceDot x={data[marked].name} y={data[marked].areaKm2} r={4.5} fill={chartColors.accent} stroke="var(--card)" strokeWidth={2} />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
