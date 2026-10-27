// Plaridel's local election results (2001–2025), copied from the BetterGov.ph Dynasties API
// (https://dynasties.bettergov.ph/developers). Raw copy: src/data/elections.json. Ballot names are title-cased and
// candidates sorted by votes. After the next election, add that year's results to src/data/elections.json.
import data from "@/data/elections.json";
import { oneOf } from "@/lib/data-checks";

const POSITIONS = ["mayor", "vice-mayor", "councilor", "representative", "board-member"] as const;
export type Position = (typeof POSITIONS)[number];

export type Candidate = {
  name: string; // as printed on the ballot
  party: string | null;
  votes: number | null;
  won: boolean;
};

export type Contest = {
  position: Position;
  district: string | null;
  seats: number;
  totalVotes: number | null;
  uncontested: boolean;
  winnersOnly: boolean; // no vote counts in the source (elections before 2010)
  candidates: Candidate[]; // most votes first
};

export type Election = { year: number; contests: Contest[] };

// Newest first.
export const elections: Election[] = data.elections.map((e) => ({
  ...e,
  contests: e.contests.map((c) => ({ ...c, position: oneOf(POSITIONS, c.position, "election position") })),
}));

// Credits
export const ELECTIONS_SOURCE = {
  label: data.source.label,
  url: data.source.url,
  dataset: data.source.dataset.label,
  datasetUrl: data.source.dataset.url,
  vintage: data.source.vintage,
};

// Municipal seats Plaridel elects on its own, then the district seats it votes on with its neighbors.
export const isMunicipal = (c: Contest) => ["mayor", "vice-mayor", "councilor"].includes(c.position);

const DISTRICTS: Record<string, string> = { FIRST: "1st", SECOND: "2nd", THIRD: "3rd", FOURTH: "4th", LONE: "Lone" };

export function contestTitle(c: Contest) {
  const district = c.district ? `${DISTRICTS[c.district] ?? c.district} District of Bulacan` : "";
  switch (c.position) {
    case "mayor":
      return { title: "Mayor", detail: "" };
    case "vice-mayor":
      return { title: "Vice Mayor", detail: "" };
    case "councilor":
      return { title: "Sangguniang Bayan", detail: `${c.seats} seats` };
    case "representative":
      return { title: "House Representative", detail: district };
    case "board-member":
      return { title: "Provincial Board Member", detail: `${district}, ${c.seats} ${c.seats === 1 ? "seat" : "seats"}` };
  }
}
