import { cn } from "cn";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { ordinalSuffix } from "@/features/statistics/competitiveness/format";
import { incomeColors } from "../colors";
import { bulacan, FISCAL_YEAR, nationwide, percent, plaridel, selfReliance } from "../data";
import { terms } from "../info";
import { CenteredStat } from "./card-parts";

const share = selfReliance(plaridel);
const bulacanRank = [...bulacan].sort((a, b) => selfReliance(b) - selfReliance(a)).indexOf(plaridel) + 1;
// The scale runs to the next 10% above the most self-reliant Bulacan town.
const scaleMax = Math.ceil(Math.max(...bulacan.map(selfReliance)) * 10) / 10;
const at = (n: number) => `${(n / scaleMax) * 100}%`;

export function SelfRelianceCard({ className }: { className?: string }) {
  return (
    <DashboardCard title="Self-reliance" hint={terms.selfReliance} action={`FY ${FISCAL_YEAR}`} className={className}>
      <div className="flex min-h-0 flex-1 flex-col">
        <CenteredStat
          value={
            <>
              <RollingNumber value={share * 100} decimals={1} />%
            </>
          }
          lines={[
            "of regular income raised locally",
            `${bulacanRank}${ordinalSuffix(bulacanRank)} of ${bulacan.length} in Bulacan · ${nationwide.selfRelianceRank}${ordinalSuffix(nationwide.selfRelianceRank)} of ${nationwide.count.toLocaleString("en-PH")} nationwide`,
          ]}
        />
        <BulacanStrip />
      </div>
    </DashboardCard>
  );
}

// Every Bulacan municipality as a dot on one scale, Plaridel in green, with the national median marked.
function BulacanStrip() {
  return (
    <div>
      <div
        role="img"
        aria-label={`Plaridel raises ${percent(share)} locally. Bulacan municipalities range from ${percent(Math.min(...bulacan.map(selfReliance)))} to ${percent(Math.max(...bulacan.map(selfReliance)))}; the national median is ${percent(nationwide.medianSelfReliance)}.`}
        className="relative mx-1.5 h-6"
      >
        <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <span
          className="absolute top-0.5 bottom-0.5 w-0.5 -translate-x-1/2 rounded-full"
          style={{ left: at(nationwide.medianSelfReliance), backgroundColor: incomeColors.nta }}
        />
        {bulacan.map((l) => (
          <span
            key={l.name}
            title={`${l.name}: ${percent(selfReliance(l))}`}
            className={cn(
              "absolute top-1/2 -translate-1/2 rounded-full",
              l === plaridel ? "z-10 size-3.5 ring-2 ring-card" : "size-2 bg-slate-400/50",
            )}
            style={{ left: at(selfReliance(l)), backgroundColor: l === plaridel ? incomeColors.local : undefined }}
          />
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>0%</span>
        <span className="flex items-center gap-2.5">
          <span className="flex items-center gap-1">
            <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: incomeColors.local }} />
            Plaridel
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden className="size-2 rounded-full bg-slate-400/50" />
            Bulacan towns
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden className="h-2.5 w-0.5 rounded-full" style={{ backgroundColor: incomeColors.nta }} />
            National median
          </span>
        </span>
        <span>{percent(scaleMax, 0)}</span>
      </div>
    </div>
  );
}
