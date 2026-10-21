import { site } from "@/site.config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "./section";

export function Faq() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
      <Accordion type="single" collapsible className="mx-auto max-w-2xl">
        {site.faq.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger className="py-5 text-base hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
