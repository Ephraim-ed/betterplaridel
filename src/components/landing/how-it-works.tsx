import { site } from "@/site.config";
import { Section } from "./section";

export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow="Paano" title="How to request a document">
      <ol className="grid gap-8 md:grid-cols-3">
        {site.steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand text-white">
              <Icon size={24} animateOnView animateOnViewOnce delay={i * 250} />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-wide text-brand uppercase">Step {i + 1}</p>
            <h3 className="mt-1 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
