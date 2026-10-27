// Municipal services. Raw copy: src/data/services.json (id, title, body and an icon key).
// Icons and colours are UI, so they're mapped here by id rather than stored in the JSON.
import data from "@/data/services.json";
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

// The first six are the most requested; the home page lists them as "Popular services".
export const services = data.services.map((s) => {
  const icon = icons[s.icon as keyof typeof icons];
  if (!icon) throw new Error(`Unknown service icon in src/data/services.json: ${s.icon}`);
  return { icon, title: s.title, body: s.body, tone: tones[s.id] ?? "bg-muted text-muted-foreground" };
});

// Each service card's id on the home page, so search results can jump to it: "Jobs (PESO)" → "service-jobs-peso".
export const serviceId = (title: string) =>
  `service-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
