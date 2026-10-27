import { AnimateIcon } from "@animate-ui/react/icons";
import { cn } from "cn";
import { TERM, type OrgNode } from "../official-data";
import { ContactIcon } from "./contact-icon";

const groupTitle = (label = "members") => label[0].toUpperCase() + label.slice(1);

export function OfficialDetails({
  official,
  parent,
  members,
  onSelect,
  onClose,
  className = "",
}: {
  official: OrgNode;
  parent?: OrgNode;
  members: OrgNode[];
  onSelect: (id: string) => void;
  onClose: () => void;
  className?: string;
}) {
  const rows: [string, string][] = [];
  if (["executive", "legislative", "member"].includes(official.kind)) rows.push(["Term", TERM]);
  if (official.elected) {
    const { year, party, votes } = official.elected;
    if (party) rows.push(["Party", party]);
    if (votes != null) rows.push([`Votes (${year})`, votes.toLocaleString("en-PH")]);
  }

  return (
    <aside
      aria-label={`Details: ${official.name}`}
      className={cn("rounded-2xl border border-line bg-background p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{official.position}</p>
          <h2 className="mt-1 text-lg leading-snug font-bold">{official.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {official.description && <p className="mt-3 text-sm text-muted-foreground">{official.description}</p>}

      {rows.length > 0 && (
        <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Same look as the hotline cards: icon + value, the icon animates on hover. */}
      {official.contacts && (
        <ul className="mt-4 grid gap-2 border-t border-line pt-4 text-sm">
          {official.contacts.map((c) => (
            <li key={c.label}>
              <AnimateIcon animateOnHover asChild>
                <a
                  href={c.href}
                  {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={`${c.label}: ${c.value}`}
                  title={c.label}
                  className="group flex items-center gap-3 rounded-xl bg-brand/10 px-3 py-2 text-foreground transition-colors hover:bg-brand/15"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-brand">
                    <ContactIcon label={c.label} />
                  </span>
                  <span className="min-w-0 font-medium break-all">{c.value}</span>
                </a>
              </AnimateIcon>
            </li>
          ))}
        </ul>
      )}

      {official.rosters?.map((r) => (
        <div key={r.label} className="mt-4 border-t border-line pt-4 text-sm">
          <p className="text-muted-foreground">{r.label}</p>
          <ul className="mt-1 grid gap-0.5">
            {r.people.map((p) => (
              <li key={p} className="font-medium">
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {(parent || members.length > 0) && (
        <div className="mt-4 grid gap-2 border-t border-line pt-4 text-sm">
          {parent && (
            <p>
              <span className="text-muted-foreground">Under: </span>
              <button type="button" onClick={() => onSelect(parent.id)} className="font-medium text-brand hover:underline">
                {parent.position}
              </button>
            </p>
          )}
          {members.length > 0 && (
            <div>
              <p className="text-muted-foreground">{groupTitle(official.childrenLabel)}:</p>
              <ul className="mt-1 grid gap-1">
                {members.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => onSelect(m.id)} className="text-left font-medium text-brand hover:underline">
                      {m.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
