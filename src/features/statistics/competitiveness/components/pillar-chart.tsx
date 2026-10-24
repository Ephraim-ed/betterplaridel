import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { averageTick } from "@/features/statistics/components/average-tick";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { WrappedTick } from "@/features/statistics/components/wrapped-tick";
import { pillars, type Pillar } from "../data";
import { colors, score } from "../format";
import { PlaridelVsAverageLegend } from "./legend";

const config = {
  score: { label: "Plaridel", color: colors.plaridel },
  average: { label: "Category average" },
} satisfies ChartConfig;

const BAR = 40;

const data = pillars.map((p) => ({ name: p.name, score: p.score, average: p.categoryAverage }));

export function PillarChart({
  selected,
  onSelect,
  className,
}: {
  selected: Pillar;
  onSelect: (p: Pillar) => void;
  className?: string;
}) {
  return (
    <DashboardCard title="Pillar scores" action={<PlaridelVsAverageLegend tick="horizontal" />} className={className}>
      <p className="text-xs text-muted-foreground">
        Each pillar is worth 20 points. Select one to see its sub-indicators.
      </p>
      <ChartContainer config={config} className="mt-4 aspect-auto h-64 w-full cursor-pointer">
        {/* A negative gap lays the average tick over Plaridel's bar instead of beside it. */}
        <BarChart data={data} barGap={-BAR} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            height={36}
            tick={(props) => <WrappedTick {...props} selected={selected.name} />}
          />
          <YAxis hide domain={[0, "dataMax"]} />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={<ChartTooltipContent indicator="line" className="min-w-44" />}
          />
          {/* The transparent background makes the whole column a click target for its sub-indicators. */}
          <Bar
            dataKey="score"
            fill="var(--color-score)"
            barSize={BAR}
            radius={[4, 4, 0, 0]}
            background={{ fill: "transparent" }}
            onClick={(_, index) => onSelect(pillars[index])}
          >
            <LabelList
              dataKey="score"
              position="top"
              offset={6}
              formatter={(v) => score(Number(v))}
              className="fill-foreground"
              fontSize={11}
            />
          </Bar>
          <Bar dataKey="average" barSize={BAR} shape={averageTick("columns")} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </DashboardCard>
  );
}
