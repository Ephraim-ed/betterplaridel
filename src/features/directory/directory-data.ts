// Municipal Hall telephone directory: one trunkline, then a 4-digit local per office.
// Raw copy: src/data/directory.json. To update an extension, change its entry there. VACANT locals are left out on purpose.
import data from "@/data/directory.json";
import { oneOf } from "@/lib/data-checks";

const CATEGORIES = ["exec", "finance", "safety", "social", "admin"] as const;
export type DirectoryCategory = (typeof CATEGORIES)[number];
const category = (c: unknown) => oneOf(CATEGORIES, c, "directory category");

export type DirectoryEntry = { category: DirectoryCategory; name: string; local: string };

// Includes Bulacan's (044) area code so it works from mobile phones.
export const TRUNKLINE = data.trunkline;

export const LAST_UPDATED = data.lastUpdated;

export const categories: { id: DirectoryCategory; label: string; chip: string }[] = data.categories.map((c) => ({
  ...c,
  id: category(c.id),
}));

// Matches an office by name (case-insensitive) or local number.
export const matchesQuery = (e: DirectoryEntry, q: string) =>
  !q || e.name.toLowerCase().includes(q) || e.local.includes(q);

export const entries: DirectoryEntry[] = data.entries.map((e) => ({ ...e, category: category(e.category) }));
