// Chart colors, checked for color-blind separation and contrast against the white card surface.
export const chartColors = {
  accent: "#047857", // brand; single-series bars and the selected barangay
  context: "#cbd5e1", // bars pushed to the background while a barangay is selected
  urban: "#047857",
  rural: "#e5a800",
  male: "#2a78d6",
  female: "#e87ba4",
} as const;

// Map shading by residents per km², light to dark.
export const densityRamp = ["#60c599", "#29a979", "#0a8b61", "#096d4c", "#095238"] as const;
export const densityBreaks = [2000, 4000, 6000, 8000] as const;
export const densityClass = (perKm2: number) => densityBreaks.filter((b) => perKm2 >= b).length;
// Dark text for the map: softer than black, but darker than the site's text so it stays readable on the greens.
export const mapInk = "#1e293b";
// The two lightest shades need dark text; the rest take white.
export const densityInk = (cls: number) => (cls < 2 ? mapInk : "#ffffff");
