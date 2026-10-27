import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { PrivacyPage } from "@/features/legal/privacy-page";
import { TermsPage } from "@/features/legal/terms-page";

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

export const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
