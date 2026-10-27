import { useState } from "react";
import { Check } from "lucide-react";
import { chipClass } from "@/components/shared/chip";
import { contestTitle, elections, ELECTIONS_SOURCE, isMunicipal, type Contest } from "../election-data";

const number = new Intl.NumberFormat("en-PH");
const percent = new Intl.NumberFormat("en-PH", { style: "percent", maximumFractionDigits: 1 });

// Long races (a council race can have 25 candidates) show the winners plus a few runners-up.
const PREVIEW_EXTRA = 3;

function ContestCard({ contest }: { contest: Contest }) {
  const [expanded, setExpanded] = useState(false);
  const { title, detail } = contestTitle(contest);
  const singleSeat = contest.seats === 1;
  // Bars compare each candidate to the top vote-getter; single-seat races also show their share of the vote.
  const top = Math.max(...contest.candidates.map((c) => c.votes ?? 0));
  const limit = contest.seats + PREVIEW_EXTRA;
  const shown = expanded ? contest.candidates : contest.candidates.slice(0, limit);

  const status = contest.uncontested ? "Uncontested" : contest.winnersOnly ? "Winners only" : null;

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-background p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        </div>
        {status ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{status}</span>
        ) : (
          contest.totalVotes != null && (
            <p className="text-xs text-muted-foreground tabular-nums">{number.format(contest.totalVotes)} votes cast</p>
          )
        )}
      </header>

      <ol className="mt-4 grid gap-3">
        {shown.map((c) => {
          const share = singleSeat && c.votes != null && contest.totalVotes ? c.votes / contest.totalVotes : null;
          return (
            <li key={c.name}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <p className="min-w-0">
                  <span className={c.won ? "font-semibold" : "text-muted-foreground"}>{c.name}</span>
                  {c.party && <span className="ml-1.5 text-xs text-muted-foreground">{c.party}</span>}
                  {c.won && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-brand">
                      <Check aria-hidden className="size-3.5" />
                      Won
                    </span>
                  )}
                </p>
                {c.votes != null && (
                  <p className="shrink-0 tabular-nums">
                    <span className={c.won ? "font-medium" : "text-muted-foreground"}>{number.format(c.votes)}</span>
                    {share != null && <span className="ml-1.5 text-xs text-muted-foreground">{percent.format(share)}</span>}
                  </p>
                )}
              </div>
              {c.votes != null && top > 0 && (
                <div aria-hidden className="mt-1.5 h-1.5 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${c.won ? "bg-brand" : "bg-muted-foreground/40"}`}
                    style={{ width: `${(c.votes / top) * 100}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {contest.candidates.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-4 self-start text-sm font-medium text-brand hover:underline"
        >
          {expanded ? "Show fewer" : `Show all ${contest.candidates.length} candidates`}
        </button>
      )}
    </article>
  );
}
export function ElectionResults() {
  const [year, setYear] = useState(elections[0].year);
  const election = elections.find((e) => e.year === year)!;
  const municipal = election.contests.filter(isMunicipal);
  const district = election.contests.filter((c) => !isMunicipal(c));

  return (
    <section aria-labelledby="election-results" className="container-page">
      <h2 id="election-results" className="text-2xl font-bold tracking-tight">
        Election results
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        How Plaridel voted in every local election since 2001. Vote counts are available from 2010.
      </p>

      <div role="group" aria-label="Election year" className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {elections.map((e) => (
          <button
            key={e.year}
            type="button"
            aria-pressed={e.year === year}
            onClick={() => setYear(e.year)}
            className={chipClass(e.year === year)}
          >
            {e.year}
          </button>
        ))}
      </div>

      {/* Keyed by year so "Show all" resets when the year changes. */}
      <div key={year} className="mt-6 grid gap-8">
        <div className="grid gap-3 md:grid-cols-2">
          {municipal.map((c) => (
            <div key={c.position} className={c.position === "councilor" ? "md:col-span-2" : ""}>
              <ContestCard contest={c} />
            </div>
          ))}
        </div>

        {district.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">District seats</h3>
            <p className="text-sm text-muted-foreground">Plaridel votes on these together with its neighboring towns.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {district.map((c) => (
                <ContestCard key={c.position} contest={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Source:{" "}
        <a href={ELECTIONS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
          {ELECTIONS_SOURCE.label}
        </a>
        , from the{" "}
        <a href={ELECTIONS_SOURCE.datasetUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
          {ELECTIONS_SOURCE.dataset}
        </a>{" "}
        dataset (as of {ELECTIONS_SOURCE.vintage}). Names appear as printed on the ballot.
      </p>
    </section>
  );
}
