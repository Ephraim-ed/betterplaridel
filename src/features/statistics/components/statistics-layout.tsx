import { createContext, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { SectionTabs } from "@/components/shared/section-tabs";
import { statisticsModules } from "@/site.config";

// The empty slot on the tab row, handed to whichever module is showing so it can portal its own actions in.
export const TabActionsContext = createContext<HTMLElement | null>(null);

// Parent of every statistics module. It stays mounted while switching modules, so the tab highlight can slide.
export function StatisticsLayout() {
  const [tabActions, setTabActions] = useState<HTMLElement | null>(null);

  return (
    <>
      <PageHeader
        title="Statistics"
        subtitle="Open data on Plaridel, Bulacan: who lives here, how big the town is, and how it ranks nationally."
      />
      <section aria-label="Statistics dashboard" className="container-page flex flex-col gap-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTabs label="Statistics modules" tabs={statisticsModules} />
          <div ref={setTabActions} className="flex items-center gap-3" />
        </div>
        <TabActionsContext.Provider value={tabActions}>
          <Outlet />
        </TabActionsContext.Provider>
      </section>
    </>
  );
}
