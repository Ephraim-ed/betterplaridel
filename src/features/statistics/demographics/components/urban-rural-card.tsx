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
      <div className="flex flex-1 flex-col justify-between gap-2">
        <dl className="space-y-1.5">
          {urbanRural.map((k) => {
            const dimmed = selectedKind && selectedKind !== k.kind;
            return (
              <div
                key={k.kind}
                className={`flex items-center justify-between gap-3 rounded-lg border-l-4 bg-muted/40 px-2.5 py-1 transition-opacity ${dimmed ? "opacity-40" : ""}`}
                style={{ borderLeftColor: kinds[k.kind].color }}
              >
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {kinds[k.kind].label}
                    {selectedKind === k.kind && (
                      <span className="rounded-full bg-brand px-1.5 text-[10px] font-medium text-white">
                        {barangay?.name}
                      </span>
                    )}
                  </dt>
                  <dd className="text-xl leading-tight font-semibold tracking-tight">
                    <RollingNumber value={k.barangays} />
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      of {barangays.length} barangays
                    </span>
                  </dd>
                </div>
                <dd className="text-right text-xs text-muted-foreground tabular-nums">
                  <span className="block text-sm font-medium text-foreground">
                    {fmt.percent(k.residents / totalResidents)}
                  </span>
                  {fmt.number(k.residents)} residents
                </dd>
              </div>
            );
          })}
        </dl>
        <div className="space-y-1">
          <ShareBar
            label="Barangays"
            values={{ urban: urbanRural[0].barangays, rural: urbanRural[1].barangays }}
          />
          <ShareBar
            label="Residents"
            values={{ urban: urbanRural[0].residents, rural: urbanRural[1].residents }}
          />
        </div>
      </div>
    </DashboardCard>
  );
}
