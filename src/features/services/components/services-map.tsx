import { useEffect } from "react";
import { AdvancedMarker, APIProvider, Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { MapPinIcon } from "lucide-react";
import { cn } from "cn";
import { servicesPage } from "../services-content";
import { TOWN_CENTER, type ServicePin } from "../services-data";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// Advanced markers need a Map ID; Google's demo ID works while developing.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const FOCUS_ZOOM = 17;

// Google map with a numbered, labelled pin per place. Shows every pin of the service until one is selected;
// `highlighted` is the pin of the card under the pointer.
export function ServicesMap({
  pins,
  selected,
  highlighted,
  onSelect,
  className,
}: {
  pins: ServicePin[];
  selected?: number;
  highlighted?: number;
  onSelect: (pin?: number) => void;
  className?: string;
}) {
  if (!API_KEY) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-2xl border border-dashed border-line bg-muted/40 p-6 text-center",
          className,
        )}
      >
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
            <MapPinIcon aria-hidden className="size-6" />
          </span>
          <p className="mt-3 font-semibold">{servicesPage.map.unavailableTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{servicesPage.map.unavailableBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-line", className)}>
      <APIProvider apiKey={API_KEY}>
        <GoogleMap
          mapId={MAP_ID}
          defaultCenter={TOWN_CENTER}
          defaultZoom={14}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
          clickableIcons={false}
          className="size-full"
        >
          {pins.map(({ number, place }) => {
            const active = number === selected;
            const hot = number === highlighted;
            // Selected: yellow. Under the pointer: darker green. Others fade while one is selected.
            const tone = active
              ? "bg-brand-yellow text-brand-deep"
              : hot
                ? "bg-brand-deep text-white"
                : "bg-brand text-white";
            return (
              <AdvancedMarker
                key={place.id}
                position={place.coordinates}
                title={place.name}
                zIndex={active ? 3 : hot ? 2 : 1}
                onClick={() => onSelect(active ? undefined : number)}
              >
                <span
                  className={cn(
                    "flex origin-bottom flex-col items-center drop-shadow-md transition duration-200",
                    (active || hot) && "scale-110",
                    selected !== undefined && !active && !hot && "opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border-2 border-white py-0.5 pr-3 pl-0.5 text-xs font-semibold whitespace-nowrap",
                      tone,
                    )}
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-white/25">{number}</span>
                    {place.name}
                  </span>
                  {/* The tail points at the exact spot. */}
                  <span className={cn("-mt-1.5 size-2.5 rotate-45 border-r-2 border-b-2 border-white", tone)} />
                </span>
              </AdvancedMarker>
            );
          })}
          <FitToPins pins={pins} selected={selected} />
        </GoogleMap>
      </APIProvider>

      {selected !== undefined && (
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className="absolute top-3 right-3 animate-in rounded-full border border-line bg-background px-3 py-1 text-xs font-medium text-brand shadow-sm fade-in-0 hover:bg-muted"
        >
          Show all
        </button>
      )}
    </div>
  );
}

// Moves the map to the selected pin, or fits all of the service's pins in view.
function FitToPins({ pins, selected }: { pins: ServicePin[]; selected?: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const focus = pins.find((p) => p.number === selected) ?? (pins.length === 1 ? pins[0] : undefined);
    if (focus) {
      map.panTo(focus.place.coordinates);
      map.setZoom(FOCUS_ZOOM);
    } else if (pins.length === 0) {
      map.panTo(TOWN_CENTER);
      map.setZoom(14);
    } else {
      const lats = pins.map((p) => p.place.coordinates.lat);
      const lngs = pins.map((p) => p.place.coordinates.lng);
      map.fitBounds(
        { north: Math.max(...lats), south: Math.min(...lats), east: Math.max(...lngs), west: Math.min(...lngs) },
        // Room for the labels, which sit above and to either side of each spot.
        { top: 72, bottom: 32, left: 96, right: 96 },
      );
    }
  }, [map, pins, selected]);

  return null;
}
