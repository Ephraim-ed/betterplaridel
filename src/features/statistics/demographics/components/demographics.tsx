import { getRouteApi } from "@tanstack/react-router";
import { barangayBySlug, type Barangay } from "../data";
import { BarangayMap } from "./barangay-map";
import { BarangaySearch } from "./barangay-search";
import { LandAreaCard } from "./land-area-card";
import { PopulationByBarangay } from "./population-by-barangay";
import { PopulationCard } from "./population-card";
import { SexCard } from "./sex-card";
import { UrbanRuralCard } from "./urban-rural-card";

const route = getRouteApi("/statistics");

// One-screen dashboard on desktop (the viewport minus the navbar: 4rem plus its 1px border); stacks on smaller screens.
// The selected barangay lives in the URL (?barangay=tabang) so a view can be shared.
export function Demographics() {
  const { barangay: slug } = route.useSearch();
  const navigate = route.useNavigate();
  const selected = barangayBySlug(slug);

  const select = (b?: Barangay) =>
    navigate({ search: { barangay: b?.slug }, replace: true, resetScroll: false });

  return (
    <section
      aria-labelledby="demographics"
      className="container-page flex flex-col gap-3 py-4 lg:h-[calc(100dvh-4rem-1px)] lg:min-h-[36rem]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="demographics" className="text-2xl font-bold tracking-tight">
            Demographics
          </h1>
          <p aria-live="polite" className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            {selected ? (
              <>
                Showing Barangay <span className="font-medium text-foreground">{selected.name}</span>
                <button
                  type="button"
                  onClick={() => select()}
                  className="font-medium text-brand underline-offset-4 hover:underline"
                >
                  Back to all of Plaridel
                </button>
              </>
            ) : (
              "Showing all of Plaridel. Pick a barangay on the map, the chart or the search box."
            )}
          </p>
        </div>
        <BarangaySearch onSelect={select} className="w-full sm:w-72" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
        <BarangayMap
          selected={selected}
          onSelect={select}
          className="sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1"
        />
        <PopulationCard barangay={selected} />
        <LandAreaCard barangay={selected} />
        <SexCard barangay={selected} />
        <UrbanRuralCard barangay={selected} />
        <PopulationByBarangay selected={selected} onSelect={select} className="sm:col-span-2 lg:col-span-3" />
      </div>

      <p className="text-xs text-muted-foreground lg:truncate">
        Source: Philippine Statistics Authority,{" "}
        <a
          href="https://psa.gov.ph/classification/psgc/barangays/0301417000"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Philippine Standard Geographic Code
        </a>{" "}
        (2015 and 2020 census). Barangay land areas are approximate, measured from boundary maps.
      </p>
    </section>
  );
}
