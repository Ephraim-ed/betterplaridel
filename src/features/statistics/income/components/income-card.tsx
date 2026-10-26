import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { ordinalSuffix } from "@/features/statistics/competitiveness/format";
import { LATEST, municipality } from "@/features/statistics/demographics/data";
import { incomeColors } from "../colors";
import { bulacan, FISCAL_YEAR, nationwide, plaridel, totalIncome } from "../data";
import { terms } from "../info";
import { CenteredStat, ShareStrip } from "./card-parts";

const income = totalIncome(plaridel);
const bulacanRank = bulacan.indexOf(plaridel) + 1;
// The latest census is 2020, so this is an approximation for FY 2024.
const perResident = income / municipality.population[LATEST];

export function IncomeCard({ className }: { className?: string }) {
  return (
    <DashboardCard title="Annual regular income" hint={terms.income} action={`FY ${FISCAL_YEAR}`} className={className}>
      <div className="flex min-h-0 flex-1 flex-col">
        <CenteredStat
          value={
            <>
              ₱<RollingNumber value={income / 1e6} decimals={1} />
              <span className="text-xl">M</span>
            </>
          }
          lines={[
            `≈ ₱${Math.round(perResident).toLocaleString("en-PH")} per resident (${LATEST} population)`,
            `${bulacanRank}${ordinalSuffix(bulacanRank)} of ${bulacan.length} in Bulacan · ${nationwide.incomeRank}${ordinalSuffix(nationwide.incomeRank)} of ${nationwide.count.toLocaleString("en-PH")} nationwide`,
          ]}
        />
        <ShareStrip
          named={2}
          segments={[
            { key: "local", label: "Raised locally", value: plaridel.local, color: incomeColors.local },
            { key: "nta", label: "National allotment", value: plaridel.nta, color: incomeColors.nta },
            { key: "interest", label: "Interest", value: plaridel.interest, color: incomeColors.interest },
            { key: "otherShares", label: "Other national shares", value: plaridel.otherShares, color: incomeColors.otherShares },
          ]}
        />
      </div>
    </DashboardCard>
  );
}
