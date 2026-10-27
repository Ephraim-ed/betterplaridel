import { cn } from "cn";

// The symbol and the "BetterPlaridel .org" wordmark. `onDark` turns the whole mark white.
export function BrandLogo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/betterplaridel-symbol.svg"
        alt=""
        aria-hidden
        className={cn("h-8 w-auto", onDark && "brightness-0 invert")}
      />
      <span className={cn("flex flex-col items-end", onDark ? "text-white" : "text-brand")}>
        <span className="text-xl leading-none font-extrabold tracking-[-0.04em]">
          <span className="font-medium">Better</span>Plaridel
        </span>
        <span
          className={cn(
            "-mt-0.5 font-mono text-[0.6rem] leading-none font-medium",
            onDark ? "text-white/70" : "text-brand/70",
          )}
        >
          .org
        </span>
      </span>
    </span>
  );
}
