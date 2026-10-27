import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { GovernmentLayout } from "@/features/government/government-layout";
import { OfficialsPage } from "@/features/government/officials/officials-page";
import { DepartmentsPage } from "@/features/government/departments/departments-page";
import { BarangaysPage } from "@/features/government/barangays/barangays-page";

// /government has no page of its own: the shared header and tabs, with each section below.
export const governmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/government",
  component: GovernmentLayout,
});

const governmentIndexRoute = createRoute({
  getParentRoute: () => governmentRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/government/officials" });
  },
});

const officialsRoute = createRoute({
  getParentRoute: () => governmentRoute,
  path: "/officials",
  // Cards by default; ?view=chart opens the org chart, so either view can be shared.
  validateSearch: (search: Record<string, unknown>): { view?: "chart" } => ({
    view: search.view === "chart" ? "chart" : undefined,
  }),
  component: OfficialsPage,
});

const departmentsRoute = createRoute({
  getParentRoute: () => governmentRoute,
  path: "/departments",
  component: DepartmentsPage,
});

const barangaysRoute = createRoute({
  getParentRoute: () => governmentRoute,
  path: "/barangays",
  component: BarangaysPage,
});

export const governmentTree = governmentRoute.addChildren([
  governmentIndexRoute,
  officialsRoute,
  departmentsRoute,
  barangaysRoute,
]);

// Officials used to live at /officials.
export const officialsRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/officials",
  beforeLoad: () => {
    throw redirect({ to: "/government/officials" });
  },
});
