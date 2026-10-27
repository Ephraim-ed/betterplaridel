// Plaridel's local election results (2001–2025), copied from the BetterGov.ph Dynasties API
// (https://dynasties.bettergov.ph/developers) into election-results.json. Ballot names are title-cased and
// candidates sorted by votes. After the next election, add that year's results to election-results.json.
import results from "./election-results.json";

export type Position = "mayor" | "vice-mayor" | "councilor" | "representative" | "board-member";

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

export const elections = results.elections as Election[]; // newest first

// Credits
export const ELECTIONS_SOURCE = {
  label: "BetterGov.ph Dynasties",
  url: "https://dynasties.bettergov.ph/?province=bulacan&town=plaridel",
  dataset: "Open Halalan (Robert R. Leung)",
  datasetUrl: "https://robertrleung.github.io/OpenHalalan/",
  vintage: results.dataVintage,
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
