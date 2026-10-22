import { Link } from "@tanstack/react-router";
import { AnimateIcon } from "@animate-ui/react/icons";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Button } from "@/components/ui/button";
import { hotlineGroups } from "../data";
import { HotlineCard } from "./hotline-card";
import { Section } from "@/components/shared/section";

export function EmergencyHotlines() {
  const emergency = hotlineGroups.find((g) => g.id === "emergency");
  return (
    <Section
      id="hotlines"
      eyebrow="Emergency"
      title="Emergency hotlines"
      subtitle="Save these numbers. In a life-threatening emergency, call 911."
      className="bg-surface"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {emergency?.contacts.map((h) => <HotlineCard key={h.name} hotline={h} emergency />)}
      </ul>
      <div className="mt-10 text-center">
        <AnimateIcon animateOnHover asChild>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
            <Link to="/hotlines">
              View all hotlines
              <ArrowRight />
            </Link>
          </Button>
        </AnimateIcon>
      </div>
    </Section>
  );
}
