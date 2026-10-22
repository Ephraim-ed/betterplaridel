import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { OfficialsPage } from "@/features/officials/officials-page";

export const officialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/officials",
  component: OfficialsPage,
});
