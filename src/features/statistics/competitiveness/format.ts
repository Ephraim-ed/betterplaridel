// Plaridel against everyone else; the same validated brand and context colors as the demographics charts.
export const colors = { plaridel: "#047857", others: "#cbd5e1" } as const;

export const score = (n: number) => n.toFixed(2);

export const signedScore = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(2)}`;

// 1 → "st", 2 → "nd", 11 → "th", 46 → "th"
export function ordinalSuffix(n: number) {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] ?? "th";
}
