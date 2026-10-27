import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { FilledBar } from "@/features/statistics/components/filled-bar";
import { bulacan } from "../competitiveness-data";
import { colors, ordinalSuffix, score } from "../format";

const config = { score: { label: "Overall score" } } satisfies ChartConfig;

// Plaridel stands out; every other city and municipality is context.
const data = bulacan.map((l) => ({
  name: l.name,
  score: l.score,
  detail: `${l.rank}${ordinalSuffix(l.rank)} of the ${l.category.toLowerCase()}`,
  fill: l.name === "Plaridel" ? colors.plaridel : colors.others,
}));

const ROW = 26;

export function BulacanRanking({ className }: { className?: string }) {
  return (
    <DashboardCard title="Bulacan ranking" action="Overall score" className={className}>
      <ChartContainer
        config={config}
        className="aspect-auto w-full lg:h-auto lg:min-h-0 lg:flex-1"
        style={{ minHeight: data.length * ROW }}
      >
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 44, bottom: 0, left: 0 }}>
          <XAxis type="number" dataKey="score" hide />
          <YAxis
            type="category"
            dataKey="name"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            width={156}
            tick={({ x, y, payload }) => (
              <text
                x={Number(x) - 6}
                y={Number(y)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={12}
                className={payload.value === "Plaridel" ? "fill-foreground font-semibold" : "fill-muted-foreground"}
              >
                {payload.value}
              </text>
            )}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={
              <ChartTooltipContent
                hideIndicator
                className="min-w-44"
                formatter={(value, _name, item) => (
                  <div className="grid gap-0.5">
                    <span className="font-mono font-medium tabular-nums">{score(Number(value))}</span>
                    <span className="text-muted-foreground">{item.payload.detail}</span>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="score" barSize={14} radius={[0, 4, 4, 0]} shape={FilledBar}>
            <LabelList
              dataKey="score"
              position="right"
              offset={6}
              formatter={(v) => score(Number(v))}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardCard>
  );
}
