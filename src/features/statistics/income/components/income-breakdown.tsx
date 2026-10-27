import { motion } from "motion/react";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { InfoHint } from "@/features/statistics/components/info-hint";
import { incomeColors, sourceColors } from "../colors";
import { localSources, peso, percent, plaridel, totalIncome } from "../income-data";
import { sourceInfo } from "../info";

type Row = { key: string; label: string; amount: number; color: string };

const income = totalIncome(plaridel);

const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Raised locally",
    rows: [...localSources]
      .sort((a, b) => b.amount - a.amount)
      .map((s) => ({ key: s.key, label: s.label, amount: s.amount, color: sourceColors[s.key] })),
  },
  {
    title: "From the national government",
    rows: [
      { key: "nta", label: "National Tax Allotment", amount: plaridel.nta, color: incomeColors.nta },
      { key: "otherShares", label: "Other national shares", amount: plaridel.otherShares, color: incomeColors.otherShares },
    ],
  },
  {
    title: "Other",
    rows: [{ key: "interest", label: "Interest income", amount: plaridel.interest, color: incomeColors.interest }],
  },
];

// Every bar shares one scale, so the allotment and the town's own sources compare directly.
const largest = Math.max(...groups.flatMap((g) => g.rows.map((r) => r.amount)));

export function IncomeBreakdown({ className }: { className?: string }) {
  return (
    <DashboardCard title="Where the money comes from" action={`Share of ${peso.millions(income)}`} className={className}>
      <div className="space-y-4">
        {groups.map((g) => {
          const subtotal = g.rows.reduce((sum, r) => sum + r.amount, 0);
          return (
            <section key={g.title} aria-label={g.title}>
              <h3 className="flex items-baseline justify-between border-b border-line pb-1 text-xs font-medium">
                {g.title}
                <span className="text-muted-foreground tabular-nums">
                  {peso.millions(subtotal)} · {percent(subtotal / income)}
                </span>
              </h3>
              <ul className="mt-2 space-y-2">
                {g.rows.map((r, i) => (
                  <li
                    key={r.key}
                    className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_auto] items-center gap-3 text-xs sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate">{r.label}</span>
                      <InfoHint label={r.label}>{sourceInfo[r.key]}</InfoHint>
                    </span>
                    <div className="h-2.5 rounded-sm bg-muted">
                      <motion.div
                        className="h-full rounded-sm"
                        style={{ backgroundColor: r.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0.5, (r.amount / largest) * 100)}%` }}
                        transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="w-28 text-right whitespace-nowrap tabular-nums" title={peso.full(r.amount)}>
                      {peso.millions(r.amount)}{" "}
                      <span className="text-muted-foreground">{percent(r.amount / income)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </DashboardCard>
  );
}
