import { Fragment, useEffect, useRef, useState, type MouseEvent } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { chipClass } from "@/components/shared/chip";
import { MunicipalDirectory } from "@/features/directory/components/municipal-directory";
import { entries, matchesQuery } from "@/features/directory/data";
import { HotlineCard } from "./components/hotline-card";
import { hotlineGroups, moreHotlinesUrl, officialEmail } from "./data";

// Page sections in order; the Municipal Hall directory sits right after Emergency.
const sections = [hotlineGroups[0], { id: "directory", title: "Municipal Hall" }, ...hotlineGroups.slice(1)];

// Distance from the top of the window to just below the sticky search bar.
const SPY_OFFSET = 220;

export function HotlinesPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = hotlineGroups
    .map((g) => ({
      ...g,
      contacts: g.contacts.filter((c) => !q || `${c.name} ${c.note}`.toLowerCase().includes(q)),
    }))
    .filter((g) => g.contacts.length > 0);
  const showDirectory = entries.some((e) => matchesQuery(e, q));
  // The Municipal Hall directory goes right after Emergency (or first, if Emergency is filtered out).
  const directory = showDirectory && <MunicipalDirectory id="directory" query={query} />;

  // Highlight the category chip of the section currently under the sticky bar.
  const [active, setActive] = useState<string>(sections[0].id);
  const lockUntil = useRef(0);
  function select(id: string, e: MouseEvent) {
    setActive(id);
    lockUntil.current = e.timeStamp + 1000; // let the smooth scroll finish without flicker
  }
  useEffect(() => {
    function update(e?: Event) {
      if (e && e.timeStamp < lockUntil.current) return;
      const present = sections.map((s) => document.getElementById(s.id)).filter((el) => el !== null);
      if (present.length === 0) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? present[present.length - 1]
        : (present.findLast((el) => el.getBoundingClientRect().top <= SPY_OFFSET) ?? present[0]);
      setActive(current.id);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [query]);

  return (
    <>
      <PageHeader
        title="Hotlines & Directory"
        subtitle="Numbers every Plaridelenyo can call. In a life-threatening emergency, call 911."
      />
      <section className="container-page pb-24">
        <div className="sticky top-16 z-10 -mx-4 grid gap-4 border-b border-line bg-background/80 px-4 py-4 backdrop-blur">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an office, barangay, agency or local number…"
            aria-label="Search hotlines"
            className="h-10 bg-background"
          />
          <nav aria-label="Hotline categories" className="flex gap-2 overflow-x-auto">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => select(s.id, e)}
                aria-current={active === s.id ? "true" : undefined}
                className={chipClass(active === s.id)}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {groups.length === 0 && !showDirectory && (
          <p className="mt-12 text-center text-muted-foreground">No hotlines match &ldquo;{query}&rdquo;.</p>
        )}

        {groups[0]?.id !== "emergency" && directory}

        {groups.map((g) => {
          const emergency = g.id === "emergency";
          return (
            <Fragment key={g.id}>
              <div
                id={g.id}
                className="mt-10 scroll-mt-48"
              >
                <h2 className={`text-2xl font-bold tracking-tight ${emergency ? "text-red-600" : ""}`}>{g.title}</h2>
                <p className="mt-1 text-muted-foreground">{g.description}</p>
                {g.id === "agencies" && (
                  <a
                    href={moreHotlinesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                  >
                    See more national hotlines on BetterGov.ph →
                  </a>
                )}
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.contacts.map((c) => (
                    <HotlineCard key={c.name} hotline={c} emergency={emergency} />
                  ))}
                </ul>
              </div>
              {emergency && directory}
            </Fragment>
          );
        })}

        <p className="mt-12 text-center text-muted-foreground">
          For other concerns or inquiries, email the municipality at{" "}
          <a href={`mailto:${officialEmail}`} className="font-medium text-foreground underline underline-offset-4">
            {officialEmail}
          </a>
          .
        </p>
      </section>
    </>
  );
}
