// Population figures are from the Philippine Statistics Authority (PSA), as published in the
// Philippine Standard Geographic Code (https://psa.gov.ph/classification/psgc/barangays/0301417000):
// the 2015 Census of Population (POPCEN) and the 2020 Census of Population and Housing (CPH).
// Urban/rural classes are PSA's, based on the 2020 CPH.

export const CENSUS_YEARS = [2015, 2020] as const;
export type CensusYear = (typeof CENSUS_YEARS)[number];
export const LATEST: CensusYear = 2020;

export const censusName: Record<CensusYear, string> = {
  2015: "2015 Census of Population",
  2020: "2020 Census of Population and Housing",
};

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

export const municipality = {
  name: "Plaridel",
  psgc: "0301417000",
  incomeClass: "1st",
  population: { 2015: 107805, 2020: 114432 } as Record<CensusYear, number>,
  // TODO: verify — 32.44 km² is the figure PhilAtlas and Wikipedia cite from PSA.
  landAreaKm2: 32.44,
  // TODO: add { male, female } from the PSA 2020 CPH table "Household Population by Age Group and Sex" for Plaridel.
  sex: undefined as SexBreakdown | undefined,
};

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

const rows: [psgc: string, name: string, urban: boolean, pop2015: number, pop2020: number, areaKm2: number][] = [
  ["0301417001", "Agnaya", true, 2585, 2821, 0.57],
  ["0301417002", "Bagong Silang", false, 3322, 4237, 2.36],
  ["0301417003", "Banga I", true, 7030, 5892, 1.22],
  ["0301417004", "Banga II", true, 9036, 8741, 0.76],
  ["0301417005", "Bintog", false, 4122, 4585, 1.81],
  ["0301417006", "Bulihan", true, 5721, 6755, 5.48],
  ["0301417007", "Culianin", true, 4130, 6731, 2.84],
  ["0301417008", "Dampol", false, 3183, 3476, 0.85],
  ["0301417010", "Lagundi", true, 4243, 4962, 2.78],
  ["0301417011", "Lalangan", false, 2077, 2259, 1.77],
  ["0301417012", "Lumang Bayan", true, 5361, 5609, 1.22],
  ["0301417014", "Parulan", true, 7590, 8935, 2.64],
  ["0301417015", "Poblacion", true, 3901, 3878, 0.37],
  ["0301417016", "Rueda", false, 1803, 1821, 0.97],
  ["0301417017", "San Jose", true, 4448, 5016, 2.69],
  ["0301417018", "Santa Ines", true, 2953, 2922, 0.45],
  ["0301417019", "Santo Niño", true, 10761, 10721, 2.38],
  ["0301417020", "Sipat", true, 5856, 7822, 2.08],
  ["0301417021", "Tabang", true, 19683, 17249, 2.68],
];

export const barangays: Barangay[] = rows.map(([psgc, name, urban, pop2015, pop2020, areaKm2]) => ({
  psgc,
  name,
  slug: slugify(name),
  urban,
  population: { 2015: pop2015, 2020: pop2020 },
  areaKm2,
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
