import { Link } from "@tanstack/react-router";
import { AnimateIcon } from "@animate-ui/react/icons";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { Button } from "@/components/ui/button";
import { site } from "@/site.config";

export function Cta() {
  const { cta } = site;
  return (
    <section className="container-page py-20 sm:py-24">
      <div className="rounded-3xl bg-brand px-6 py-16 text-center text-white sm:px-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{cta.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">{cta.body}</p>
        <AnimateIcon animateOnHover asChild>
          <Button asChild size="lg" variant="outline" className="mt-8 h-11 rounded-full border-white bg-white px-6 text-brand hover:bg-white/90 hover:text-brand">
            <Link to={cta.button.to}>
              <PhoneCall />
              {cta.button.label}
            </Link>
          </Button>
        </AnimateIcon>
      </div>
    </section>
  );
}
