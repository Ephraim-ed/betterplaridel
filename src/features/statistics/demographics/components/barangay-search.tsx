import { useId, useState, type KeyboardEvent } from "react";
import { Search } from "@/components/animate-ui/icons/search";
import { Input } from "@/components/ui/input";
import { barangays, fmt, LATEST, matchesName, type Barangay } from "../data";

export function BarangaySearch({ onSelect, className = "" }: { onSelect: (b: Barangay) => void; className?: string }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = barangays.filter((b) => matchesName(b, query));
  const current = open ? results[active] : undefined;

  function choose(b: Barangay) {
    onSelect(b);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && current) {
      e.preventDefault();
      choose(current);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        role="combobox"
        aria-label="Search barangay"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={current ? `${listId}-${current.slug}` : undefined}
        placeholder="Search barangay…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-10 bg-background pl-9"
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Barangays"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-line bg-popover p-1 shadow-lg"
        >
          {results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No barangay matches.</li>}
          {results.map((b, i) => (
            <li
              key={b.slug}
              id={`${listId}-${b.slug}`}
              role="option"
              aria-selected={i === active}
              // mousedown, not click, so the input's blur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                choose(b);
              }}
              onMouseEnter={() => setActive(i)}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-muted"
            >
              <span>{b.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {fmt.number(b.population[LATEST])} residents
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
