import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { WorkInProgress } from "@/components/shared/work-in-progress";

export const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: () => (
    <WorkInProgress title="Services" subtitle="Requirements, fees and steps for the municipal hall's services." />
  ),
});
