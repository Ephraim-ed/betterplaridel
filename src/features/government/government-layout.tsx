import { Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { SectionTabs } from "@/components/shared/section-tabs";
import { governmentPages } from "@/site.config";

// Tab labels are shortened to fit a phone screen; the navbar dropdown keeps the full names.
const tabs = governmentPages.map((p) => ({ ...p, label: p.label.replace("Municipal ", "") }));

// Parent of every Government page. It stays mounted while switching pages, so the tab highlight can slide.
export function GovernmentLayout() {
  return (
    <>
      <PageHeader
        title="Government"
        subtitle="Who leads Plaridel, the offices that serve it, and the officials of its 19 barangays."
      />
      <div className="container-page mb-8">
        <SectionTabs label="Government pages" tabs={tabs} />
      </div>
      <Outlet />
    </>
  );
}
