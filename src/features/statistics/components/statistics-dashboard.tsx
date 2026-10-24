import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { statisticsModules } from "@/site.config";

// Frame shared by every statistics module: the module tabs, a status line and the module's own controls,
// then the module's cards and a source note. With `fit`, it is exactly one screen tall on desktop
// (the viewport minus the navbar: 4rem plus its 1px border); otherwise the page scrolls normally.
export function StatisticsDashboard({
  status,
  controls,
  source,
  fit = false,
  children,
}: {
  status: ReactNode;
  controls?: ReactNode;
  source: ReactNode;
  fit?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby="statistics"
      className={cn(
        "container-page flex flex-col gap-3 py-4",
        fit ? "lg:h-[calc(100dvh-4rem-1px)] lg:min-h-[36rem]" : "pb-16",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="statistics" className="sr-only">
            Statistics
          </h1>
          <nav aria-label="Statistics" className="flex flex-wrap gap-x-5">
            {statisticsModules.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="text-xl font-bold tracking-tight text-muted-foreground decoration-brand decoration-2 underline-offset-8 transition-colors hover:text-foreground sm:text-2xl"
                activeProps={{ className: "!text-foreground underline" }}
              >
                {m.label}
              </Link>
            ))}
          </nav>
          <p aria-live="polite" className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            {status}
          </p>
        </div>
        {controls}
      </div>

      {children}

      <p className="text-xs text-muted-foreground lg:truncate">{source}</p>
    </section>
  );
}
