import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { homeRoute } from "./routes/home";
import { aboutRoute } from "./routes/about";
import { servicesRoute } from "./routes/services";
import { announcementsRoute } from "./routes/announcements";
import { hotlinesRoute, contactRedirectRoute } from "./routes/hotlines";
import { governmentTree, officialsRedirectRoute } from "./routes/government";
import { privacyRoute, termsRoute } from "./routes/legal";
import {
  competitivenessRoute,
  demographicsRoute,
  incomeRoute,
  statisticsIndexRoute,
  statisticsRoute,
} from "./routes/statistics";
import { NotFound } from "./not-found";

const routeTree = rootRoute.addChildren([
  homeRoute,
  servicesRoute,
  announcementsRoute,
  aboutRoute,
  hotlinesRoute,
  governmentTree,
  statisticsRoute.addChildren([statisticsIndexRoute, demographicsRoute, competitivenessRoute, incomeRoute]),
  termsRoute,
  privacyRoute,
  contactRedirectRoute,
  officialsRedirectRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
