import { Link, useRouter } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

// Shown in place of a page that crashed; the navbar and footer stay usable.
export function ErrorPage() {
  const router = useRouter();

  return (
    <section className="container-page py-16 sm:py-24">
      <EmptyState
        art="maintenance"
        heading="h1"
        title="Something went wrong"
        actions={
          <>
            {/* Re-renders the page, which also clears the error. */}
            <Button size="lg" className="mt-2 h-11 rounded-full px-6" onClick={() => router.invalidate()}>
              Try again
            </Button>
            <Button asChild size="lg" variant="outline" className="mt-2 h-11 rounded-full px-6">
              <Link to="/">Back home</Link>
            </Button>
          </>
        }
      >
        This page ran into a problem on our end. Try again, or come back in a little while.
      </EmptyState>
    </section>
  );
}
