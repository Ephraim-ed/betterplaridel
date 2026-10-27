import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { hero } from "../home-content";
import { BanigTexture } from "./banig-texture";
import { PortalSearch } from "./portal-search";
import { RotatingWord } from "./rotating-word";

// Fills the first screen; the rest of the page starts below the fold, with a button to scroll to it.
export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.photo.src}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[center_40%]"
      />
      {/* Washes the photo out so dark text stays readable: almost solid behind the headline, lighter on the right,
          and fading to the page colour at the top (behind the navbar) and the bottom. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-surface from-30% via-surface/85 to-surface/60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-surface/70 via-transparent to-surface" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface/60 lg:hidden" />
      {/* Faint texture on the left, fading out toward the right and behind the navbar. */}
      <div aria-hidden className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent_10%,black_30%)]">
        <BanigTexture className="size-full text-brand opacity-20 [mask-image:linear-gradient(to_right,black_20%,transparent_60%)]" />
      </div>

      {/* The extra top padding clears the navbar, which sits over the hero on the home page. */}
      <div className="container-page grid flex-1 content-center items-center gap-12 pt-36 pb-28 lg:grid-cols-[1.15fr_1fr] lg:gap-16 [&>*]:min-w-0">
        <div>
          <p className="text-sm font-semibold text-brand">{hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-brand-deep sm:text-6xl xl:text-7xl">
            {/* Screen readers get the sentence once; the changing word is only shown. */}
            <span className="sr-only">{`${hero.title.lead} ${hero.title.words[0]} ${hero.title.rest}`}</span>
            <span aria-hidden>
              {hero.title.lead} <RotatingWord words={hero.title.words} /> {hero.title.rest}
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl">{hero.subtitle}</p>
        </div>

        <PortalSearch />
      </div>

      <Link
        to="/"
        hash="overview"
        className="group absolute bottom-9 left-1/2 flex sm:bottom-6 -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-brand"
      >
        Scroll
        <span className="grid size-10 place-items-center rounded-full border border-line bg-background shadow-sm transition-colors group-hover:border-brand/40">
          <ChevronDownIcon aria-hidden className="size-5 animate-bounce motion-reduce:animate-none" />
        </span>
      </Link>

      <a
        href={hero.photo.source}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 bottom-2 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
      >
        Photo: {hero.photo.caption} · {hero.photo.credit}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}
