import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { homeRoute } from "./routes/home";
import { aboutRoute } from "./routes/about";
import { hotlinesRoute, contactRedirectRoute } from "./routes/hotlines";
import { statisticsRoute } from "./routes/statistics";
import { NotFound } from "./not-found";

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, hotlinesRoute, statisticsRoute, contactRedirectRoute]);

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
