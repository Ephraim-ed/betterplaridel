// Annual Regular Income (ARI) and Dependencies, FY 2024 (preliminary), by the Bureau of Local Government Finance
// (BLGF), from its electronic Statement of Receipts and Expenditures system; extracted March 17, 2025. Listed on
// https://data.bettergov.ph/datasets/9/resources/31. Amounts are in pesos (the sheet's "In Php Million" header is wrong).
// ARI = locally sourced revenue + interest income + National Tax Allotment + other shares from national taxes.

export const FISCAL_YEAR = 2024;

export type IncomeSource = { key: string; label: string; amount: number };

// Plaridel's locally sourced revenue (LSR), by source.
export const localSources: IncomeSource[] = [
  { key: "business", label: "Tax on business", amount: 165373125.95 },
  { key: "realProperty", label: "Real property tax", amount: 34461123.01 },
  { key: "otherTaxes", label: "Other taxes", amount: 1961884.19 },
  { key: "regulatory", label: "Regulatory fees", amount: 21299636.55 },
  { key: "economicEnterprises", label: "Economic enterprises", amount: 11540642.8 },
  { key: "serviceCharges", label: "Service and user charges", amount: 4614322.5 },
];

export type Lgu = { name: string; local: number; interest: number; nta: number; otherShares: number };

export const totalIncome = (l: Lgu) => l.local + l.interest + l.nta + l.otherShares;
// BLGF's "LSR dependency": the share of regular income the LGU raises on its own.
export const selfReliance = (l: Lgu) => l.local / totalIncome(l);

// Bulacan's 20 municipalities, largest income first. Its four cities are left out, so like is compared with like.
export const bulacan: Lgu[] = [
  { name: "Marilao", local: 607820162.7, interest: 1134084.88, nta: 644204217, otherShares: 0 },
  { name: "Santa Maria", local: 410218083.61, interest: 1057025.14, nta: 739801797, otherShares: 0 },
  { name: "Guiguinto", local: 439367612.77, interest: 0, nta: 317757411, otherShares: 325854.17 },
  { name: "Pulilan", local: 381099741.57, interest: 0, nta: 310269240.96, otherShares: 659338.66 },
  { name: "Norzagaray", local: 156263658.31, interest: 233947.21, nta: 434405691.96, otherShares: 6330862.57 },
  { name: "Bocaue", local: 211888859.75, interest: 205473.37, nta: 383332758, otherShares: 509668.12 },
  { name: "San Miguel", local: 82037144.39, interest: 109814.88, nta: 503249937.96, otherShares: 159786.5 },
  { name: "Plaridel", local: 239250735, interest: 5224292.43, nta: 321320435.04, otherShares: 300713.49 },
  { name: "San Ildefonso", local: 210984562.91, interest: 0, nta: 348050292.96, otherShares: 1195444.27 },
  { name: "San Rafael", local: 187327876.7, interest: 401180.27, nta: 324846026.04, otherShares: 0 },
  { name: "Pandi", local: 81223635.67, interest: 84034.64, nta: 414734505.96, otherShares: 0 },
  { name: "Calumpit", local: 137167778.31, interest: 167124.02, nta: 336506082.96, otherShares: 335325 },
  { name: "Hagonoy", local: 82956998.52, interest: 25590.71, nta: 382580231.04, otherShares: 0 },
  { name: "Bulacan", local: 174870011.34, interest: 84734.52, nta: 254832159.96, otherShares: 0 },
  { name: "Doña Remedios Trinidad", local: 38787619.98, interest: 0, nta: 346150479, otherShares: 1301971.75 },
  { name: "Balagtas", local: 149979324.1, interest: 73705.9, nta: 234197124.96, otherShares: 0 },
  { name: "Bustos", local: 60784497.99, interest: 23377.62, nta: 244822670.04, otherShares: 0 },
  { name: "Angat", local: 82094132.71, interest: 264013.94, nta: 219131999.04, otherShares: 145923.67 },
  { name: "Obando", local: 39350109.85, interest: 41689.39, nta: 200732247, otherShares: 0 },
  { name: "Paombong", local: 23053813.01, interest: 33366.23, nta: 189445187.04, otherShares: 140894.63 },
];

export const plaridel = bulacan.find((l) => l.name === "Plaridel")!;

// Across the 1481 municipalities nationwide with FY 2024 data (computed from the same sheet).
export const nationwide = {
  count: 1481,
  incomeRank: 79,
  selfRelianceRank: 34,
  medianSelfReliance: 0.0872,
};

export const peso = {
  millions: (n: number) => `₱${(n / 1e6).toLocaleString("en-PH", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`,
  full: (n: number) => `₱${Math.round(n).toLocaleString("en-PH")}`,
};

export const percent = (n: number, digits = 1) =>
  n.toLocaleString("en-PH", { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits });
