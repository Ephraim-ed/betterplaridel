import { createContext, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "cn";
import { PageHeader } from "@/components/shared/page-header";
import { statisticsModules } from "@/site.config";

// The empty slot on the tab row, handed to whichever module is showing so it can portal its own actions in.
export const TabActionsContext = createContext<HTMLElement | null>(null);

// Parent of every statistics module. It stays mounted while switching modules, so the tab highlight can slide.
export function StatisticsLayout() {
  const [tabActions, setTabActions] = useState<HTMLElement | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = Math.max(
    0,
    statisticsModules.findIndex((m) => pathname.startsWith(m.to)),
  );

  return (
    <>
      <PageHeader
        title="Statistics"
        subtitle="Open data on Plaridel, Bulacan: who lives here, how big the town is, and how it ranks nationally."
      />
      <section aria-label="Statistics dashboard" className="container-page flex flex-col gap-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Equal-width tabs so the highlight can slide by whole tab widths. */}
          <nav
            aria-label="Statistics modules"
            className="relative inline-grid w-fit auto-cols-fr grid-flow-col rounded-full border border-line bg-muted/50 p-1"
          >
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 rounded-full bg-brand shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                width: `calc((100% - 0.5rem) / ${statisticsModules.length})`,
                transform: `translateX(${active * 100}%)`,
              }}
            />
            {statisticsModules.map((m, i) => (
              <Link
                key={m.to}
                to={m.to}
                resetScroll={false}
                className={cn(
                  "relative z-10 rounded-full px-5 py-1.5 text-center text-sm font-medium transition-colors duration-300",
                  i === active ? "text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </Link>
            ))}
          </nav>
          <div ref={setTabActions} className="flex items-center gap-3" />
        </div>
        <TabActionsContext.Provider value={tabActions}>
          <Outlet />
        </TabActionsContext.Provider>
      </section>
    </>
  );
}
