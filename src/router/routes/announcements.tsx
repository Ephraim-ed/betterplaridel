import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root";
import { WorkInProgress } from "@/components/shared/work-in-progress";

export const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/announcements",
  component: () => (
    <WorkInProgress title="Announcements" subtitle="News, advisories and events from the Municipality of Plaridel." />
  ),
});
