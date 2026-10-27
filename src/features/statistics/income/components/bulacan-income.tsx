import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "cn";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { incomeColors } from "../colors";
import { bulacan, peso, percent, plaridel, selfReliance, totalIncome, type Lgu } from "../income-data";

type View = "amount" | "share";

const parts = (l: Lgu) => [
  { key: "local", label: "Raised locally", value: l.local, color: incomeColors.local },
  { key: "nta", label: "National allotment", value: l.nta, color: incomeColors.nta },
  { key: "other", label: "Other", value: l.interest + l.otherShares, color: incomeColors.otherShares },
];

const largest = Math.max(...bulacan.map(totalIncome));
const bySelfReliance = [...bulacan].sort((a, b) => selfReliance(b) - selfReliance(a));

const SHOWN = 15;

// Amount: bars on one peso scale, largest income first. Share: every bar full width, most self-reliant first.
// Only the top 15 are listed; Plaridel is added at the end if it falls outside them.
export function BulacanIncome({ className }: { className?: string }) {
  const [view, setView] = useState<View>("amount");
  const ranked = view === "amount" ? bulacan : bySelfReliance;
  const top = ranked.slice(0, SHOWN);
  const rows = top.includes(plaridel) ? top : [...top, plaridel];

  return (
    <DashboardCard
      title={`Top ${SHOWN} Bulacan municipalities`}
      className={className}
      action={
        <div role="group" aria-label="Show as" className="flex rounded-md border border-line p-0.5">
          {(["amount", "share"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="rounded px-2 py-0.5 capitalize aria-pressed:bg-muted aria-pressed:font-medium aria-pressed:text-foreground"
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      <ol className="space-y-1">
        {rows.map((l) => {
          const total = totalIncome(l);
          const scale = view === "amount" ? total / largest : 1;
          return (
            <motion.li
              key={l.name}
              layout="position"
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
              aria-label={`${l.name}: ${peso.millions(total)}, ${percent(selfReliance(l))} raised locally`}
              className={cn(
                "grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 rounded px-1 py-0.5 text-xs",
                l === plaridel && "bg-brand/5 font-semibold",
              )}
            >
              <span className={cn("truncate", l !== plaridel && "text-muted-foreground")}>{l.name}</span>
              <div className="h-3">
                <motion.div
                  className="flex h-full gap-px overflow-hidden rounded-sm"
                  initial={false}
                  animate={{ width: `${scale * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {parts(l).map((p) => (
                    <div
                      key={p.key}
                      title={`${p.label}: ${peso.millions(p.value)}`}
                      style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }}
                    />
                  ))}
                </motion.div>
              </div>
              <span className="text-right tabular-nums">
                {view === "amount" ? peso.millions(total) : percent(selfReliance(l))}
              </span>
            </motion.li>
          );
        })}
      </ol>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {parts(plaridel).map((p) => (
          <li key={p.key} className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-[2px]" style={{ backgroundColor: p.color }} />
            {p.label}
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
