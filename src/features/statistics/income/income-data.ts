// Annual Regular Income (ARI) and Dependencies, FY 2024 (preliminary), by the Bureau of Local Government Finance
// (BLGF). Raw copy: src/data/income.json; its "source" block has the dataset link and notes. Amounts are in pesos.
// ARI = locally sourced revenue + interest income + National Tax Allotment + other shares from national taxes.
import data from "@/data/income.json";

export const FISCAL_YEAR = data.fiscalYear;

export type IncomeSource = { key: string; label: string; amount: number };

// Plaridel's locally sourced revenue (LSR), by source.
export const localSources: IncomeSource[] = data.localSources;

export type Lgu = { name: string; local: number; interest: number; nta: number; otherShares: number };

export const totalIncome = (l: Lgu) => l.local + l.interest + l.nta + l.otherShares;
// BLGF's "LSR dependency": the share of regular income the LGU raises on its own.
export const selfReliance = (l: Lgu) => l.local / totalIncome(l);

// Bulacan's 20 municipalities, largest income first. Its four cities are left out, so like is compared with like.
export const bulacan: Lgu[] = data.bulacan;

export const plaridel = bulacan.find((l) => l.name === "Plaridel")!;

// Across the municipalities nationwide with FY 2024 data (computed from the same sheet).
export const nationwide = data.nationwide;

export const peso = {
  millions: (n: number) => `₱${(n / 1e6).toLocaleString("en-PH", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`,
  full: (n: number) => `₱${Math.round(n).toLocaleString("en-PH")}`,
};

export const percent = (n: number, digits = 1) =>
  n.toLocaleString("en-PH", { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits });
