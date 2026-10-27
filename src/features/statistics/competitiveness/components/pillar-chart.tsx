import { useId } from "react";
import { Area, AreaChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { WrappedTick } from "@/features/statistics/components/wrapped-tick";
import { pillars, type Pillar } from "../competitiveness-data";
import { colors, score } from "../format";

const config = {
  score: { label: "Plaridel", color: colors.plaridel },
  average: { label: "Category average", color: colors.average },
} satisfies ChartConfig;

const data = pillars.map((p) => ({ name: p.name, score: p.score, average: p.categoryAverage }));

const Legend = () => (
  <span className="flex items-center gap-3">
    {(["score", "average"] as const).map((k) => (
      <span key={k} className="flex items-center gap-1.5">
        <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ backgroundColor: config[k].color }} />
        {config[k].label}
      </span>
    ))}
  </span>
);

export function PillarChart({
  selected,
  onSelect,
  className,
}: {
  selected: Pillar;
  onSelect: (p: Pillar) => void;
  className?: string;
}) {
  const id = useId();
  const gradient = (key: "score" | "average") => `${id}-${key}`;

  return (
    <DashboardCard title="Pillar scores" action={<Legend />} className={className}>
      <p className="text-xs text-muted-foreground">
        Each pillar is worth 20 points. Select one to see its sub-indicators.
      </p>
      <ChartContainer config={config} className="mt-4 aspect-auto h-64 w-full cursor-pointer">
        {/* Clicking anywhere on the chart picks the nearest pillar. */}
        <AreaChart
          data={data}
          margin={{ top: 22, right: 0, bottom: 0, left: 0 }}
          onClick={(state) => {
            const i = state?.activeTooltipIndex;
            if (i !== undefined && i !== null) onSelect(pillars[Number(i)]);
          }}
        >
          <defs>
            {(["score", "average"] as const).map((k) => (
              <linearGradient key={k} id={gradient(k)} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config[k].color} stopOpacity={k === "score" ? 0.35 : 0.3} />
                <stop offset="100%" stopColor={config[k].color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            height={36}
            padding={{ left: 40, right: 40 }}
            tick={(props) => <WrappedTick {...props} selected={selected.name} />}
          />
          <YAxis hide domain={[0, "dataMax + 1"]} />
          <ReferenceLine x={selected.name} stroke="var(--border)" strokeWidth={2} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" className="min-w-44" />}
          />
          <Area
            dataKey="average"
            type="monotone"
            fill={`url(#${gradient("average")})`}
            stroke="var(--color-average)"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "var(--color-average)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Area
            dataKey="score"
            type="monotone"
            fill={`url(#${gradient("score")})`}
            stroke="var(--color-score)"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "var(--color-score)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          >
            <LabelList
              dataKey="score"
              position="top"
              offset={8}
              formatter={(v) => score(Number(v))}
              className="fill-foreground"
              fontSize={11}
            />
          </Area>
        </AreaChart>
      </ChartContainer>
    </DashboardCard>
  );
}
