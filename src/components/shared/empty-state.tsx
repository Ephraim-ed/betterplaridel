import type { ReactNode } from "react";
import { cn } from "cn";

// Illustrations in public/, drawn in the logo's greens and yellow.
const illustrations = {
  "not-found": "/betterplaridel-404.svg",
  "coming-soon": "/betterplaridel-coming-soon.svg",
  maintenance: "/betterplaridel-maintenance.svg",
  "no-results": "/betterplaridel-no-results.svg",
} as const;

// A whole page (h1), a page section (h2) or a message inside a section (h3).
const sizes = {
  h1: { art: "max-w-sm", title: "text-4xl", body: "mt-4" },
  h2: { art: "max-w-xs", title: "text-2xl", body: "mt-2" },
  h3: { art: "max-w-56", title: "text-lg", body: "mt-1 text-sm" },
};

// An illustration with a short message, for a page or list that has nothing to show.
export function EmptyState({
  art,
  title,
  heading: Heading = "h2",
  actions,
  children,
  className,
}: {
  art: keyof typeof illustrations;
  title: ReactNode;
  heading?: keyof typeof sizes;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const size = sizes[Heading];
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={illustrations[art]}
        alt=""
        width={800}
        height={600}
        className={cn("w-full animate-in duration-500 fade-in-0 zoom-in-95 motion-reduce:animate-none", size.art)}
      />
      <Heading className={cn("mt-2 max-w-full font-bold tracking-tight break-words", size.title)}>{title}</Heading>
      {children && <p className={cn("max-w-md text-muted-foreground", size.body)}>{children}</p>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
