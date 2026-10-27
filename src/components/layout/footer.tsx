import type { ComponentProps, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpIcon, ArrowUpRightIcon } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { site } from "@/site.config";
import pkg from "../../../package.json";

const linkClass = "group text-sm text-white/80 transition-colors hover:text-white";
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// lucide has no brand icons, so this is GitHub's mark drawn inline.
function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
    </svg>
  );
}

// A link that leaves the site: opens in a new tab and says so.
function ExternalLink({ href, label }: { href: string; label: string }) {
  // The arrow stays on the line of the label's last word when the label wraps.
  const lastSpace = label.lastIndexOf(" ") + 1;
  return (
    <a href={href} {...external} className={linkClass}>
      {label.slice(0, lastSpace)}
      <span className="whitespace-nowrap">
        {label.slice(lastSpace)}
        <ArrowUpRightIcon
          aria-hidden
          className="ml-1 inline size-3.5 align-[-2px] opacity-40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function LinkColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold tracking-widest text-white/60 uppercase">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    // Focus outlines default to the brand green, which would vanish on this background.
    <footer className="relative overflow-hidden bg-brand-deep text-white [&_a,&_button]:outline-white/80">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/betterplaridel-symbol.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-36 hidden w-[40rem] max-w-none opacity-[0.12] brightness-0 invert select-none sm:block"
      />

      <div className="relative container-page grid grid-cols-2 gap-x-6 gap-y-12 pt-16 pb-12 lg:grid-cols-[1.3fr_0.8fr_1fr_auto] lg:gap-x-12">
        <div className="col-span-2 max-w-sm lg:col-span-1">
          <Link to="/" className="inline-flex">
            <BrandLogo onDark />
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-white/75">{site.description}</p>
          <a
            href={site.footer.repo}
            {...external}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/10 transition-colors hover:bg-white/15"
          >
            <GithubIcon className="size-4" />
            Contribute code with us
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <LinkColumn title="Quick links">
          {site.footer.quickLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} hash={"hash" in l ? l.hash : undefined} className={linkClass}>
                {l.label}
              </Link>
            </li>
          ))}
        </LinkColumn>

        <LinkColumn title="Resources">
          {site.footer.resources.map((r) => (
            <li key={r.href}>
              <ExternalLink href={r.href} label={r.label} />
            </li>
          ))}
        </LinkColumn>

        <div className="col-span-2 flex flex-col gap-5 sm:flex-row sm:items-center lg:col-span-1 lg:flex-col lg:items-stretch">
          <div className="rounded-2xl bg-linear-to-br from-white/12 to-white/3 px-6 py-5 text-center ring-1 ring-white/15 sm:w-64">
            <p className="text-sm font-semibold">Cost to the people of Plaridel =</p>
            <p className="mt-1 text-6xl leading-none font-extrabold tracking-tight text-brand-yellow">₱0</p>
          </div>
          <a
            href={site.footer.betterGov}
            {...external}
            className="group flex items-center gap-3 self-start rounded-xl p-1 pr-3 transition-colors hover:bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bettergov-icon.svg" alt="" aria-hidden className="h-14 w-auto brightness-0 invert" />
            <span className="leading-tight">
              <span className="block text-xs text-white/60">A part of</span>
              <span className="block font-semibold">BetterGov.ph</span>
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="relative container-page">
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              <span className="font-medium text-white">
                © {new Date().getFullYear()} {site.name}
              </span>{" "}
              · All public information is sourced from official government portals.
            </p>
            <p>{site.disclaimer}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px]">v{pkg.version}</span>
            <button
              type="button"
              // The page's smooth scrolling comes from CSS, which also respects reduced motion.
              onClick={() => window.scrollTo({ top: 0 })}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowUpIcon aria-hidden className="size-3.5" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
