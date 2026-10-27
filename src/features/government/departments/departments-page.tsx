import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function DepartmentsPage() {
  return (
    <section className="container-page pb-24">
      <EmptyState
        art="maintenance"
        title="Departments are coming soon"
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/hotlines" hash="directory">
              Open the Municipal Hall directory
            </Link>
          </Button>
        }
      >
        Who runs each municipal office, what it handles and how to reach it. Until then, every office&apos;s local
        number is in the Municipal Hall directory.
      </EmptyState>
    </section>
  );
}
