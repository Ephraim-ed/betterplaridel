import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { chartColors } from "../colors";
import { barangays, density, fmt, LATEST, mappedAreaKm2, municipality, type Barangay } from "../data";
import { DashboardCard, StatBody } from "./dashboard-card";
import { RollingNumber } from "./rolling-number";

const config = { share: { label: "Share of Plaridel", color: chartColors.accent } } satisfies ChartConfig;

export function LandAreaCard({ barangay }: { barangay?: Barangay }) {
  const area = barangay ? barangay.areaKm2 : municipality.landAreaKm2;
  const population = (barangay ?? municipality).population[LATEST];
  const approx = barangay ? "≈ " : "";

  return (
    <DashboardCard title="Land area" action={barangay ? "Approximate" : "Official"}>
      <StatBody
        value={
          <>
            {approx}
            <RollingNumber value={area} decimals={2} />
            <span className="text-base font-medium"> km²</span>
          </>
        }
        notes={
          <p>
            {approx}
            {fmt.number(density(population, area))} residents per km²
          </p>
        }
        side={barangay ? <ShareChart barangay={barangay} /> : <TownFacts />}
      />
    </DashboardCard>
  );
}

function TownFacts() {
  const facts = [
    { label: "Barangays", value: <RollingNumber value={barangays.length} /> },
    { label: "Income class", value: municipality.incomeClass },
  ];
  return (
    <dl className="flex h-full flex-col justify-center gap-3">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd className="text-lg leading-tight font-semibold">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Does the barangay hold more of Plaridel's people than of its land, or less?
function ShareChart({ barangay }: { barangay: Barangay }) {
  const data = [
    { measure: "Land", share: barangay.areaKm2 / mappedAreaKm2 },
    { measure: "Residents", share: barangay.population[LATEST] / municipality.population[LATEST] },
  ];

  return (
    <div className="flex h-full flex-col">
      <p className="text-xs text-muted-foreground">Share of Plaridel</p>
      <ChartContainer config={config} className="aspect-auto min-h-0 w-full flex-1">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
          <XAxis type="number" dataKey="share" domain={[0, "dataMax"]} hide />
          <YAxis
            type="category"
            dataKey="measure"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            width={62}
            fontSize={11}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator formatter={(v) => fmt.percent(Number(v))} />}
          />
          <Bar dataKey="share" fill="var(--color-share)" maxBarSize={18} radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="share"
              position="right"
              offset={6}
              formatter={(v) => fmt.percent(Number(v))}
              className="fill-foreground"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
