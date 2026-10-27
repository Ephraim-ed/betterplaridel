import { useRouterState } from "@tanstack/react-router";
import { AnimateIcon } from "@animate-ui/react/icons";
import { cn } from "cn";
import { serviceId, services } from "../data";
import { Section } from "@/components/shared/section";

export function Services() {
  // The card a search result jumped to (e.g. /#service-cedula) is outlined.
  const hash = useRouterState({ select: (state) => state.location.hash });

  return (
    <Section
      id="services"
      eyebrow="Mga Serbisyo"
      title="Municipal services"
      subtitle="The most requested services in Plaridel and what you need to know about each."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, body }) => (
          // Hovering anywhere on the card plays the icon's animation.
          <AnimateIcon key={title} animateOnHover asChild>
            <div
              id={serviceId(title)}
              className={cn(
                "scroll-mt-24 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand/40",
                hash === serviceId(title) && "border-brand ring-4 ring-brand/15",
              )}
            >
              <div className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          </AnimateIcon>
        ))}
      </div>
    </Section>
  );
}
