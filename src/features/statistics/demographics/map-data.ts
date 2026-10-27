// Barangay outlines of Plaridel as SVG paths (north up). Raw copy: src/data/barangay-shapes.json, keyed by
// PSGC code; its "source" block has the provenance. `center` is the shape's most interior point; `label`
// holds the name's lines, or null when it doesn't fit.
import data from "@/data/barangay-shapes.json";

export const MAP_SIZE = data.size;
export const LABEL_SIZE = 12;

export type BarangayShape = { d: string; center: [number, number]; label: string[] | null };

export const barangayShapes: Record<string, BarangayShape> = Object.fromEntries(
  Object.entries(data.shapes).map(([psgc, s]) => [psgc, { ...s, center: [s.center[0], s.center[1]] }]),
);
