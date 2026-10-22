import { FileText } from "@/components/animate-ui/icons/file-text";
import { ShoppingBag } from "@/components/animate-ui/icons/shopping-bag";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { House } from "@/components/animate-ui/icons/house";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Users } from "@/components/animate-ui/icons/users";
import { Search } from "@/components/animate-ui/icons/search";
import { MapPin } from "@/components/animate-ui/icons/map-pin";

export const services = [
  { icon: FileText, title: "Civil Registry", body: "Birth, marriage and death certificates, and late registration." },
  { icon: ShoppingBag, title: "Business Permits", body: "New and renewal business permits, and requirements checklist." },
  { icon: BadgeCheck, title: "Cedula", body: "Community Tax Certificate for employment, permits and transactions." },
  { icon: House, title: "Real Property Tax", body: "Amilyar payment schedule, discounts and tax declarations." },
  { icon: Heart, title: "Health Services", body: "Rural Health Unit, vaccinations, check-ups and health programs." },
  { icon: Users, title: "Social Welfare", body: "MSWDO assistance, senior citizen, PWD and solo parent IDs." },
  { icon: Search, title: "Jobs (PESO)", body: "Job fairs, local hiring and employment assistance." },
  { icon: MapPin, title: "Barangay Directory", body: "Find your barangay hall, officials and contact details." },
] as const;
