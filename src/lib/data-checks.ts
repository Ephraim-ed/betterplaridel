// Helpers for the *-data.ts files that turn the raw JSON in src/data/ into typed data.

// Narrows a JSON value to one of the allowed literals, e.g. a directory category or a census year.
// JSON can't carry literal types, so this checks the value instead of trusting a cast: a typo in the
// JSON fails loudly when the page loads, rather than rendering an empty section.
export function oneOf<const T extends string | number>(allowed: readonly T[], value: unknown, what: string): T {
  if (!allowed.includes(value as T)) throw new Error(`Unknown ${what} in src/data: ${JSON.stringify(value)}`);
  return value as T;
}
