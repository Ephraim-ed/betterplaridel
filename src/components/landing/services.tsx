import { AnimateIcon } from "@animate-ui/react/icons";
import { site } from "@/site.config";
import { Section } from "./section";

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Mga Serbisyo"
      title="Municipal services"
      subtitle="The most requested services in Plaridel and what you need to know about each."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {site.services.map(({ icon: Icon, title, body }) => (
          // Hovering anywhere on the card plays the icon's animation.
          <AnimateIcon key={title} animateOnHover asChild>
            <div className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand/40">
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
