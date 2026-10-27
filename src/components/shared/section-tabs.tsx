import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "cn";

type Tab = { label: string; to: string };

// Pill tabs for the pages of a section (e.g. Statistics, Government). The green highlight slides to the current page;
// equal-width tabs let it move by whole tab widths.
export function SectionTabs({ label, tabs }: { label: string; tabs: readonly Tab[] }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = Math.max(
    0,
    tabs.findIndex((t) => pathname.startsWith(t.to)),
  );

  return (
    <nav
      aria-label={label}
      className="relative inline-grid w-fit auto-cols-fr grid-flow-col rounded-full border border-line bg-muted/50 p-1"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-full bg-brand shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{
          width: `calc((100% - 0.5rem) / ${tabs.length})`,
          transform: `translateX(${active * 100}%)`,
        }}
      />
      {tabs.map((t, i) => (
        <Link
          key={t.to}
          to={t.to}
          resetScroll={false}
          className={cn(
            "relative z-10 rounded-full px-5 py-1.5 text-center text-sm font-medium transition-colors duration-300",
            i === active ? "text-white" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
