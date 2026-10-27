// Plaridel's census figures, from the Philippine Statistics Authority (PSA): the 2015 Census of Population
// (POPCEN) and the 2020 Census of Population and Housing (CPH). Raw copies: src/data/demographics.json
// (the municipality) and src/data/barangays.json (each barangay, shared with other features).
// Sources and notes are in each file's "source" block.
import barangayData from "@/data/barangays.json";
import data from "@/data/demographics.json";
import { oneOf } from "@/lib/data-checks";

// After a new census, add its year here and its figures to both JSON files.
const YEARS = [2015, 2020] as const;
export type CensusYear = (typeof YEARS)[number];
const censusYear = (y: unknown) => oneOf(YEARS, y, "census year");

export const CENSUS_YEARS = data.censusYears.map(censusYear);
export const LATEST: CensusYear = censusYear(data.latest);

const byYear = (values: Record<string, number>) =>
  Object.fromEntries(CENSUS_YEARS.map((y) => [y, values[y]])) as Record<CensusYear, number>;

export const censusName = Object.fromEntries(
  CENSUS_YEARS.map((y) => [y, data.censusNames[y]]),
) as Record<CensusYear, string>;

export type SexBreakdown = { male: number; female: number };

export type Barangay = {
  psgc: string;
  name: string;
  slug: string;
  urban: boolean;
  population: Record<CensusYear, number>;
  // Approximate: measured from the barangay boundary map, not an official PSA figure.
  areaKm2: number;
  sex?: SexBreakdown;
};

const m = data.municipality;
export const municipality = {
  name: m.name,
  psgc: m.psgc,
  incomeClass: m.incomeClass,
  population: byYear(m.population),
  // TODO: verify — 32.44 km² is the figure PhilAtlas and Wikipedia cite from PSA.
  landAreaKm2: m.landAreaKm2,
  // TODO: add { male, female } from the PSA 2020 CPH table "Household Population by Age Group and Sex" for Plaridel.
  sex: (m.sex ?? undefined) as SexBreakdown | undefined,
};

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

export const barangays: Barangay[] = barangayData.barangays.map((b) => ({
  psgc: b.psgc,
  name: b.name,
  slug: slugify(b.name),
  urban: b.urban,
  population: byYear(b.population),
  areaKm2: b.areaKm2,
}));

export const barangayBySlug = (slug: string | undefined) => barangays.find((b) => b.slug === slug);

// Matches names without accents, so "santo nino" finds Santo Niño.
export const matchesName = (b: Barangay, query: string) => slugify(b.name).includes(slugify(query.trim()));

export const mappedAreaKm2 = barangays.reduce((sum, b) => sum + b.areaKm2, 0);

export const density = (population: number, areaKm2: number) => population / areaKm2;

export const rankByPopulation = [...barangays].sort((a, b) => b.population[LATEST] - a.population[LATEST]);

export const urbanRural = (["urban", "rural"] as const).map((kind) => {
  const members = barangays.filter((b) => b.urban === (kind === "urban"));
  return {
    kind,
    barangays: members.length,
    residents: members.reduce((sum, b) => sum + b.population[LATEST], 0),
  };
});

const number = new Intl.NumberFormat("en-PH");
const percent = new Intl.NumberFormat("en-PH", { style: "percent", maximumFractionDigits: 1 });
const signedPercent = new Intl.NumberFormat("en-PH", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

export const fmt = {
  number: (n: number) => number.format(Math.round(n)),
  percent: (n: number) => percent.format(n),
  change: (n: number) => signedPercent.format(n),
};
