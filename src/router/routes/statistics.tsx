import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { StatisticsPage } from "@/features/statistics/statistics-page";

export const statisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/statistics",
  validateSearch: (search: Record<string, unknown>): { barangay?: string } => ({
    barangay: typeof search.barangay === "string" ? search.barangay : undefined,
  }),
  component: StatisticsPage,
});
