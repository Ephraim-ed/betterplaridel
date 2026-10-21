import { FileText } from "@/components/animate-ui/icons/file-text";
import { ShoppingBag } from "@/components/animate-ui/icons/shopping-bag";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { House } from "@/components/animate-ui/icons/house";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Users } from "@/components/animate-ui/icons/users";
import { Search } from "@/components/animate-ui/icons/search";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { FileCheck } from "@/components/animate-ui/icons/file-check";
import { Route } from "@/components/animate-ui/icons/route";
import { Wallet } from "@/components/animate-ui/icons/wallet";

// All text shown on the site lives here.
// Anything marked "TODO: verify" is a placeholder — confirm it with the municipal hall before publishing.

export const site = {
  name: "BetterPlaridel",
  town: "Plaridel, Bulacan",
  demonym: "Plaridelenyo",
  tagline: "Serbisyo at impormasyon para sa bawat Plaridelenyo",
  description:
    "A community guide to services, hotlines and announcements for the people of Plaridel, Bulacan.",
  email: "hello@example.com", // TODO: replace with your contact email
  disclaimer:
    "BetterPlaridel is a community project and is not the official website of the Municipality of Plaridel.",

  nav: [
    { label: "Services", to: "/", hash: "services" },
    { label: "Hotlines", to: "/", hash: "hotlines" },
    { label: "Announcements", to: "/", hash: "announcements" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],

  hero: {
    eyebrow: "Para sa mga Plaridelenyo",
    title: "Everything you need from your town, in one place",
    subtitle:
      "Find government services, emergency hotlines and the latest news in Plaridel — without the guesswork or the long lines.",
    primaryCta: { label: "Find a service", to: "/", hash: "services" },
    secondaryCta: { label: "Emergency hotlines", to: "/", hash: "hotlines" },
  },

  // TODO: verify — check the latest PSA census and municipal records.
  stats: [
    { value: "19", label: "Barangays" },
    { value: "—", label: "Residents (PSA census)" },
    { value: "1936", label: "Renamed Plaridel" },
    { value: "24/7", label: "Emergency line: 911" },
  ],

  services: [
    { icon: FileText, title: "Civil Registry", body: "Birth, marriage and death certificates, and late registration." },
    { icon: ShoppingBag, title: "Business Permits", body: "New and renewal business permits, and requirements checklist." },
    { icon: BadgeCheck, title: "Cedula", body: "Community Tax Certificate for employment, permits and transactions." },
    { icon: House, title: "Real Property Tax", body: "Amilyar payment schedule, discounts and tax declarations." },
    { icon: Heart, title: "Health Services", body: "Rural Health Unit, vaccinations, check-ups and health programs." },
    { icon: Users, title: "Social Welfare", body: "MSWDO assistance, senior citizen, PWD and solo parent IDs." },
    { icon: Search, title: "Jobs (PESO)", body: "Job fairs, local hiring and employment assistance." },
    { icon: MapPin, title: "Barangay Directory", body: "Find your barangay hall, officials and contact details." },
  ],

  // TODO: verify — add the official local numbers. Only 911 is filled in.
  hotlines: [
    { name: "National Emergency Hotline", number: "911", note: "Police, fire and medical emergencies" },
    { name: "MDRRMO Plaridel", number: "TBA", note: "Disaster response and rescue" },
    { name: "Plaridel Police Station", number: "TBA", note: "PNP" },
    { name: "Plaridel Fire Station", number: "TBA", note: "BFP" },
    { name: "Rural Health Unit", number: "TBA", note: "Medical concerns" },
    { name: "Municipal Hall", number: "TBA", note: "General inquiries" },
  ],

  steps: [
    { icon: FileCheck, title: "Check the requirements", body: "Open the service page and prepare the documents listed." },
    { icon: Route, title: "Visit the right office", body: "Go to the municipal office or your barangay hall during office hours." },
    { icon: Wallet, title: "Pay and claim", body: "Pay the fees at the Treasurer's Office and claim your document." },
  ],

  // TODO: replace with real announcements.
  announcements: [
    { date: "Oct 2026", tag: "Advisory", title: "Sample announcement title", body: "Short summary of the announcement goes here." },
    { date: "Oct 2026", tag: "Event", title: "Sample community event", body: "Date, time and venue of the event go here." },
    { date: "Sep 2026", tag: "Service", title: "Sample service update", body: "Changes to office hours or requirements go here." },
  ],

  faq: [
    { q: "What are the municipal hall's office hours?", a: "TODO: verify — usually Monday to Friday, 8:00 AM to 5:00 PM, except holidays." },
    { q: "How do I get a copy of my birth certificate?", a: "For local copies, visit the Municipal Civil Registrar. For PSA copies, request online through PSA or visit a PSA outlet." },
    { q: "Where do I pay my amilyar (real property tax)?", a: "At the Municipal Treasurer's Office. Bring your previous receipt or tax declaration." },
    { q: "Is this the official municipal website?", a: "No. BetterPlaridel is a community project that helps residents find information faster." },
  ],

  cta: {
    title: "May concern ka ba sa bayan?",
    body: "Report a problem, suggest an improvement, or tell us what information is missing.",
    button: { label: "Contact us", to: "/contact" },
  },
} as const;
