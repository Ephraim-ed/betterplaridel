// Local money in the brand green, national money in the yellow used for comparisons elsewhere on the dashboard.
export const incomeColors = {
  local: "#047857",
  nta: "#e5a800",
  interest: "#94a3b8",
  otherShares: "#cbd5e1",
} as const;

// Plaridel's own revenue sources, darkest for the biggest.
export const sourceColors: Record<string, string> = {
  business: "#095238",
  realProperty: "#096d4c",
  regulatory: "#0a8b61",
  economicEnterprises: "#29a979",
  serviceCharges: "#60c599",
  otherTaxes: "#a7dfc4",
};
