import { useState } from "react";
import { AnimateIcon } from "@animate-ui/react/icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { orgNodes, type OrgNode } from "../official-data";
import { ContactIcon } from "./contact-icon";
import { OfficialDetails } from "./official-details";
import { initials } from "./official-node";

const byId = new Map(orgNodes.map((n) => [n.id, n]));

// The modal skips the "Under: Municipality" link (there's no card for it), and the Mayor's and
// Vice Mayor's member lists: the barangay captains are on the Barangays page, and the councilors
// have their own cards right below.
const parentOf = (n: OrgNode) => (n.parentId && n.parentId !== "lgu" ? byId.get(n.parentId) : undefined);
const membersOf = (n: OrgNode) =>
  n.kind === "executive" || n.kind === "legislative" ? [] : orgNodes.filter((c) => c.parentId === n.id);

export type CardSection = { id: string; title: string; subtitle: string; officials: OrgNode[]; featured?: boolean };

// "Punong Barangay · Agnaya" → "Barangay Agnaya": the section title already names the role.
const label = (n: OrgNode) => (n.kind === "barangay" ? `Barangay ${n.position.split(" · ")[1]}` : n.position);

function OfficialCard({
  official,
  featured = false,
  onOpen,
}: {
  official: OrgNode;
  featured?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <li>
      <AnimateIcon animateOnHover asChild>
        <button
          type="button"
          onClick={() => onOpen(official.id)}
          aria-haspopup="dialog"
          className="group flex h-full w-full cursor-pointer gap-4 rounded-2xl border border-line bg-background p-5 text-left transition-[border-color,box-shadow] hover:border-brand/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
        >
          <div
            aria-hidden
            className={`grid shrink-0 place-items-center rounded-full bg-brand/10 font-bold text-brand ${
              featured ? "size-14 text-base" : "size-11 text-sm"
            }`}
          >
            {initials(official.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{label(official)}</p>
            <p className={`mt-0.5 font-semibold ${featured ? "text-lg" : ""}`}>{official.name.replace(/^Hon\.\s*/, "")}</p>
            {featured && official.description && <p className="mt-2 text-sm text-muted-foreground">{official.description}</p>}
            {/* Plain text here (the card is a button); the modal has the clickable links. */}
            {featured && official.contacts && (
              <ul className="mt-2 grid gap-1 text-sm">
                {official.contacts.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <span className="shrink-0 text-brand" title={c.label}>
                      <ContactIcon label={c.label} size={14} />
                    </span>
                    <span className="sr-only">{c.label}: </span>
                    <span className="min-w-0 font-medium break-all">{c.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </button>
      </AnimateIcon>
    </li>
  );
}

// Sections of clickable official cards; a card opens that official's details in a modal.
export function OfficialCards({ sections }: { sections: CardSection[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? byId.get(selectedId) : undefined;

  return (
    <div className="container-page grid gap-12">
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={`officials-${s.id}`}>
          <h2 id={`officials-${s.id}`} className="text-xl font-bold tracking-tight">
            {s.title}
          </h2>
          <p className="text-sm text-muted-foreground">{s.subtitle}</p>
          <ul className={`mt-4 grid gap-3 ${s.featured ? "md:grid-cols-2" : "auto-rows-fr sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
            {s.officials.map((o) => (
              <OfficialCard key={o.id} official={o} featured={s.featured} onOpen={setSelectedId} />
            ))}
          </ul>
        </section>
      ))}

      {/* Same details as the chart's panel; links inside it (Under / members) switch to that official. */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent showCloseButton={false} aria-describedby={undefined} className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-md">
          <DialogTitle className="sr-only">{selected ? `Details: ${selected.name}` : "Official details"}</DialogTitle>
          {selected && (
            <OfficialDetails
              official={selected}
              parent={parentOf(selected)}
              members={membersOf(selected)}
              onSelect={setSelectedId}
              onClose={() => setSelectedId(null)}
              className="border-0 p-6"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
