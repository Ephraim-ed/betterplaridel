export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="container-page py-20 text-center sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
    </section>
  );
}
