import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { HomePage } from "@/features/home/home-page";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
