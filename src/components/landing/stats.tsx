import { site } from "@/site.config";

export function Stats() {
  return (
    <section className="border-y border-line bg-surface">
      <dl className="container-page grid grid-cols-2 gap-8 py-12 text-center md:grid-cols-4">
        {site.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="text-3xl font-bold tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
