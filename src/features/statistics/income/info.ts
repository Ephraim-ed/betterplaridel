// Plain-language explanations of BLGF's income terms, simplified; BLGF's eSRE manual has the exact definitions.

export const terms = {
  income:
    "The money the municipal government can count on every year: the taxes and fees it collects, its share of national taxes, and interest. One-time money such as loans and grants is not included.",
  selfReliance:
    "The share of regular income Plaridel raises on its own (BLGF calls this LSR dependency). The higher it is, the less the town relies on money from the national government.",
  localRevenue:
    "Taxes, fees and charges Plaridel collects itself, plus income from the businesses it runs. BLGF calls this locally sourced revenue (LSR).",
};

export const sourceInfo: Record<string, string> = {
  business: "Tax on businesses operating in town, mostly based on their gross sales or receipts.",
  realProperty: "The yearly tax on land, buildings and machinery. Only the General Fund share is counted here.",
  otherTaxes: "Smaller local taxes, such as the community tax (cedula).",
  regulatory: "Fees for permits and licences, such as business and building permits.",
  economicEnterprises: "Income from businesses the municipality runs, such as a public market or slaughterhouse.",
  serviceCharges: "Charges for services the municipality provides, such as issuing documents.",
  nta: "Plaridel's share of national taxes, released to the town each year under the Local Government Code.",
  otherShares: "Shares from specific national revenues, such as PCSO and lotto proceeds.",
  interest: "Interest earned on the municipality's bank deposits.",
};
