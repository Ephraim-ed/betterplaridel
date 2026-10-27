import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <section className="container-page py-16 sm:py-24">
      <EmptyState
        art="not-found"
        heading="h1"
        title="Page not found"
        actions={
          <Button asChild size="lg" className="mt-2 h-11 rounded-full px-6">
            <Link to="/">Back home</Link>
          </Button>
        }
      >
        The page you&apos;re looking for doesn&apos;t exist.
      </EmptyState>
    </section>
  );
}
