import { Link } from "@tanstack/react-router";
import { AnimateIcon } from "@animate-ui/react/icons";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { Button } from "@/components/ui/button";
import { hero } from "../data";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[36rem] max-w-5xl rounded-full bg-brand/20 blur-3xl"
      />
      <div className="container-page py-24 text-center sm:py-32">
        <span className="inline-flex rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          {hero.eyebrow}
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          {hero.title} kahit ano
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">{hero.subtitle}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <AnimateIcon animateOnHover asChild>
            <Button asChild size="lg" className="h-11 rounded-full px-6">
              <Link to={hero.primaryCta.to} hash={hero.primaryCta.hash}>
                {hero.primaryCta.label}
                <ArrowRight />
              </Link>
            </Button>
          </AnimateIcon>
          <AnimateIcon animateOnHover asChild>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
              <Link to={hero.secondaryCta.to}>
                <PhoneCall />
                {hero.secondaryCta.label}
              </Link>
            </Button>
          </AnimateIcon>
        </div>
      </div>
    </section>
  );
}
