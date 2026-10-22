import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { HotlinesPage } from "@/features/hotlines/hotlines-page";

export const hotlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotlines",
  component: HotlinesPage,
});

// The old contact page was replaced by the hotlines directory.
export const contactRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  beforeLoad: () => {
    throw redirect({ to: "/hotlines" });
  },
});
