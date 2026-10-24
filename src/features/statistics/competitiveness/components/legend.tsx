import { AVERAGE_COLOR } from "@/features/statistics/components/average-tick";
import { colors } from "../format";

// Key for charts that pair Plaridel's bar with a category-average tick.
export function PlaridelVsAverageLegend({ tick }: { tick: "horizontal" | "vertical" }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex items-center gap-1">
        <span aria-hidden className="size-2.5 rounded-[2px]" style={{ backgroundColor: colors.plaridel }} />
        Plaridel
      </span>
      <span className="flex items-center gap-1">
        <span
          aria-hidden
          className={tick === "horizontal" ? "h-0.5 w-3 rounded-full" : "h-3 w-0.5 rounded-full"}
          style={{ backgroundColor: AVERAGE_COLOR }}
        />
        Category average
      </span>
    </span>
  );
}
