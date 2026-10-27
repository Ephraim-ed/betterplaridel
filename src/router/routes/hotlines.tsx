import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { HotlinesPage } from "@/features/hotlines/hotlines-page";

export const hotlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotlines",
  // ?q= prefills the search, e.g. from the home page's search box.
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
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
