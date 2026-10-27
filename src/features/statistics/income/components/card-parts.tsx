import type { ReactNode } from "react";
import { motion } from "motion/react";
import { percent } from "../income-data";

// The card's figure, centered in the space above its strip.
export function CenteredStat({ value, lines }: { value: ReactNode; lines: ReactNode[] }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
      <p className="text-3xl leading-none font-semibold tracking-tight whitespace-nowrap">{value}</p>
      <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export type Segment = { key: string; label: string; value: number; color: string };

// A stacked strip across the full width of the card's bottom edge, with a key naming the first `named`
// segments; the rest are summed as "Others".
export function ShareStrip({ segments, named = segments.length }: { segments: Segment[]; named?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const rest = segments.slice(named).reduce((sum, s) => sum + s.value, 0);
  const key = [
    ...segments.slice(0, named),
    ...(rest > 0 ? [{ key: "others", label: "Others", value: rest, color: segments[named].color }] : []),
  ];

  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
        {key.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden className="size-2 rounded-[2px]" style={{ backgroundColor: s.color }} />
            {s.label}
            <span className="font-medium text-foreground tabular-nums">{percent(s.value / total)}</span>
          </li>
        ))}
      </ul>
      <div aria-hidden className="-mx-(--card-spacing) -mb-(--card-spacing) mt-2.5 flex h-2.5 gap-px overflow-hidden rounded-b-xl">
        {segments.map((s, i) => (
          <motion.div
            key={s.key}
            title={`${s.label}: ${percent(s.value / total)}`}
            initial={{ width: 0 }}
            animate={{ width: `${(s.value / total) * 100}%` }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: s.color }}
          />
        ))}
      </div>
    </div>
  );
}
