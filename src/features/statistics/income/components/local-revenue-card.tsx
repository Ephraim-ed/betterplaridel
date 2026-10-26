import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { sourceColors } from "../colors";
import { FISCAL_YEAR, localSources, percent, plaridel } from "../data";
import { terms } from "../info";
import { CenteredStat, ShareStrip } from "./card-parts";

const bySize = [...localSources].sort((a, b) => b.amount - a.amount);
const biggest = bySize[0];

export function LocalRevenueCard({ className }: { className?: string }) {
  return (
    <DashboardCard title="Local revenue" hint={terms.localRevenue} action={`FY ${FISCAL_YEAR}`} className={className}>
      <div className="flex min-h-0 flex-1 flex-col">
        <CenteredStat
          value={
            <>
              ₱<RollingNumber value={plaridel.local / 1e6} decimals={1} />
              <span className="text-xl">M</span>
            </>
          }
          lines={["collected by the town itself", `${biggest.label}: ${percent(biggest.amount / plaridel.local)} of it`]}
        />
        <ShareStrip
          named={2}
          segments={bySize.map((s) => ({ key: s.key, label: s.label, value: s.amount, color: sourceColors[s.key] }))}
        />
      </div>
    </DashboardCard>
  );
}
