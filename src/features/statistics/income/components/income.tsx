import { StatisticsDashboard } from "@/features/statistics/components/statistics-dashboard";
import { FISCAL_YEAR } from "../income-data";
import { BulacanIncome } from "./bulacan-income";
import { IncomeBreakdown } from "./income-breakdown";
import { IncomeCard } from "./income-card";
import { LocalRevenueCard } from "./local-revenue-card";
import { SelfRelianceCard } from "./self-reliance-card";

const tourSteps = [
  {
    graphic: "income",
    title: "What is annual regular income?",
    body: `It is the money Plaridel's government can count on every year: the taxes and fees it collects, its share of national taxes, and interest. Loans, grants and other one-time money are left out. The figures are for FY ${FISCAL_YEAR} and still preliminary.`,
  },
  {
    graphic: "reliance",
    title: "Self-reliance",
    body: "Self-reliance is the share of that income the town raises on its own. The rest comes mostly from the National Tax Allotment, its share of national taxes. Each dot on the strip is a Bulacan municipality, and the yellow line is the national median.",
  },
  {
    graphic: "sources",
    title: "Where the money comes from",
    body: "The breakdown lists every source on one scale, from business taxes to fees. Hover the i beside a source to see what it is.",
  },
  {
    graphic: "compare",
    title: "Compared with Bulacan",
    body: "Each bar splits a municipality's income into money raised locally (green) and the national allotment (yellow). Switch to Share to rank the towns by self-reliance.",
  },
] as const;

export function Income() {
  return (
    <StatisticsDashboard
      tour={{ id: "income", steps: tourSteps, inTabs: true }}
      source={
        <>
          Source: Bureau of Local Government Finance,{" "}
          <a
            href="https://data.bettergov.ph/datasets/9/resources/31"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Annual Regular Income and Dependencies by LGU
          </a>{" "}
          (FY {FISCAL_YEAR}, preliminary, extracted March 17, 2025). Rankings are computed from the same data. The
          per-resident figure uses the 2020 census population.
        </>
      }
    >
      {/* Desktop: three headline cards, then the full breakdown beside the Bulacan comparison. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <IncomeCard className="lg:h-52" />
        <SelfRelianceCard className="lg:h-52" />
        <LocalRevenueCard className="sm:col-span-2 lg:col-span-1 lg:h-52" />
        <IncomeBreakdown className="sm:col-span-2" />
        <BulacanIncome className="sm:col-span-2 lg:col-span-1" />
      </div>
    </StatisticsDashboard>
  );
}
