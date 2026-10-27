import { DashboardCard, StatBody } from "@/features/statistics/components/dashboard-card";
import { RollingNumber } from "@/features/statistics/components/rolling-number";
import { bulacan } from "../competitiveness-data";
import { ordinalSuffix, score } from "../format";

const position = bulacan.findIndex((l) => l.name === "Plaridel") + 1;
const municipalities = bulacan.filter((l) => l.category.includes("Municipalities"));
const municipalityPosition = municipalities.findIndex((l) => l.name === "Plaridel") + 1;
const average = bulacan.reduce((sum, l) => sum + l.score, 0) / bulacan.length;

export function BulacanCard({ className }: { className?: string }) {
  const facts = [
    { label: "Among municipalities", value: `${municipalityPosition}${ordinalSuffix(municipalityPosition)} of ${municipalities.length}` },
    { label: "Bulacan average", value: score(average) },
    { label: "Highest", value: `${bulacan[0].name}, ${score(bulacan[0].score)}` },
  ];

  return (
    <DashboardCard title="In Bulacan" action="By overall score" className={className}>
      <StatBody
        value={
          <>
            <RollingNumber value={position} />
            <span className="text-xl">{ordinalSuffix(position)}</span>
          </>
        }
        notes={<p>of {bulacan.length} cities and municipalities in Bulacan</p>}
        side={
          <dl className="flex h-full flex-col justify-center gap-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        }
      />
    </DashboardCard>
  );
}
