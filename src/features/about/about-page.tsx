import { PageHeader } from "@/components/shared/page-header";
import { Cta } from "@/components/shared/cta";
import { site } from "@/site.config";

export function AboutPage() {
  return (
    <>
      <PageHeader title={`About ${site.name}`} subtitle={site.description} />
      <section className="container-page prose-section">
        <h2>Ang Bayan ng Plaridel</h2>
        <p>
          Plaridel is a municipality in the province of Bulacan. It was formerly known as
          Quingua and was renamed in honor of Marcelo H. del Pilar, the Bulakeño
          propagandist who wrote under the pen name &ldquo;Plaridel.&rdquo;
        </p>
        <h2>Why we built this</h2>
        <p>
          Finding the right office, requirements or hotline shouldn&apos;t take a trip to the
          municipal hall. {site.name} gathers that information in one place so every{" "}
          {site.demonym} can get things done faster.
        </p>
        <h2>Disclaimer</h2>
        <p>{site.disclaimer} Always confirm requirements and fees with the concerned office.</p>
      </section>
      <Cta />
    </>
  );
}
