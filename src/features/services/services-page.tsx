import { useEffect, useMemo, useRef, useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { cn } from "cn";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { LocationCard } from "./components/location-card";
import { LocationFilters } from "./components/location-filters";
import { ServiceSidebar } from "./components/service-sidebar";
import { ServicesMap } from "./components/services-map";
import { servicesPage } from "./services-content";
import { filterLocations, serviceById, services } from "./services-data";
import { useScrollStops } from "./use-scroll-stops";

const route = getRouteApi("/services");

// The desktop layout (sidebar, list and map side by side) starts at Tailwind's lg breakpoint.
const isDesktop = () => window.matchMedia("(min-width: 64rem)").matches;

export function ServicesPage() {
  const { service: id } = route.useSearch();
  const service = serviceById(id) ?? services[0];
  const { icon: Icon, locations, pins, places } = service;

  // The search and building filter, kept with their service so that switching services clears them.
  const [filters, setFilters] = useState({ service: "", query: "", place: "all" });
  const query = filters.service === service.id ? filters.query : "";
  const place = filters.service === service.id ? filters.place : "all";
  const setQuery = (q: string) => setFilters({ service: service.id, query: q, place });
  const setPlace = (p: string) => setFilters({ service: service.id, query, place: p });

  // The offices that pass the filters (with their index in the full list, which ids and selection use), and their
  // pins. Memoised so the map only refits when the filters change.
  const { visible, visiblePins } = useMemo(() => filterLocations(service, query, place), [service, query, place]);

  // The selected card, kept with its service so that switching services clears it.
  const [selection, setSelection] = useState<{ service: string; index: number }>();
  const selected = selection?.service === service.id ? selection.index : undefined;
  const selectedPin =
    selected !== undefined && visible.some((v) => v.index === selected) ? locations[selected].pin : undefined;
  // The card under the pointer, whose pin the map highlights.
  const [hovered, setHovered] = useState<{ service: string; index: number }>();
  const hoveredPin = hovered?.service === service.id ? locations[hovered.index]?.pin : undefined;
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardId = (i: number) => `location-${service.id}-${i}`;

  // Desktop: wheel scrolling steps between the top of the page, the panel locked under the navbar, and the footer.
  const panelRef = useRef<HTMLElement>(null);
  useScrollStops(panelRef);

  // A newly picked service starts at the top of the scrolling middle column (desktop).
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [service.id]);

  function selectCard(i: number) {
    if (i === selected) return setSelection(undefined);
    setSelection({ service: service.id, index: i });
    // On smaller screens the map sits above the list, so bring it into view.
    if (!isDesktop()) mapRef.current?.scrollIntoView({ block: "center" });
  }

  // A pin selects the first card shown in its building.
  function selectPin(pin?: number) {
    const i = visible.find((v) => v.location.pin === pin)?.index ?? -1;
    if (pin === undefined || i < 0) return setSelection(undefined);
    setSelection({ service: service.id, index: i });
    if (isDesktop()) document.getElementById(cardId(i))?.scrollIntoView({ block: "nearest" });
  }

  return (
    <>
      <PageHeader title={servicesPage.title} subtitle={servicesPage.subtitle} />
      {/* Phones: one column (services, header, map, list) scrolling with the page, the service chips stuck below
          the navbar. Desktop: a panel the height of the screen, with the sidebar and map fixed in place and only
          the middle column (header and list) scrolling. */}
      <section
        ref={panelRef}
        className={cn(
          "mx-auto flex w-full max-w-[72rem] flex-col gap-6 px-4 pb-24",
          // Edge to edge, filling the screen below the 40px navbar.
          "lg:grid lg:h-[calc(100svh-2.5rem)] lg:max-w-none lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:px-6 lg:pb-6",
        )}
      >
        <ServiceSidebar
          current={service.id}
          className={cn(
            "sticky top-10 z-10 -mx-4 border-b border-line bg-background/85 px-4 py-3 backdrop-blur",
            "lg:static lg:mx-0 lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
          )}
        />

        {/* On phones this wrapper drops out of the layout, so the map can sit between the header and the list. */}
        <div
          ref={listRef}
          className="contents lg:block lg:min-h-0 lg:overflow-y-auto lg:px-1.5 lg:pb-4 lg:[scrollbar-width:thin]"
        >
          <header key={service.id} className="flex animate-in items-start gap-4 duration-300 fade-in-0">
            <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl", service.tone)}>
              <Icon size={28} />
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight">{service.title}</h2>
              <p className="mt-1 text-muted-foreground">{service.body}</p>
              {locations.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-brand">
                    {locations.length} {locations.length === 1 ? "location" : "locations"}
                  </span>
                  {pins.length > 0 && ` · ${servicesPage.hint}`}
                </p>
              )}
            </div>
          </header>

          <div className="order-last lg:mt-4">
            {locations.length > 0 ? (
              <>
                {/* On desktop the search stays at the top of the scrolling column. */}
                <LocationFilters
                  locations={locations}
                  places={places}
                  query={query}
                  onQuery={setQuery}
                  place={place}
                  onPlace={setPlace}
                  shown={visible.length}
                  className="mb-4 lg:sticky lg:top-0 lg:z-10 lg:-mx-1.5 lg:bg-background/90 lg:px-1.5 lg:py-2 lg:backdrop-blur"
                />
                {visible.length > 0 ? (
                  <ul key={service.id} className="animate-in space-y-4 duration-300 fade-in-0">
                    {visible.map(({ location: l, index: i }) => (
                      <li key={`${l.place.id}-${l.name}`}>
                        <LocationCard
                          id={cardId(i)}
                          location={l}
                          service={service}
                          selected={i === selected}
                          onSelect={() => selectCard(i)}
                          onHover={(on) => setHovered(on ? { service: service.id, index: i } : undefined)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    art="no-results"
                    heading="h3"
                    title={servicesPage.noMatches.title}
                    className="py-6"
                    actions={
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setFilters({ service: service.id, query: "", place: "all" })}
                      >
                        Clear search and filter
                      </Button>
                    }
                  >
                    {servicesPage.noMatches.body}
                  </EmptyState>
                )}
              </>
            ) : (
              <EmptyState
                key={service.id}
                art="coming-soon"
                heading="h3"
                title={servicesPage.noLocations.title}
                className="py-6"
                actions={
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/hotlines" hash="directory">
                      Open the Municipal Hall directory
                    </Link>
                  </Button>
                }
              >
                {servicesPage.noLocations.body}
              </EmptyState>
            )}
          </div>
        </div>

        <div ref={mapRef} className="scroll-mt-32 lg:h-full">
          <ServicesMap
            pins={visiblePins}
            selected={selectedPin}
            highlighted={hoveredPin}
            onSelect={selectPin}
            className="h-80 lg:h-full"
          />
        </div>
      </section>
    </>
  );
}
