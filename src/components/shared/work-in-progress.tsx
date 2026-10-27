import { Link } from "@tanstack/react-router";
import { ConstructionIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

// Placeholder for a page that has its route but not its content yet.
export function WorkInProgress({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="container-page pb-24">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-line bg-muted/30 px-6 py-12 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
            <ConstructionIcon aria-hidden className="size-7" />
          </span>
          <h2 className="mt-4 text-xl font-bold tracking-tight">Work in progress</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re still building this page. Check back soon.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
