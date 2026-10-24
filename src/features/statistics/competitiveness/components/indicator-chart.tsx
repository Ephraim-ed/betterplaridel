import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { averageTick } from "@/features/statistics/components/average-tick";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { pillars, type Pillar } from "../data";
import { colors, ordinalSuffix, score } from "../format";
import { PlaridelVsAverageLegend } from "./legend";

const config = {
  score: { label: "Plaridel", color: colors.plaridel },
  average: { label: "Category average" },
} satisfies ChartConfig;

const BAR = 18;

// Shorter axis labels for the longest official names; tooltips keep the full name.
const shortNames: Record<string, string> = {
  "Active Establishments in the Locality": "Active Establishments",
  "Presence of Business and Professional Organizations": "Business Organizations",
  "Compliance to National Directives": "National Directives",
  "Presence of Investment Promotion Unit": "Investment Promotion Unit",
  "Compliance to ARTA Citizen's Charter": "ARTA Citizen's Charter",
  "Capacity to Generate Local Resource": "Local Resource Generation",
  "Availability of Basic Utilities": "Basic Utilities",
  "Information Technology Capacity": "IT Capacity",
  "Financial Technology Capacity": "Fintech Capacity",
  "Innovation Financing (R&D Expenditures)": "R&D Expenditures",
  "Intellectual Property Registration": "IP Registration",
  "Availability of Basic Internet Service": "Basic Internet Service",
  "Start-up and Innovation Facilities": "Start-up Facilities",
};

// One line per name: Recharts would otherwise wrap long names, and rows are too short for two lines on small screens.
function NameTick({ x, y, payload }: { x?: number | string; y?: number | string; payload?: { value?: string } }) {
  return (
    <text x={Number(x) - 6} y={Number(y)} textAnchor="end" dominantBaseline="central" fontSize={12} className="fill-muted-foreground">
      {payload?.value}
    </text>
  );
}

export function IndicatorChart({
  pillar,
  onSelect,
  className,
}: {
  pillar: Pillar;
  onSelect: (p: Pillar) => void;
  className?: string;
}) {
  const data = pillar.indicators.map((i) => ({
    name: i.name,
    label: shortNames[i.name] ?? i.name,
    value: score(i.score),
    score: i.score,
    average: i.categoryAverage,
  }));

  return (
    <DashboardCard title="Sub-indicators" action={<PlaridelVsAverageLegend tick="vertical" />} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          aria-label="Pillar"
          value={pillar.key}
          onChange={(e) => onSelect(pillars.find((p) => p.key === e.target.value) ?? pillar)}
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {pillars.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          {score(pillar.score)} of 20 · {pillar.rank}
          {ordinalSuffix(pillar.rank)} in category
        </p>
      </div>
      <ChartContainer config={config} className="mt-4 aspect-auto h-96 w-full">
        {/* A negative gap lays the average tick over Plaridel's bar instead of beside it. */}
        <BarChart data={data} layout="vertical" barGap={-BAR} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis type="number" domain={[0, 2]} hide />
          <YAxis
            yAxisId="names"
            type="category"
            dataKey="label"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            width={196}
            tick={NameTick}
          />
          {/* Plaridel's values as a right-hand column, clear of the bars and average ticks. */}
          <YAxis
            yAxisId="values"
            orientation="right"
            type="category"
            dataKey="value"
            interval={0}
            tickLine={false}
            axisLine={false}
            width={44}
            fontSize={12}
            tick={{ fill: "var(--foreground)" }}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={
              <ChartTooltipContent
                indicator="line"
                className="min-w-44"
                labelFormatter={(_, payload) => payload?.[0]?.payload?.name}
              />
            }
          />
          <Bar yAxisId="names" dataKey="score" fill="var(--color-score)" barSize={BAR} radius={[0, 4, 4, 0]} />
          <Bar
            yAxisId="names"
            dataKey="average"
            barSize={BAR}
            shape={averageTick("rows")}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </DashboardCard>
  );
}
