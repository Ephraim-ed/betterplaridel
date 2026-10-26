import type { ReactNode } from "react";
import { Tooltip } from "radix-ui";

// A small "i" that explains a term on hover or keyboard focus. The tooltip is portalled to the page body,
// so the card it sits in can't clip it.
export function InfoHint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={`What is ${label}?`}
            className="inline-grid size-3.5 shrink-0 cursor-help place-items-center rounded-full border border-muted-foreground/50 text-[9px] leading-none font-semibold text-muted-foreground transition-colors outline-none hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand"
          >
            i
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            collisionPadding={12}
            className="z-50 max-w-64 animate-in rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl fade-in-0 zoom-in-95"
          >
            <p className="font-medium">{label}</p>
            <p className="mt-0.5 text-muted-foreground">{children}</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
