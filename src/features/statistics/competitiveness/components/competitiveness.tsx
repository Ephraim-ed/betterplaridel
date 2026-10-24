import { getRouteApi } from "@tanstack/react-router";
import { StatisticsDashboard } from "@/features/statistics/components/statistics-dashboard";
import { category, CMCI_YEAR, pillars, type Pillar } from "../data";
import { BulacanCard } from "./bulacan-card";
import { BulacanRanking } from "./bulacan-ranking";
import { IndicatorChart } from "./indicator-chart";
import { OverallCard } from "./overall-card";
import { PillarChart } from "./pillar-chart";
import { RankCard } from "./rank-card";

const route = getRouteApi("/statistics/competitiveness");

// The pillar whose sub-indicators are shown lives in the URL (?pillar=innovation) so a view can be shared.
export function Competitiveness() {
  const { pillar: key } = route.useSearch();
  const navigate = route.useNavigate();
  const pillar = pillars.find((p) => p.key === key) ?? pillars[0];

  const select = (p: Pillar) => navigate({ search: { pillar: p.key }, replace: true, resetScroll: false });

  return (
    <StatisticsDashboard
      status={
        <>
          Plaridel (Bulacan) in the {CMCI_YEAR} Competitiveness Index, ranked among {category.count} {category.name}.
        </>
      }
      controls={
        <a
          href="https://cmci.dti.gov.ph/lgu-profile.php?lgu=Plaridel+(BU)"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Plaridel on the CMCI site ↗
        </a>
      }
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
