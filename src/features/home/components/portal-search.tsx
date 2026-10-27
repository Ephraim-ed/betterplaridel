import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, PhoneIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { site } from "@/site.config";
import { serviceId, services } from "@/features/services/services-data";

const popular = services.slice(0, 6);

// Searches the services listed on the home page as you type. "Search the portal" jumps to the first matching
// service, or, when none match, opens the hotlines directory searched for the same words.
export function PortalSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const text = query.trim();
  const q = text.toLowerCase();
  const matches = q ? services.filter((s) => `${s.title} ${s.body}`.toLowerCase().includes(q)) : [];

  return (
    <div>
      <div className="rounded-lg border border-t-4 border-line border-t-brand bg-background p-6 shadow-sm sm:p-7">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (matches[0]) navigate({ to: "/", hash: serviceId(matches[0].title) });
            else navigate({ to: "/hotlines", search: { q: text || undefined } });
          }}
        >
          <label htmlFor="portal-search" className="font-semibold">
            Search {site.name}
          </label>
          <input
            id="portal-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, offices or hotlines"
            className="mt-3 h-14 w-full rounded-md border border-muted-foreground/50 bg-background px-4 text-base outline-none sm:text-lg transition-shadow placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15"
          />
          <Button type="submit" className="mt-3 h-12 rounded-md px-6 text-base font-semibold">
            Search the portal
          </Button>
        </form>

        {q && (
          <div aria-live="polite" className="mt-5 border-t border-line pt-4">
            {matches.length > 0 && (
              <ul className="space-y-1">
                {matches.map((s) => (
                  <li key={s.title}>
                    <Link
                      to="/"
                      hash={serviceId(s.title)}
                      className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted focus-visible:bg-muted"
                    >
                      <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", s.tone)}>
                        <s.icon size={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{s.title}</span>
                        <span className="block text-xs text-muted-foreground">{s.body}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/hotlines"
              search={{ q: text }}
              className="mt-1 flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-muted focus-visible:bg-muted"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-red-50 text-red-600">
                <PhoneIcon aria-hidden className="size-4" />
              </span>
              <span>
                Search offices and hotlines for <span className="font-medium">&ldquo;{text}&rdquo;</span>
              </span>
            </Link>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm font-semibold tracking-wider text-foreground uppercase">Popular services</p>
      <ul className="mt-3 flex flex-wrap items-center gap-2.5">
        {popular.map((s) => (
          <li key={s.title}>
            <Link
              to="/"
              hash={serviceId(s.title)}
              className="block rounded-full border border-line bg-background px-4 py-2 text-sm transition-colors hover:border-brand/50 hover:text-brand"
            >
              {s.title}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/"
            hash="services"
            className="group inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-brand-deep"
          >
            All services
            <ArrowRightIcon aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
