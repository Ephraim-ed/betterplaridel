import { DashboardCard, StatBody } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { CMCI_YEAR, overall } from "../competitiveness-data";
import { colors, score, signedScore } from "../format";

// Plaridel is the story; its category's average and best are context. Bars all start at zero.
const rows = [
  { name: "Plaridel", score: overall.score, color: colors.plaridel },
  { name: "Category average", score: overall.categoryAverage, color: colors.others },
  { name: "Category best", score: overall.categoryBest, color: colors.others },
];

export function OverallCard({ className }: { className?: string }) {
  return (
    <DashboardCard title="Overall score" action={`CMCI ${CMCI_YEAR}`} className={className}>
      <StatBody
        value={
          <>
            <RollingNumber value={overall.score} decimals={2} />
            <span className="text-base font-medium text-muted-foreground"> /100</span>
          </>
        }
        notes={<p>{signedScore(overall.score - overall.categoryAverage)} vs. category average</p>}
        side={
          <ul className="flex h-full flex-col justify-center gap-2">
            {rows.map((r) => (
              <li key={r.name} className="min-w-0 text-[11px]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-muted-foreground">{r.name}</span>
                  <span className="shrink-0 font-medium tabular-nums">{score(r.score)}</span>
                </div>
                <div className="mt-0.5 h-2 rounded-sm bg-muted">
                  <div
                    className="h-full rounded-sm"
                    style={{ width: `${(r.score / overall.categoryBest) * 100}%`, backgroundColor: r.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
        }
      />
    </DashboardCard>
  );
}
