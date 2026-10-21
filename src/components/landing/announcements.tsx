import { Megaphone } from "@/components/animate-ui/icons/megaphone";
import { Badge } from "@/components/ui/badge";
import { site } from "@/site.config";
import { Section } from "./section";

export function Announcements() {
  return (
    <Section id="announcements" eyebrow="Balita" title="Latest announcements" className="bg-surface">
      <div className="grid gap-6 md:grid-cols-3">
        {site.announcements.map((a) => (
          <article key={a.title} className="flex flex-col rounded-2xl border border-line bg-background p-6">
            <div className="flex items-center gap-3 text-xs">
              <Badge className="bg-brand/10 text-brand">
                <Megaphone animateOnView animateOnViewOnce />
                {a.tag}
              </Badge>
              <span className="text-muted-foreground">{a.date}</span>
            </div>
            <h3 className="mt-4 font-semibold">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
