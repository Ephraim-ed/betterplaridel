import { FileCheck } from "@/components/animate-ui/icons/file-check";
import { Route } from "@/components/animate-ui/icons/route";
import { Wallet } from "@/components/animate-ui/icons/wallet";
import { fmt, LATEST, municipality } from "@/features/statistics/demographics/data";
import { site } from "@/site.config";

// Text for the home page. Anything marked "TODO: verify" is a placeholder.

export const hero = {
  eyebrow: "Para sa mga Plaridelenyo",
  title: "Everything you need from your town, in one place",
  subtitle:
    "Find government services, emergency hotlines and the latest news in Plaridel — without the guesswork or the long lines.",
  primaryCta: site.primaryCta,
  secondaryCta: { label: "Emergency hotlines", to: "/hotlines" },
} as const;

// TODO: verify — check the latest PSA census and municipal records.
export const stats = [
  { value: "19", label: "Barangays" },
  { value: fmt.number(municipality.population[LATEST]), label: "Residents (2020 census)" },
  { value: "1936", label: "Renamed Plaridel" },
  { value: "24/7", label: "Emergency line: 911" },
] as const;

export const steps = [
  { icon: FileCheck, title: "Check the requirements", body: "Open the service page and prepare the documents listed." },
  { icon: Route, title: "Visit the right office", body: "Go to the municipal office or your barangay hall during office hours." },
  { icon: Wallet, title: "Pay and claim", body: "Pay the fees at the Treasurer's Office and claim your document." },
] as const;

export const faq = [
  { q: "What are the municipal hall's office hours?", a: "TODO: verify — usually Monday to Friday, 8:00 AM to 5:00 PM, except holidays." },
  { q: "How do I get a copy of my birth certificate?", a: "For local copies, visit the Municipal Civil Registrar. For PSA copies, request online through PSA or visit a PSA outlet." },
  { q: "Where do I pay my amilyar (real property tax)?", a: "At the Municipal Treasurer's Office. Bring your previous receipt or tax declaration." },
  { q: "Is this the official municipal website?", a: "No. BetterPlaridel is a community project that helps residents find information faster." },
] as const;
