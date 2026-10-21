import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { homeRoute } from "./routes/home";
import { aboutRoute } from "./routes/about";
import { contactRoute } from "./routes/contact";
import { NotFound } from "./routes/not-found";

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, contactRoute]);

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
