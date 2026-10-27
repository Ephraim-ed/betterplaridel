import { cn } from "cn";

// The symbol and the "BetterPlaridel .org" wordmark. `onDark` turns the whole mark white; `collapsed` folds the
// wordmark away, leaving the symbol; `intro` plays a short entrance when it first appears.
// The symbol tilts and bounces when the logo is hovered.
export function BrandLogo({
  onDark = false,
  large = false,
  collapsed = false,
  intro = false,
  className,
}: {
  onDark?: boolean;
  large?: boolean;
  collapsed?: boolean;
  intro?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("group/logo flex items-center font-semibold tracking-tight", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/betterplaridel-symbol.svg"
        alt=""
        aria-hidden
        className={cn(
          "w-auto transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/logo:scale-110 group-hover/logo:-rotate-6 motion-reduce:transition-none",
          large ? "h-10" : collapsed ? "h-6" : "h-8",
          onDark && "brightness-0 invert",
          intro && "animate-in duration-700 fade-in-0 zoom-in-50 spin-in-12",
        )}
      />
      {/* A one-column grid collapses smoothly from the wordmark's width to nothing. */}
      <span
        className={cn(
          "grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none",
          collapsed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100",
        )}
      >
        <span
          className={cn(
            "flex flex-col items-end overflow-hidden pl-2",
            onDark ? "text-white" : "text-brand",
            intro && "animate-in delay-200 duration-500 fill-mode-backwards fade-in-0 slide-in-from-left-3",
          )}
        >
          <span
            className={cn(
              "leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap transition-[font-size] duration-300",
              large ? "text-2xl" : "text-xl",
            )}
          >
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
    </span>
  );
}
