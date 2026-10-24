import { DashboardCard, StatBody } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { category, overall, pillars } from "../data";
import { ordinalSuffix } from "../format";

const byRank = [...pillars].sort((a, b) => a.rank - b.rank);

export function RankCard({ className }: { className?: string }) {
  return (
    <DashboardCard title="Rank" action={category.name} className={className}>
      <StatBody
        wideSide
        value={
          <>
            <RollingNumber value={overall.rank} />
            <span className="text-xl">{ordinalSuffix(overall.rank)}</span>
          </>
        }
        notes={
          <>
            <p>overall, of {category.count}</p>
            <p>Top {Math.ceil((overall.rank / category.count) * 100)}%</p>
          </>
        }
        side={
          <ol aria-label="Rank by pillar" className="flex h-full flex-col justify-center gap-1 text-xs">
            {byRank.map((p) => (
              <li key={p.key} className="flex items-baseline justify-between gap-2">
                <span className="truncate">{p.name}</span>
                <span className="font-semibold tabular-nums">
                  {p.rank}
                  {ordinalSuffix(p.rank)}
                </span>
              </li>
            ))}
          </ol>
        }
      />
    </DashboardCard>
  );
}
