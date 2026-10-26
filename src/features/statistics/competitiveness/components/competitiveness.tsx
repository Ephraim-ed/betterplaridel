import { getRouteApi } from "@tanstack/react-router";
import { StatisticsDashboard } from "@/features/statistics/components/statistics-dashboard";
import { category, CMCI_YEAR, pillars, type Pillar } from "../data";
import { ordinalSuffix, score } from "../format";
import { BulacanCard } from "./bulacan-card";
import { BulacanRanking } from "./bulacan-ranking";
import { IndicatorChart } from "./indicator-chart";
import { OverallCard } from "./overall-card";
import { PillarChart } from "./pillar-chart";
import { RankCard } from "./rank-card";

const byRank = [...pillars].sort((a, b) => a.rank - b.rank);
const strongest = byRank[0];
const weakest = byRank[byRank.length - 1];

const aboveAverage = pillars.filter((p) => p.score > p.categoryAverage).length;

const highlights = [
  {
    label: "Strongest pillar",
    value: strongest.name,
    note: `${strongest.rank}${ordinalSuffix(strongest.rank)} of ${category.count} · ${score(strongest.score)} of 20`,
    dot: "bg-brand",
  },
  {
    label: "Weakest pillar",
    value: weakest.name,
    note: `${weakest.rank}${ordinalSuffix(weakest.rank)} of ${category.count} · ${score(weakest.score)} of 20`,
    dot: "bg-amber-500",
  },
  {
    label: "Above category average",
    value: `${aboveAverage} of ${pillars.length} pillars`,
    note: `${CMCI_YEAR} CMCI, ${category.name}`,
    dot: "bg-slate-400",
  },
];

const tourSteps = [
  {
    graphic: "cmci",
    title: "What is the CMCI?",
    body: `The Cities and Municipalities Competitiveness Index is the DTI's yearly ranking of local governments. This page shows Plaridel's ${CMCI_YEAR} results against ${category.count} ${category.name}.`,
  },
  {
    graphic: "scores",
    title: "Scores and ranks",
    body: "The overall score is out of 100. It is built from five pillars worth 20 points each. A rank of 1st is the best in the category, so a lower rank number is better.",
  },
  {
    graphic: "pillars",
    title: "Pillar scores",
    body: "On the chart, the green line is Plaridel and the yellow line is the category average. Where green sits above yellow, Plaridel is ahead of the average. Click a pillar to look inside it.",
  },
  {
    graphic: "indicators",
    title: "Sub-indicators",
    body: "Each pillar has ten sub-indicators scored from 0 to 2. A bar that reaches past the grey tick beats the category average. Hover the i beside a label to see what it measures.",
  },
] as const;

const route = getRouteApi("/statistics/competitiveness");

// The pillar whose sub-indicators are shown lives in the URL (?pillar=innovation) so a view can be shared.
export function Competitiveness() {
  const { pillar: key } = route.useSearch();
  const navigate = route.useNavigate();
  const pillar = pillars.find((p) => p.key === key) ?? pillars[0];

  const select = (p: Pillar) => navigate({ search: { pillar: p.key }, replace: true, resetScroll: false });

  return (
    <StatisticsDashboard
      tour={{ id: "competitiveness", steps: tourSteps, inTabs: true }}
      source={
        <>
          Source: Department of Trade and Industry,{" "}
          <a
            href="https://cmci.dti.gov.ph/data-portal.php"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            CMCI data portal
          </a>{" "}
          ({CMCI_YEAR}). Category averages are computed from the same {CMCI_YEAR} rankings.
        </>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.label} className="rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <span aria-hidden className={`size-2 rounded-full ${h.dot}`} />
              {h.label}
            </dt>
            <dd className="mt-1 text-lg leading-tight font-semibold tracking-tight">{h.value}</dd>
            <dd className="text-xs text-muted-foreground">{h.note}</dd>
          </div>
        ))}
      </dl>

      {/* Desktop: three headline cards, then the pillar and sub-indicator charts beside a tall Bulacan ranking. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverallCard className="lg:h-52" />
        <RankCard className="lg:h-52" />
        <BulacanCard className="sm:col-span-2 lg:col-span-1 lg:h-52" />
        <PillarChart selected={pillar} onSelect={select} className="sm:col-span-2" />
        <BulacanRanking className="sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-2" />
        <IndicatorChart pillar={pillar} onSelect={select} className="sm:col-span-2" />
      </div>
    </StatisticsDashboard>
  );
}
