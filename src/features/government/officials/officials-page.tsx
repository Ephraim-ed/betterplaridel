import { getRouteApi } from "@tanstack/react-router";
import { chipClass } from "@/components/shared/chip";
import { ElectionResults } from "../elections/components/election-results";
import { ELECTIONS_SOURCE } from "../elections/election-data";
import { OfficialCards } from "./components/official-cards";
import { OrgChart } from "./components/org-chart";
import { ELECTION_YEAR, municipalNodes, TERM, type OrgNode } from "./official-data";

const route = getRouteApi("/government/officials");

const ofKind = (...kinds: OrgNode["kind"][]) => municipalNodes.filter((n) => kinds.includes(n.kind));

const sections = [
  { id: "executive", title: "Mayor & Vice Mayor", subtitle: `Elected for the ${TERM} term`, officials: ofKind("executive", "legislative"), featured: true },
  { id: "council", title: "Sangguniang Bayan", subtitle: "Municipal councilors", officials: ofKind("member") },
];

const views = [
  { id: undefined, label: "Cards" },
  { id: "chart", label: "Chart" },
] as const;

export function OfficialsPage() {
  const { view } = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <>
      <section className="pb-16">
        <div className="container-page mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Municipal Officials</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {view === "chart"
                ? `Who leads Plaridel for the ${TERM} term. Click an official for details. Use Show / Hide to fold a group, and scroll or pinch to zoom.`
                : `Who leads Plaridel for the ${TERM} term: the Mayor, Vice Mayor and Sangguniang Bayan.`}
            </p>
          </div>
          <div role="group" aria-label="View officials as" className="flex gap-2">
            {views.map((v) => (
              <button
                key={v.label}
                type="button"
                aria-pressed={view === v.id}
                onClick={() => navigate({ search: { view: v.id }, replace: true, resetScroll: false })}
                className={chipClass(view === v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {view === "chart" ? (
          <div className="container-page">
            <OrgChart />
          </div>
        ) : (
          <OfficialCards sections={sections} />
        )}

        <p className="container-page mt-8 text-sm text-muted-foreground">
          Source: the {ELECTION_YEAR} election winners, from{" "}
          <a href={ELECTIONS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
            {ELECTIONS_SOURCE.label}
          </a>{" "}
          (see Election results below). Names appear as printed on the ballot.
        </p>
      </section>
      <div className="pb-24">
        <ElectionResults />
      </div>
    </>
  );
}
