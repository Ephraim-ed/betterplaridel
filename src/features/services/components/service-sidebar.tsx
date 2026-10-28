import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { AnimateIcon } from "@animate-ui/react/icons";
import { cn } from "cn";
import { chipClass } from "@/components/shared/chip";
import { services } from "../services-data";

// Every service: a scrolling row of chips on phones and tablets, a list with icons on desktop.
export function ServiceSidebar({ current, className }: { current: string; className?: string }) {
  const chips = useRef<HTMLUListElement>(null);

  // Scroll the chip row so the current service's chip is in the middle of it.
  useEffect(() => {
    const row = chips.current;
    const chip = row?.querySelector<HTMLElement>("[aria-current]");
    if (row && chip) row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, [current]);

  return (
    <nav aria-label="Services" className={className}>
      <ul ref={chips} className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {services.map((s) => (
          <li key={s.id} className="shrink-0">
            <Link
              to="/services"
              search={{ service: s.id }}
              resetScroll={false}
              aria-current={s.id === current ? "page" : undefined}
              className={chipClass(s.id === current)}
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="hidden space-y-1 lg:block">
        {services.map(({ id, icon: Icon, title, locations }) => {
          const active = id === current;
          return (
            <li key={id}>
              <AnimateIcon animateOnHover asChild>
                <Link
                  to="/services"
                  search={{ service: id }}
                  resetScroll={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active ? "bg-brand/10 font-medium text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon size={18} />
                  {title}
                  {/* How many places offer it, or "Soon" while none are listed. */}
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto rounded-full px-1.5 text-xs tabular-nums",
                      locations.length === 0 && "bg-muted text-muted-foreground",
                      locations.length > 0 && (active ? "text-brand" : "text-muted-foreground/70"),
                    )}
                  >
                    {locations.length || "Soon"}
                  </span>
                </Link>
              </AnimateIcon>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
