// Site-wide text: branding, navigation and the shared call-to-action.
// Feature-specific content lives in each feature's data.ts (e.g. src/features/hotlines/data.ts).
// Anything marked "TODO: verify" is a placeholder — confirm it with the municipal hall before publishing.

// The Statistics pages, listed in the navbar dropdown and as tabs on each page.
export const statisticsModules = [
  { label: "Demographics", to: "/statistics/demographics", description: "Population, land area and barangays" },
  { label: "Competitiveness", to: "/statistics/competitiveness", description: "DTI competitiveness scores and ranks" },
] as const;

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
    { label: "Hotlines", to: "/hotlines" },
    { label: "Officials", to: "/officials" },
    { label: "Statistics", to: "/statistics", children: statisticsModules },
    { label: "Announcements", to: "/", hash: "announcements" },
    { label: "About", to: "/about" },
  ],

  primaryCta: { label: "Find a service", to: "/", hash: "services" },

  cta: {
    title: "May emergency o concern?",
    body: "Find the right office or hotline to call — from barangay halls to the Mayor's office.",
    button: { label: "View hotlines", to: "/hotlines" },
  },
} as const;
