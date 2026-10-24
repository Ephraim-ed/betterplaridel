import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { Competitiveness } from "@/features/statistics/competitiveness/components/competitiveness";
import { Demographics } from "@/features/statistics/demographics/components/demographics";

// Statistics is a parent for its modules; /statistics itself opens the first one.
export const statisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/statistics",
});

export const statisticsIndexRoute = createRoute({
  getParentRoute: () => statisticsRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/statistics/demographics", replace: true });
  },
});

export const demographicsRoute = createRoute({
  getParentRoute: () => statisticsRoute,
  path: "demographics",
  validateSearch: (search: Record<string, unknown>): { barangay?: string } => ({
    barangay: typeof search.barangay === "string" ? search.barangay : undefined,
  }),
  component: Demographics,
});

export const competitivenessRoute = createRoute({
  getParentRoute: () => statisticsRoute,
  path: "competitiveness",
  validateSearch: (search: Record<string, unknown>): { pillar?: string } => ({
    pillar: typeof search.pillar === "string" ? search.pillar : undefined,
  }),
  component: Competitiveness,
});
