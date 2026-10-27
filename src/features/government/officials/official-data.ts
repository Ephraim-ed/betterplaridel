// Current officials of Plaridel, Bulacan, built into the nodes used by the cards, the details modal
// and the org chart.
// - Mayor, Vice Mayor and councilors: the winners of the latest election in src/data/elections.json,
//   the same data as the Election results section.
// - Barangay officials: src/data/officials.json, copied from the DILG Bulacan LGRC profile of Plaridel
//   (they aren't in the election data), keyed by PSGC code. Barangay names come from src/data/barangays.json.
// - Contacts: src/data/officials.json. Phone numbers are from the Municipal Hall telephone directory;
//   the Vice Mayor's are as listed on the Vice Mayor's Facebook page.
import barangayData from "@/data/barangays.json";
import data from "@/data/officials.json";
import { elections, type Candidate, type Position } from "../elections/election-data";

// The DILG profile, credited on the Barangays page.
const [dilg] = data.sources;
export const SOURCE = { label: dilg.label, url: dilg.url };

const latest = elections[0];
export const ELECTION_YEAR = latest.year;
export const TERM = `${latest.year}–${latest.year + 3}`; // municipal elected officials

const winners = (position: Position) =>
  latest.contests.find((c) => c.position === position)?.candidates.filter((c) => c.won) ?? [];

// Names as printed on the ballot (e.g. "Ate Jocell Vistan"), plus how they won.
const fromWinner = (c: Candidate) => ({
  name: `Hon. ${c.name}`,
  elected: { year: latest.year, party: c.party, votes: c.votes },
});

const [mayor] = winners("mayor");
const [viceMayor] = winners("vice-mayor");
const councilors = winners("councilor");

export type OrgNodeKind = "lgu" | "executive" | "legislative" | "member" | "barangay" | "kagawad" | "sk-chair" | "sk-member";

export type Roster = { label: string; people: string[] };

export type ContactItem = { label: string; value: string; href: string };

export type OrgNode = {
  id: string;
  parentId?: string;
  kind: OrgNodeKind;
  name: string; // person's name, or the office/body for group nodes
  position: string;
  description?: string;
  contacts?: ContactItem[]; // phone, email, social pages
  childrenLabel?: string; // what this node's children are called, e.g. "barangays"
  rosters?: Roster[]; // e.g. a barangay's kagawads and SK officials
  elected?: { year: number; party: string | null; votes: number | null };
};

const nameOf = new Map(barangayData.barangays.map((b) => [b.psgc, b.name]));
const barangays = data.barangays.map((b) => {
  const barangay = nameOf.get(b.psgc);
  if (!barangay) throw new Error(`Unknown barangay PSGC in src/data/officials.json: ${b.psgc}`);
  return { ...b, barangay };
});

export const orgNodes: OrgNode[] = [
  {
    id: "lgu",
    kind: "lgu",
    name: "Municipality of Plaridel",
    position: "Bulacan · 19 barangays",
    childrenLabel: "officials",
    description: "The local government unit, led by an executive (the Mayor) and a legislature (the Sangguniang Bayan).",
    contacts: data.contacts.lgu,
  },
  {
    id: "mayor",
    parentId: "lgu",
    kind: "executive",
    ...fromWinner(mayor),
    position: "Municipal Mayor",
    childrenLabel: "barangays",
    description: "Local chief executive. Runs the municipal government and its offices, and supervises the barangays.",
    contacts: data.contacts.mayor,
  },
  {
    id: "vice-mayor",
    parentId: "lgu",
    kind: "legislative",
    ...fromWinner(viceMayor),
    position: "Municipal Vice Mayor",
    childrenLabel: "council members",
    description: "Presiding officer of the Sangguniang Bayan, and first in line to succeed the Mayor.",
    contacts: data.contacts["vice-mayor"],
  },
  ...councilors.map(
    (c, i): OrgNode => ({
      id: `councilor-${i + 1}`,
      parentId: "vice-mayor",
      kind: "member",
      ...fromWinner(c),
      position: "Municipal Councilor",
      description: "Elected member of the Sangguniang Bayan. Drafts and passes municipal ordinances and resolutions.",
    }),
  ),
  ...barangays.flatMap((b): OrgNode[] => {
    const id = `brgy-${b.barangay.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return [
      {
        id,
        parentId: "mayor",
        kind: "barangay",
        name: `Hon. ${b.captain}`,
        position: `Punong Barangay · ${b.barangay}`,
        childrenLabel: "officials",
        description: `Barangay captain of ${b.barangay}, under the general supervision of the Mayor.`,
        rosters: [{ label: "Barangay Secretary", people: [b.secretary] }],
      },
      ...b.kagawad.map(
        (name, i): OrgNode => ({
          id: `${id}-kagawad-${i + 1}`,
          parentId: id,
          kind: "kagawad",
          name: `Hon. ${name}`,
          position: `Barangay Kagawad · ${b.barangay}`,
          description: `Member of the Sangguniang Barangay of ${b.barangay}. Passes barangay ordinances and resolutions.`,
        }),
      ),
      // The SK Chairperson sits on the barangay council (ex officio) and leads the youth council.
      {
        id: `${id}-sk`,
        parentId: id,
        kind: "sk-chair",
        name: `Hon. ${b.skChair}`,
        position: `SK Chairperson · ${b.barangay}`,
        childrenLabel: "SK officials",
        description: `Leads the Sangguniang Kabataan (youth council) of ${b.barangay}, and sits on the barangay council.`,
      },
      ...b.skKagawad.map(
        (name, i): OrgNode => ({
          id: `${id}-sk-kagawad-${i + 1}`,
          parentId: `${id}-sk`,
          kind: "sk-member",
          name: `Hon. ${name}`,
          position: `SK Kagawad · ${b.barangay}`,
          description: `Member of the Sangguniang Kabataan of ${b.barangay}. Plans and runs youth programs.`,
        }),
      ),
      {
        id: `${id}-sk-secretary`,
        parentId: `${id}-sk`,
        kind: "sk-member",
        name: b.skSecretary,
        position: `SK Secretary · ${b.barangay}`,
        description: `Appointed secretary of the Sangguniang Kabataan of ${b.barangay}.`,
      },
    ];
  }),
];

// The Officials page covers the municipal government; barangay officials live on the Barangays page.
const municipalKinds: OrgNodeKind[] = ["lgu", "executive", "legislative", "member"];
export const municipalNodes = orgNodes.filter((n) => municipalKinds.includes(n.kind));
export const punongBarangays = orgNodes.filter((n) => n.kind === "barangay");
