import { useMemo, useState } from "react";
import { AnimateIcon } from "@animate-ui/react/icons";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { chipClass } from "@/components/shared/chip";
import { categories, entries, LAST_UPDATED, matchesQuery, TRUNKLINE, type DirectoryCategory } from "../data";
import { DirectoryCard } from "./directory-card";

// Municipal Hall telephone directory, shown as a section of the Hotlines page.
// Filtered by the page's search box (`query`) and its own category buttons.
export function MunicipalDirectory({ id, query }: { id?: string; query: string }) {
  const [category, setCategory] = useState<DirectoryCategory | "all">("all");

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => entries.filter((e) => (category === "all" || e.category === category) && matchesQuery(e, q)),
    [q, category],
  );
  const groups = categories
    .map((c) => ({ ...c, items: matches.filter((e) => e.category === c.id) }))
    .filter((g) => g.items.length > 0);

  const count = `${matches.length} ${matches.length === 1 ? "office" : "offices"}`;

  return (
    <div id={id} className="mt-10 scroll-mt-48">
      <h2 className="text-2xl font-bold tracking-tight">Municipal Hall</h2>
      <p className="mt-1 text-muted-foreground">Every office in the Municipal Hall, through one trunkline.</p>

      {/* Trunkline */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-brand px-6 py-8 text-white sm:px-10">
        <div className="min-w-0">
          <p className="text-white/80">Isang numero na lang ang dapat tandaan — one number for every office</p>
          <p className="my-2 text-[clamp(48px,8vw,80px)] leading-none font-bold tracking-tight tabular-nums">
            {TRUNKLINE.display}
          </p>
          <p className="text-white/80">Call the trunkline, then dial the 4-digit local number of the office you need.</p>
        </div>
        <AnimateIcon animateOnHover asChild>
          <a
            href={`tel:${TRUNKLINE.dial}`}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-semibold text-brand hover:bg-white/90"
          >
            <PhoneCall size={18} />
            Call trunkline
          </a>
        </AnimateIcon>
      </div>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter offices by category" className="flex flex-wrap gap-2">
          {[{ id: "all" as const, chip: "All offices" }, ...categories].map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c.id)}
                className={chipClass(active)}
              >
                {c.chip}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="ml-auto text-sm text-muted-foreground">
          {q ? `${count} matching “${query.trim()}”` : count}
        </p>
      </div>

      {/* Offices */}
      {groups.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line p-6 text-center text-muted-foreground">
          No office matches that search. Call the operator at local 1000.
        </p>
      ) : (
        groups.map((g) => (
          <section key={g.id} aria-labelledby={`dir-${g.id}`} className="mt-8">
            <h3 id={`dir-${g.id}`} className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {g.label}
            </h3>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((e) => (
                <DirectoryCard key={e.local} entry={e} />
              ))}
            </ul>
          </section>
        ))
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        On a phone, tapping a call button dials the trunkline and enters the local number automatically. Last updated{" "}
        {LAST_UPDATED}.
      </p>
    </div>
  );
}
