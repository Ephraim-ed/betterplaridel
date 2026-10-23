import { PageHeader } from "@/components/shared/page-header";
import { OrgChart } from "./components/org-chart";
import { SOURCE, TERM } from "./data";

export function OfficialsPage() {
  return (
    <>
      <PageHeader
        title="Municipal Officials"
        subtitle={`Who leads Plaridel for the ${TERM} term. Click an official for details. Use Show / Hide to fold a group, and scroll or pinch to zoom.`}
      />
      <section className="pb-24">
        {/* The chart spans the full screen width; the note below keeps the normal page width. */}
        <div className="px-4 sm:px-6">
          <OrgChart />
        </div>
        <p className="container-page mt-4 text-sm text-muted-foreground">
          Source:{" "}
          <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
            {SOURCE.label}
          </a>
          .
        </p>
      </section>
    </>
  );
}
