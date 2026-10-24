import { Bar, BarChart, LabelList, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DashboardCard, StatBody } from "@/features/statistics/components/dashboard-card";
import { FilledBar } from "@/features/statistics/components/filled-bar";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { CMCI_YEAR, overall } from "../data";
import { colors, score, signedScore } from "../format";

const config = { score: { label: "Overall score" } } satisfies ChartConfig;

// Plaridel is the story; its category's average and best are context.
const data = [
  { name: "Plaridel", score: overall.score, fill: colors.plaridel },
  { name: "Average", score: overall.categoryAverage, fill: colors.others },
  { name: "Best", score: overall.categoryBest, fill: colors.others },
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
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            <BarChart data={data} margin={{ top: 18, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "var(--border)" }} tickMargin={6} fontSize={11} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideIndicator formatter={(v) => score(Number(v))} />}
              />
              <Bar dataKey="score" barSize={22} radius={[4, 4, 0, 0]} shape={FilledBar}>
                <LabelList
                  dataKey="score"
                  position="top"
                  offset={6}
                  formatter={(v) => score(Number(v))}
                  className="fill-foreground"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
      />
    </DashboardCard>
  );
}
