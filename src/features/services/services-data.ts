// Municipal services and the places that offer them. Raw copy: src/data/services.json
// (each service's id, title, body, icon key and locations; the buildings are listed once, in `places`).
// Icons and colours are UI, so they're mapped here by id rather than stored in the JSON.
import data from "@/data/services.json";
import { entries, TRUNKLINE } from "@/features/directory/directory-data";
import { FileText } from "@/components/animate-ui/icons/file-text";
import { ShoppingBag } from "@/components/animate-ui/icons/shopping-bag";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { House } from "@/components/animate-ui/icons/house";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Users } from "@/components/animate-ui/icons/users";
import { Search } from "@/components/animate-ui/icons/search";
import { MapPin } from "@/components/animate-ui/icons/map-pin";

const icons = {
  "file-text": FileText,
  "shopping-bag": ShoppingBag,
  "badge-check": BadgeCheck,
  house: House,
  heart: Heart,
  users: Users,
  search: Search,
  "map-pin": MapPin,
};

// Colours each service's icon in the home page's search results.
const tones: Record<string, string> = {
  "civil-registry": "bg-sky-50 text-sky-600",
  "business-permits": "bg-orange-50 text-orange-600",
  cedula: "bg-emerald-50 text-emerald-600",
  "real-property-tax": "bg-violet-50 text-violet-600",
  "health-services": "bg-rose-50 text-rose-600",
  "social-welfare": "bg-teal-50 text-teal-600",
  "jobs-peso": "bg-amber-50 text-amber-600",
  "barangay-directory": "bg-lime-50 text-lime-700",
};

export type LatLng = { lat: number; lng: number };
export type Place = { id: string; name: string; address?: string; coordinates?: LatLng; photo?: string };

const places: Place[] = data.places;
const placeById = new Map(places.map((p) => [p.id, p]));

// One place where a service is offered. `pin` is its place's number on the map, shared by every office in the
// same building; places without coordinates have no pin. `call` is the office's Municipal Hall directory local,
// matched by name, dialled through the trunkline. `sample` marks dummy entries kept only for testing the layout.
export type ServiceLocation = {
  name: string;
  description: string;
  place: Place;
  pin?: number;
  call?: { local: string; dial: string };
  sample?: boolean;
};
export type ServicePin = { number: number; place: Place & { coordinates: LatLng } };

type RawLocation = { name: string; description: string; place: string; sample?: boolean };

function locate(serviceId: string, locations: RawLocation[]) {
  const pins: ServicePin[] = [];
  const located = locations.map((l): ServiceLocation => {
    const place = placeById.get(l.place);
    if (!place) throw new Error(`Unknown place in src/data/services.json (${serviceId}): ${l.place}`);
    const local = entries.find((e) => e.name === l.name)?.local;
    const call = local ? { local, dial: `tel:${TRUNKLINE.dial},${local}` } : undefined;
    if (!place.coordinates) return { ...l, place, call };
    let pin = pins.find((p) => p.place.id === place.id);
    if (!pin) pins.push((pin = { number: pins.length + 1, place: { ...place, coordinates: place.coordinates } }));
    return { ...l, place, call, pin: pin.number };
  });
  // The buildings the service is offered in, for the list's filter.
  const places = [...new Map(located.map((l) => [l.place.id, l.place])).values()];
  return { locations: located, pins, places };
}

// Matches an office by its name, what it does, or its building and address (`q` is lowercase).
const matchesLocation = (l: ServiceLocation, q: string) =>
  !q || [l.name, l.description, l.place.name, l.place.address].some((text) => text?.toLowerCase().includes(q));

// The offices of a service that match the search and building filter ("all" for every building), each with its
// index in the full list, plus the pins of the buildings still shown.
export function filterLocations(service: Service, query: string, placeId: string) {
  const q = query.trim().toLowerCase();
  const visible = service.locations
    .map((location, index) => ({ location, index }))
    .filter(({ location: l }) => (placeId === "all" || l.place.id === placeId) && matchesLocation(l, q));
  const shown = new Set(visible.map((v) => v.location.place.id));
  return { visible, visiblePins: service.pins.filter((p) => shown.has(p.place.id)) };
}

// The first six are the most requested; the home page lists them as "Popular services".
export const services = data.services.map((s) => {
  const icon = icons[s.icon as keyof typeof icons];
  if (!icon) throw new Error(`Unknown service icon in src/data/services.json: ${s.icon}`);
  return {
    id: s.id,
    icon,
    title: s.title,
    body: s.body,
    tone: tones[s.id] ?? "bg-muted text-muted-foreground",
    ...locate(s.id, s.locations),
  };
});
export type Service = (typeof services)[number];

export const serviceById = (id?: string) => services.find((s) => s.id === id);

// Where the map centres when a service has no pins yet: the middle of town, the same point as the top bar's weather.
export const TOWN_CENTER: LatLng = { lat: 14.887, lng: 120.857 };

// Opens Google Maps with directions to a place. Works without an API key.
export const directionsUrl = ({ lat, lng }: LatLng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

// Each service card's id on the home page, so search results can jump to it: "Jobs (PESO)" → "service-jobs-peso".
export const serviceId = (title: string) =>
  `service-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
