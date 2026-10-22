// Pill style shared by category chips (Hotlines page navigation, directory filters).
export function chipClass(active = false) {
  return `inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
    active ? "border-brand bg-brand font-medium text-white" : "border-line text-muted-foreground hover:text-foreground"
  }`;
}
