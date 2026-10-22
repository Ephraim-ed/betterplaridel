import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { chartColors } from "../colors";
import { barangays, fmt, urbanRural, type Barangay } from "../data";
import { DashboardCard, StatBody } from "./dashboard-card";
import { RollingNumber } from "./rolling-number";
import { segmentLabel } from "./segment-label";

const config = {
  urban: { label: "Urban", color: chartColors.urban },
  rural: { label: "Rural", color: chartColors.rural },
} satisfies ChartConfig;

const [urban, rural] = urbanRural;
const totalResidents = urban.residents + rural.residents;
const rows = [
  { row: "Barangays", urban: urban.barangays, rural: rural.barangays },
  { row: "Residents", urban: urban.residents, rural: rural.residents },
];
// Barangays as counts, residents as shares.
const text = (kind: "urban" | "rural") => (row: number) =>
  row === 0 ? String(rows[0][kind]) : fmt.percent(rows[1][kind] / totalResidents);

const Swatch = ({ kind }: { kind: "urban" | "rural" }) => (
  <span aria-hidden className="inline-block size-2.5 rounded-[2px]" style={{ backgroundColor: config[kind].color }} />
);

export function UrbanRuralCard({ barangay }: { barangay?: Barangay }) {
  const kind = barangay?.urban ? urban : rural;

  return (
    <DashboardCard
      title="Urban and rural"
      action={
        <span className="flex items-center gap-3" title="PSA classes barangays using criteria such as population size and the businesses and public facilities present.">
          {(["urban", "rural"] as const).map((k) => (
            <span key={k} className="flex items-center gap-1">
              <Swatch kind={k} />
              {config[k].label}
            </span>
          ))}
        </span>
      }
    >
      <StatBody
        value={
          barangay ? (
            <span className="flex items-center gap-2">
              <Swatch kind={kind.kind} />
              {config[kind.kind].label}
            </span>
          ) : (
            <>
              <RollingNumber value={urban.barangays} /> of {barangays.length}
            </>
          )
        }
        notes={
          barangay ? (
            <p>
              One of Plaridel&apos;s {kind.barangays} {kind.kind} barangays
            </p>
          ) : (
            <p>barangays are urban, home to {fmt.percent(urban.residents / totalResidents)} of residents</p>
          )
        }
        side={
          <div className="flex h-full flex-col">
            {barangay && <p className="text-xs text-muted-foreground">Across Plaridel</p>}
            <ChartContainer config={config} className="aspect-auto min-h-0 w-full flex-1">
              <BarChart data={rows} layout="vertical" stackOffset="expand" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="row" tickLine={false} axisLine={false} width={62} fontSize={11} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="urban" stackId="class" fill="var(--color-urban)" stroke="var(--card)" strokeWidth={2} maxBarSize={22} radius={[4, 0, 0, 4]}>
                  <LabelList dataKey="urban" content={segmentLabel(text("urban"), "#ffffff")} />
                </Bar>
                <Bar dataKey="rural" stackId="class" fill="var(--color-rural)" stroke="var(--card)" strokeWidth={2} maxBarSize={22} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="rural" content={segmentLabel(text("rural"), "#0f172a")} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        }
      />
    </DashboardCard>
  );
}
