// TODO: verify — placeholder text, have it reviewed before launch.
import { PageHeader } from "@/components/shared/page-header";
import { site } from "@/site.config";

export function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Use" subtitle={`The ground rules for using ${site.name}.`} />
      <section className="container-page prose-section">
        <h2>For information only</h2>
        <p>
          {site.disclaimer} Everything here is shared to help you find services and understand the town, and it may
          contain mistakes or be out of date. Always confirm requirements, fees and schedules with the concerned office
          before acting on them.
        </p>
        <h2>Where the data comes from</h2>
        <p>
          Figures and listings come from public sources such as the Philippine Statistics Authority, the DTI and the
          Bureau of Local Government Finance. They remain subject to those sources&apos; own terms, and each Statistics
          page names its source.
        </p>
        <h2>Links to other sites</h2>
        <p>
          We link to government portals and other websites for your convenience. We don&apos;t control them and
          aren&apos;t responsible for what they publish.
        </p>
        <h2>Changes</h2>
        <p>These terms may change as the site grows. Continuing to use the site means you accept the current version.</p>
      </section>
    </>
  );
}
