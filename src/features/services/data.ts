import { FileText } from "@/components/animate-ui/icons/file-text";
import { ShoppingBag } from "@/components/animate-ui/icons/shopping-bag";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { House } from "@/components/animate-ui/icons/house";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Users } from "@/components/animate-ui/icons/users";
import { Search } from "@/components/animate-ui/icons/search";
import { MapPin } from "@/components/animate-ui/icons/map-pin";

// The first six are the most requested; the home page lists them as "Popular services".
// `tone` colours each service's icon in the home page's search results.
export const services = [
  { icon: FileText, title: "Civil Registry", body: "Birth, marriage and death certificates, and late registration.", tone: "bg-sky-50 text-sky-600" },
  { icon: ShoppingBag, title: "Business Permits", body: "New and renewal business permits, and requirements checklist.", tone: "bg-orange-50 text-orange-600" },
  { icon: BadgeCheck, title: "Cedula", body: "Community Tax Certificate for employment, permits and transactions.", tone: "bg-emerald-50 text-emerald-600" },
  { icon: House, title: "Real Property Tax", body: "Amilyar payment schedule, discounts and tax declarations.", tone: "bg-violet-50 text-violet-600" },
  { icon: Heart, title: "Health Services", body: "Rural Health Unit, vaccinations, check-ups and health programs.", tone: "bg-rose-50 text-rose-600" },
  { icon: Users, title: "Social Welfare", body: "MSWDO assistance, senior citizen, PWD and solo parent IDs.", tone: "bg-teal-50 text-teal-600" },
  { icon: Search, title: "Jobs (PESO)", body: "Job fairs, local hiring and employment assistance.", tone: "bg-amber-50 text-amber-600" },
  { icon: MapPin, title: "Barangay Directory", body: "Find your barangay hall, officials and contact details.", tone: "bg-lime-50 text-lime-700" },
] as const;

// Each service card's id on the home page, so search results can jump to it: "Jobs (PESO)" → "service-jobs-peso".
export const serviceId = (title: string) =>
  `service-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
