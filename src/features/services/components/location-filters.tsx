import { SearchIcon } from "lucide-react";
import { cn } from "cn";
import { chipClass } from "@/components/shared/chip";
import { Input } from "@/components/ui/input";
import { servicesPage } from "../services-content";
import type { Place, ServiceLocation } from "../services-data";

// Search box and building filter above a service's offices. The building chips only show when the service is
// offered in more than one building.
export function LocationFilters({
  locations,
  places,
  query,
  onQuery,
  place,
  onPlace,
  shown,
  className,
}: {
  locations: ServiceLocation[];
  places: Place[];
  query: string;
  onQuery: (query: string) => void;
  place: string;
  onPlace: (place: string) => void;
  shown: number;
  className?: string;
}) {
  const filtered = shown !== locations.length;
  const chips = [
    { id: "all", name: servicesPage.search.allPlaces, count: locations.length },
    ...places.map((p) => ({ ...p, count: locations.filter((l) => l.place.id === p.id).length })),
  ];

  return (
    <div role="search" className={className}>
      <div className="relative">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={servicesPage.search.placeholder}
          aria-label={servicesPage.search.label}
          className="h-10 bg-background pl-9"
        />
      </div>

      {places.length > 1 && (
        <div role="group" aria-label="Filter by building" className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={place === c.id}
              onClick={() => onPlace(c.id)}
              className={cn(chipClass(place === c.id), "h-8 px-3 text-[13px]")}
            >
              {c.name}
              <span className="ml-1.5 text-xs tabular-nums opacity-70">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty (and zero-height) until something is filtered, but always present so the change is announced. */}
      <p aria-live="polite" className="text-xs text-muted-foreground [&:not(:empty)]:mt-2">
        {filtered ? `Showing ${shown} of ${locations.length} offices` : ""}
      </p>
    </div>
  );
}
