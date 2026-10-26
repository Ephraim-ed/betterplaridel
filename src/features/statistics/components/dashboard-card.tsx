import type { ReactNode } from "react";
import { cn } from "cn";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoHint } from "./info-hint";

// A compact card whose content stretches to fill its slot in the dashboard grid.
export function DashboardCard({
  title,
  hint,
  action,
  className,
  children,
}: {
  title: string;
  // Explains the card's main term in an "i" beside the title.
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card size="sm" className={cn("min-h-0 overflow-visible [&_.recharts-tooltip-wrapper]:z-50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          {title}
          {hint && <InfoHint label={title}>{hint}</InfoHint>}
        </CardTitle>
        {action && <CardAction className="text-xs text-muted-foreground">{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">{children}</CardContent>
    </Card>
  );
}

// Headline figure and notes on the left, a chart (or details) on the right.
// `wideSide` gives the right side more room, for lists with longer labels.
export function StatBody({
  value,
  notes,
  side,
  wideSide = false,
}: {
  value: ReactNode;
  notes: ReactNode;
  side: ReactNode;
  wideSide?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid min-h-0 flex-1 gap-3",
        wideSide ? "grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]" : "grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
      )}
    >
      <div className="flex flex-col justify-center">
        <p className="text-2xl leading-none font-semibold tracking-tight whitespace-nowrap xl:text-3xl">{value}</p>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">{notes}</div>
      </div>
      <div className="h-32 min-h-0 lg:h-auto">{side}</div>
    </div>
  );
}
