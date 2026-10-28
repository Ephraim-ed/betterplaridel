import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { ServicesPage } from "@/features/services/services-page";
import { serviceById } from "@/features/services/services-data";

export const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  // ?service= picks the service to show, e.g. /services?service=health-services; unknown ids show the first one.
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" && serviceById(search.service) ? search.service : undefined,
  }),
  component: ServicesPage,
});
