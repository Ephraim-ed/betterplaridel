import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { averageTick } from "@/features/statistics/components/average-tick";
import { DashboardCard } from "@/features/statistics/components/dashboard-card";
import { pillars, type Pillar } from "../competitiveness-data";
import { indicatorInfo, pillarInfo } from "../info";
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
  "Presence of Business and Professional Organizations":
    "Business Organizations",
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

type InfoTarget = { name: string; x: number; y: number };

// One line per name: Recharts would otherwise wrap long names, and rows are too short for two lines on small screens.
// A small "i" after each label opens the indicator's description on hover, focus or tap.
function NameTick({
  x,
  y,
  payload,
  fullName,
  onInfo,
}: {
  x?: number | string;
  y?: number | string;
  payload?: { value?: string };
  fullName: (label?: string) => string | undefined;
  onInfo: (target?: InfoTarget) => void;
}) {
  const name = fullName(payload?.value);
  const cy = Number(y);
  const iconX = Number(x) - ICON_OFFSET;
  const show = () => name && onInfo({ name, x: iconX, y: cy });
  return (
    <>
      {name && (
        <g
          role="img"
          tabIndex={0}
          aria-label={`${name}: ${indicatorInfo[name] ?? ""}`}
          className="cursor-help outline-none [&:focus-visible_circle]:stroke-brand"
          onPointerEnter={show}
          onPointerLeave={() => onInfo(undefined)}
          onFocus={show}
          onBlur={() => onInfo(undefined)}
          onClick={show}
        >
          <circle
            cx={iconX}
            cy={cy}
            r={5}
            fill="transparent"
            className="stroke-muted-foreground/60"
            strokeWidth={1}
          />
          <text
            x={iconX}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={600}
            className="fill-muted-foreground"
          >
            i
          </text>
        </g>
      )}
      <text
        x={Number(x) - ICON_OFFSET - 9}
        y={cy}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={12}
        className="fill-muted-foreground"
      >
        {payload?.value}
      </text>
    </>
  );
}

const ICON_OFFSET = 8;

export function IndicatorChart({
  pillar,
  onSelect,
  className,
}: {
  pillar: Pillar;
  onSelect: (p: Pillar) => void;
  className?: string;
}) {
  const [info, setInfo] = useState<InfoTarget>();
  const data = pillar.indicators.map((i) => ({
    name: i.name,
    label: shortNames[i.name] ?? i.name,
    value: score(i.score),
    score: i.score,
    average: i.categoryAverage,
  }));

  return (
    <DashboardCard
      title="Sub-indicators"
      action={<PlaridelVsAverageLegend tick="vertical" />}
      className={className}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          aria-label="Pillar"
          value={pillar.key}
          onChange={(e) =>
            onSelect(pillars.find((p) => p.key === e.target.value) ?? pillar)
          }
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
      <p className="mt-3 text-sm">
        <span className="font-medium">{pillar.name}</span>{" "}
        <span className="text-muted-foreground">{pillarInfo[pillar.key]}</span>
      </p>
      <div className="relative mt-4">
        <ChartContainer config={config} className="aspect-auto h-96 w-full">
          {/* A negative gap lays the average tick over Plaridel's bar instead of beside it. */}
          <BarChart
            data={data}
            layout="vertical"
            barGap={-BAR}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" domain={[0, 2]} hide />
            <YAxis
              yAxisId="names"
              type="category"
              dataKey="label"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              width={196}
              tick={(props) => (
                <NameTick
                  {...props}
                  fullName={(l) => data.find((d) => d.label === l)?.name}
                  onInfo={setInfo}
                />
              )}
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
                  labelFormatter={(_, payload) => {
                    const name: string | undefined =
                      payload?.[0]?.payload?.name;
                    return (
                      <div className="max-w-56">
                        <p>{name}</p>
                        {name && indicatorInfo[name] && (
                          <p className="mt-0.5 font-normal text-muted-foreground">
                            {indicatorInfo[name]}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              yAxisId="names"
              dataKey="score"
              fill="var(--color-score)"
              barSize={BAR}
              radius={[0, 4, 4, 0]}
            />
            <Bar
              yAxisId="names"
              dataKey="average"
              barSize={BAR}
              shape={averageTick("rows")}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
        {info && (
          <div
            role="tooltip"
            className="animate-in fade-in-0 pointer-events-none absolute z-50 w-56 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
            style={{ left: info.x - 8, top: info.y + 12 }}
          >
            <p className="font-medium">{info.name}</p>
            <p className="mt-0.5 text-muted-foreground">
              {indicatorInfo[info.name]}
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
