import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { site } from "@/site.config";
import { Section } from "./section";

export function Hotlines() {
  return (
    <Section
      id="hotlines"
      eyebrow="Emergency"
      title="Emergency hotlines"
      subtitle="Save these numbers. In a life-threatening emergency, call 911."
      className="bg-surface"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.hotlines.map((h) => {
          const callable = h.number !== "TBA";
          return (
            <li
              key={h.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-background p-5"
            >
              <div>
                <p className="font-semibold">{h.name}</p>
                <p className="text-sm text-muted-foreground">{h.note}</p>
              </div>
              {callable ? (
                <a
                  href={`tel:${h.number}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  <PhoneCall size={16} animate loop loopDelay={1500} />
                  {h.number}
                </a>
              ) : (
                <span className="shrink-0 text-sm text-muted-foreground">{h.number}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
