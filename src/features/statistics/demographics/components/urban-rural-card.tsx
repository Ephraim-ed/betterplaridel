import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { chartColors } from "../colors";
import { barangays, fmt, urbanRural, type Barangay } from "../data";

const kinds = { urban: { label: "Urban", color: chartColors.urban }, rural: { label: "Rural", color: chartColors.rural } };
const totalResidents = urbanRural.reduce((sum, k) => sum + k.residents, 0);

function ShareBar({ label, values }: { label: string; values: Record<"urban" | "rural", number> }) {
  const total = values.urban + values.rural;
  return (
    <div className="flex items-center gap-3 text-[7px]">
      <span className="w-14 shrink-0 text-muted-foreground">{label}</span>
      <div className="flex h-5 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-md">
        {(["urban", "rural"] as const).map((k) => (
          <div
            key={k}
            title={`${kinds[k].label}: ${fmt.percent(values[k] / total)}`}
            className="grid place-items-center font-medium tabular-nums"
            style={{
              width: `${(values[k] / total) * 100}%`,
              backgroundColor: kinds[k].color,
              color: k === "urban" ? "#ffffff" : "#0f172a",
            }}
          >
            {fmt.percent(values[k] / total)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function UrbanRuralCard({ barangay }: { barangay?: Barangay }) {
  const selectedKind = barangay ? (barangay.urban ? "urban" : "rural") : undefined;

  return (
    <DashboardCard
      title="Urban and rural"
      action={
        <span
          className="cursor-help underline decoration-dotted underline-offset-2"
          title="PSA classes barangays using criteria such as population size and the businesses and public facilities present."
        >
          How it&apos;s classed
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
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
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
