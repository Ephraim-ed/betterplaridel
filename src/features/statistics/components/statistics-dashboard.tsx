import { useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "cn";
import { InfoIcon } from "lucide-react";
import { TabActionsContext } from "./statistics-layout";
import { StatisticsTour, type TourStep } from "./statistics-tour";

// Body shared by every statistics module (the header and tabs live in StatisticsLayout): an optional info bar with
// the module's own controls beside it, then the module's cards and a source note.
export function StatisticsDashboard({
  status,
  controls,
  tour,
  source,
  children,
}: {
  status?: ReactNode;
  controls?: ReactNode;
  // `inTabs` puts the quick tour button on the tab row instead of beside the module's controls.
  tour?: { id: string; steps: readonly TourStep[]; inTabs?: boolean };
  source: ReactNode;
  children: ReactNode;
}) {
  // The tab row belongs to the layout above; it hands us its slot.
  const tabActions = useContext(TabActionsContext);

  const tourInTabs = tour?.inTabs;
  const tourBesideControls = tour && !tourInTabs;

  return (
    <div className="flex flex-col gap-4">
      {tour && tourInTabs && tabActions && createPortal(<StatisticsTour id={tour.id} steps={tour.steps} />, tabActions)}
      {(status || controls || tourBesideControls) && (
        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              role="status"
              className="flex min-w-0 flex-1 basis-80 items-start gap-3 rounded-lg border border-brand/25 bg-brand/5 px-4 py-2.5 text-sm text-foreground/80"
            >
              <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
              <p className="flex flex-wrap items-center gap-x-2">{status}</p>
            </div>
          )}
          {(controls || tourBesideControls) && (
            <div className={cn("flex flex-wrap items-center gap-3", !status && "ml-auto")}>
              {controls}
              {tourBesideControls && <StatisticsTour id={tour.id} steps={tour.steps} />}
            </div>
          )}
        </div>
      )}

      {children}

      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  );
}
