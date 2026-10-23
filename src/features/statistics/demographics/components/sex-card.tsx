import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { chartColors } from "../colors";
import { fmt, municipality, type Barangay, type SexBreakdown } from "../data";
import { DashboardCard } from "./dashboard-card";
import { RollingNumber } from "./rolling-number";
import { segmentLabel } from "./segment-label";

const config = {
  male: { label: "Male", color: chartColors.male },
  female: { label: "Female", color: chartColors.female },
} satisfies ChartConfig;

export function SexCard({ barangay }: { barangay?: Barangay }) {
  const sex = (barangay ?? municipality).sex;

  return (
    <DashboardCard title="Population by sex" action="2020 census">
      {sex ? (
        <SexChart sex={sex} />
      ) : (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line p-4 text-center text-xs text-muted-foreground">
          {barangay
            ? "The census counts used here give only each barangay's total population, not a male and female split."
            : "Male and female counts for Plaridel aren't available here yet."}
        </p>
      )}
    </DashboardCard>
  );
}

function SexChart({ sex }: { sex: SexBreakdown }) {
  const share = (n: number) => fmt.percent(n / (sex.male + sex.female));

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <dl className="grid grid-cols-2 gap-2">
        {(["male", "female"] as const).map((key) => (
          <div key={key}>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-[2px]" style={{ backgroundColor: config[key].color }} />
              {config[key].label}
            </dt>
            <dd className="text-2xl leading-tight font-semibold tracking-tight">
              <RollingNumber value={sex[key]} />
            </dd>
          </div>
        ))}
      </dl>
      <ChartContainer config={config} className="aspect-auto h-8 w-full">
        <BarChart data={[sex]} layout="vertical" stackOffset="expand" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" hide />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="male" stackId="sex" fill="var(--color-male)" stroke="var(--card)" strokeWidth={2} barSize={24} radius={[4, 0, 0, 4]}>
            <LabelList dataKey="male" content={segmentLabel(() => share(sex.male), "#ffffff")} />
          </Bar>
          <Bar dataKey="female" stackId="sex" fill="var(--color-female)" stroke="var(--card)" strokeWidth={2} barSize={24} radius={[0, 4, 4, 0]}>
            <LabelList dataKey="female" content={segmentLabel(() => share(sex.female), "#0f172a")} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">
        {Math.round((sex.male / sex.female) * 100)} males for every 100 females
      </p>
    </div>
  );
}
