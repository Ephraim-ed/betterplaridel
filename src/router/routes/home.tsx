import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Services } from "@/components/landing/services";
import { Hotlines } from "@/components/landing/hotlines";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Announcements } from "@/components/landing/announcements";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Hotlines />
      <HowItWorks />
      <Announcements />
      <Faq />
      <Cta />
    </>
  );
}
