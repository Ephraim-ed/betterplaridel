---
name: data-pipeline
description: How BetterPlaridel stores and uses data. Use whenever adding, updating, importing or extracting data (officials, hotlines, statistics, elections, barangays, services, announcements, any list or dataset), or when a component needs data. Every dataset is copied into src/data/<topic>.json, processed in a feature's <topic>-data.ts, and only then used by components.
---

# Data pipeline: extract → JSON → process → frontend

All of BetterPlaridel's data flows one way, so there is one place to find and update it:

```
source (website, PDF, API, spreadsheet)
  → src/data/<topic>.json                        raw copy, never edited by code
  → src/features/<feature>/<topic>-data.ts      types, derived values, helpers
  → components                                   import only from *-data.ts
```

## 1. Extract

- Copy the source data **once** into `src/data/<topic>.json`. The site never fetches its data at runtime.
- Don't commit fetch or scrape scripts. If a script helps with the extraction, keep it outside the repo
  and commit only the JSON it produces.
- Before adding a file, check `src/data/` first. If the data belongs to something that already exists
  (e.g. a barangay field), add it to that file instead of making a new one.

## 2. JSON format (`src/data/<topic>.json`)

- **File name:** kebab-case and plural, e.g. `barangays.json`, `hotlines.json`, `barangay-shapes.json`.
- **Source block at the top.** JSON can't hold comments, so provenance goes here:
  ```json
  "source": { "label": "Who published it", "url": "https://…", "retrieved": "2026-10-27", "notes": "Caveats, TODOs" }
  ```
  - Use `"sources": [ … ]` when the file combines several.
  - `url`, `retrieved` and `notes` are optional. **Leave out what you don't know; never guess a date or URL.**
  - Use `vintage` for the date of the data itself, as opposed to the date you copied it.
- **Keys:** camelCase.
- **Values are raw, not formatted:**
  - Numbers are JSON numbers, never strings.
  - Money is in pesos (`239250735`, not `"₱239.3M"`), and percents are fractions (`0.42`).
  - Dates are ISO (`2026-10-27`) unless the source only gives a month or year.
  - Phone numbers are stored as the source writes them (`"(044) 794-0119"`, `"*888"`, `"TBA"`).
    `src/features/hotlines/format.ts` formats them for display (`formatNumber`) and dialing (`tel`).
- **Nothing derived:** no slugs, totals, shares, ranks you could compute, or display labels. TS computes those.
- **IDs:**
  - Barangays are referenced by **PSGC code** (a string such as `"0301417001"`), never by name.
  - Records that components list or look up get a stable kebab-case `id`.
- **Shared data is stored once.** `barangays.json` is the only list of Plaridel's 19 barangays; other files
  point to it by PSGC (see `officials.json`, and the Barangays group in `hotlines-data.ts`).
- **No UI in JSON:** no React components, icons or Tailwind classes. Refer to an icon by a key
  (`"icon": "file-text"`) and map the key to the component in TS (see `services-data.ts`).

## 3. Process (`src/features/<feature>/<topic>-data.ts`)

- This is the **only** file that imports the JSON: `import data from "@/data/<topic>.json";`.
- **Header comment:** what the data is and where its raw copy lives (`Raw copy: src/data/<topic>.json`).
- **What goes here:**
  - the TypeScript types
  - typed exports
  - derived values: slugs, totals, joins with `barangays.json`
  - helpers such as `matchesQuery` and `fmt`
- **Typing:**
  - Annotate exports: `export const entries: DirectoryEntry[] = data.entries;`
  - JSON can't carry literal types. For enum-like fields (a category, a position, a census year), check
    the value with `oneOf` from `src/lib/data-checks.ts` instead of casting:
    ```ts
    const CATEGORIES = ["exec", "finance"] as const;
    export type DirectoryCategory = (typeof CATEGORIES)[number];
    export const entries = data.entries.map((e) => ({ ...e, category: oneOf(CATEGORIES, e.category, "directory category") }));
    ```
    A typo in the JSON then fails loudly when the page loads, instead of rendering an empty section.
- **Joins:** look the PSGC up in `barangays.json`, and throw on an unknown code (see `official-data.ts`).

## 4. Frontend

- Components import from `*-data.ts` only, **never** from `@/data/*.json`.
- Check with: `grep -rln "@/data/" src --include=*.tsx` (it should print nothing).

## What is *not* data

These stay in TS/TSX:
- **Page text:** headings, the hero, the FAQ, "how it works" steps, tour text and term explanations (`info.ts`).
  A feature's page text goes in `<feature>-content.ts` (e.g. `src/features/home/home-content.ts`).
- **Presentation:** colours (`colors.ts`) and formatters (`format.ts`).
- **Site config:** navigation, footer and branding in `src/site.config.ts`.

## Current files

| JSON in `src/data/` | Processed by |
|---|---|
| `barangays.json` (shared) | `statistics/demographics/demographics-data.ts`, plus joins in `hotlines-data.ts` and `official-data.ts` |
| `demographics.json` | `statistics/demographics/demographics-data.ts` |
| `barangay-shapes.json` | `statistics/demographics/map-data.ts` |
| `competitiveness.json` | `statistics/competitiveness/competitiveness-data.ts` |
| `income.json` | `statistics/income/income-data.ts` |
| `elections.json` | `government/elections/election-data.ts` |
| `officials.json` | `government/officials/official-data.ts` (municipal officials come from `elections.json`) |
| `hotlines.json` | `hotlines/hotlines-data.ts` |
| `directory.json` | `directory/directory-data.ts` |
| `services.json` | `services/services-data.ts` |
| `announcements.json` | `announcements/announcements-data.ts` |

Keep this table up to date when you add a file.

## Checklist before committing

1. Run `npx tsc --noEmit` and `npx eslint src`. Both must be clean.
2. Run `grep -rln "@/data/" src --include=*.tsx`. It must print nothing.
3. Open the affected pages on the running dev server (`http://localhost:3000`) and check them.
   **Never stop the dev server on port 3000, and never run `npm run build` while it's running.**
   If you need your own server, use `npx next dev -p 3100` and stop only that one.
4. When changing existing data, check that it didn't change by accident. Compare the old and new exports
   of the `*-data.ts` file, or review the JSON diff line by line.
5. In the commit description, name the source and the date it was retrieved.
