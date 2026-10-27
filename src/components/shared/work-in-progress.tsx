import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

// Placeholder for a page that has its route but not its content yet.
export function WorkInProgress({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="container-page pb-24">
        <EmptyState
          art="maintenance"
          title="Work in progress"
          actions={
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">Back to home</Link>
            </Button>
          }
        >
          We&apos;re still building this page. Check back soon.
        </EmptyState>
      </section>
    </>
  );
}
