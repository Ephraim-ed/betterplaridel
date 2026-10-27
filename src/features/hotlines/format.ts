// Keeps digits, +, * and # so codes like *888 still dial.
export const tel = (number: string) => `tel:${number.replace(/[^\d+*#]/g, "").replace(/#/g, "%23")}`;

// Formats every number the same way: 0976 250 2143, (02) 8667 0850, (044) 812 5805, 911.
export function formatNumber(number: string) {
  const d = number.replace(/\D/g, "");
  if (/^09\d{9}$/.test(d)) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  if (/^02\d{8}$/.test(d)) return `(02) ${d.slice(2, 6)} ${d.slice(6)}`;
  if (/^0\d{9}$/.test(d)) return `(${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`;
  return number;
}
