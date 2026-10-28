import { ArrowUpRightIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cn } from "cn";
import { directionsUrl, type Service, type ServiceLocation } from "../services-data";

const action =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-colors lg:px-2.5 lg:text-[13px] [&_svg]:size-3.5";

// One office or facility that offers the service. Clicking anywhere on it selects its pin on the map;
// pointing at it highlights the pin.
export function LocationCard({
  id,
  location: { name, description, place, pin, call, sample },
  service,
  selected,
  onSelect,
  onHover,
}: {
  id: string;
  location: ServiceLocation;
  service: Service;
  selected: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const Icon = service.icon;
  // Links and buttons inside the card shouldn't also toggle the card.
  const own = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <article
      id={id}
      onClick={pin ? onSelect : undefined}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={cn(
        "flex scroll-mt-32 gap-4 lg:scroll-mt-4 rounded-2xl border border-line bg-background p-4 shadow-xs transition",
        pin && "cursor-pointer hover:border-brand/40 hover:shadow-md",
        selected && "border-brand ring-4 ring-brand/15",
      )}
    >
      <div className="relative shrink-0">
        {place.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.photo} alt="" className="size-16 rounded-xl object-cover sm:size-24 lg:size-20" />
        ) : (
          <div className={cn("grid size-16 place-items-center rounded-xl sm:size-24 lg:size-20", service.tone)}>
            <Icon size={30} />
          </div>
        )}
        {pin && (
          <span
            aria-hidden
            className={cn(
              "absolute -top-2 -left-2 grid size-6 place-items-center rounded-full border-2 border-white text-xs font-semibold shadow-sm transition-colors",
              selected ? "bg-brand-yellow text-brand-deep" : "bg-brand text-white",
            )}
          >
            {pin}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">
          {name}
          {sample && (
            <span
              title="Dummy entry for testing the layout, not a real office"
              className="ml-2 inline-block rounded-full bg-brand-yellow/25 px-2 align-middle text-[11px] font-medium text-amber-800"
            >
              Sample
            </span>
          )}
        </h3>
        {/* The building, unless the office is the building itself (e.g. the Rural Health Unit). */}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {[place.name !== name && place.name, place.address].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-sm lg:gap-1.5">
          {pin ? (
            <button
              type="button"
              aria-pressed={selected}
              onClick={(e) => {
                own(e);
                onSelect();
              }}
              className={cn(action, selected ? "border-brand bg-brand text-white" : "border-line text-brand hover:bg-muted")}
            >
              <MapPinIcon aria-hidden />
              {selected ? "Shown on map" : "Show on map"}
            </button>
          ) : (
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">Not on the map yet</span>
          )}
          {place.coordinates && (
            <a
              href={directionsUrl(place.coordinates)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={own}
              className={cn(action, "border-line text-foreground hover:bg-muted")}
            >
              Directions
              <ArrowUpRightIcon aria-hidden />
            </a>
          )}
          {call && (
            <a href={call.dial} onClick={own} className={cn(action, "border-line text-foreground hover:bg-muted")}>
              <PhoneIcon aria-hidden />
              Local {call.local}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
