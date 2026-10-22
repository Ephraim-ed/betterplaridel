import { Hero } from "./components/hero";
import { Stats } from "./components/stats";
import { Services } from "@/features/services/components/services";
import { EmergencyHotlines } from "@/features/hotlines/components/emergency-hotlines";
import { HowItWorks } from "./components/how-it-works";
import { Announcements } from "@/features/announcements/components/announcements";
import { Faq } from "./components/faq";
import { Cta } from "@/components/shared/cta";

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <EmergencyHotlines />
      <HowItWorks />
      <Announcements />
      <Faq />
      <Cta />
    </>
  );
}
