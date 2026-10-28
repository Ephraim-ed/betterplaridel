// TODO: verify — placeholder text, have it reviewed before launch.
import { PageHeader } from "@/components/shared/page-header";
import { site } from "@/site.config";

export function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle={`What ${site.name} does and doesn't collect about you.`} />
      <section className="container-page prose-section">
        <h2>No accounts, no tracking</h2>
        <p>
          You don&apos;t need an account to use {site.name}, and there are no forms to fill in. We don&apos;t use
          analytics, advertising trackers or cookies.
        </p>
        <h2>What your browser remembers</h2>
        <p>
          Your browser keeps a small note once you&apos;ve seen the quick tour on a Statistics page, so it doesn&apos;t
          open again. It stays on your device and is never sent to us. Clearing your browser&apos;s site data removes it.
        </p>
        <h2>Weather and exchange rates</h2>
        <p>
          The weather and exchange rates at the top of each page come from Open-Meteo and Frankfurter. Your browser asks
          them directly, so like any website you visit they see your IP address. Nothing else is sent to them.
        </p>
        <h2>Maps</h2>
        <p>
          The map on the Services page is loaded from Google Maps. Like any website you visit, Google sees your IP
          address and browser details, and handles them under Google&apos;s own privacy policy.
        </p>
        <h2>Server logs</h2>
        {/* TODO: verify — name the hosting provider once it's decided. */}
        <p>
          Like most websites, our hosting provider may keep standard logs, such as IP addresses and the pages requested,
          to keep the site running and secure.
        </p>
        <h2>Links to other sites</h2>
        <p>Government portals and other sites we link to have their own privacy policies.</p>
      </section>
    </>
  );
}
