import { useEffect, type RefObject } from "react";

// The navbar's height once the page is scrolled; the panel locks just below it.
const NAVBAR = 40;
// How long a step blocks the next one, and how long trackpad momentum must pause before a new gesture counts.
const STEP_MS = 800;
const MOMENTUM_GAP_MS = 150;

// Desktop wheel scrolling moves one stop per gesture, in its direction: the top of the page, the panel locked under
// the navbar, and the footer. While the panel is locked, wheeling over something that can still scroll that way (the
// office list) scrolls it as usual. Keyboard and scrollbar scrolling, pinch-zoom (ctrl + wheel) and phones are left
// alone. CSS scroll snapping can't do this: it snaps a short scroll back to the nearest stop instead of moving on.
export function useScrollStops(panel: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lockedUntil = 0;

    function onWheel(e: WheelEvent) {
      if (!desktop.matches || e.ctrlKey || e.deltaY === 0 || !panel.current) return;
      const down = e.deltaY > 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const panelStop = Math.min(max, panel.current.getBoundingClientRect().top + y - NAVBAR);

      if (Math.abs(y - panelStop) <= 2 && canScroll(e.target, down)) return;
      e.preventDefault();

      const now = performance.now();
      if (now < lockedUntil) {
        lockedUntil = Math.max(lockedUntil, now + MOMENTUM_GAP_MS);
        return;
      }
      const stops = [0, panelStop, max];
      const next = down ? stops.find((s) => s > y + 2) : stops.findLast((s) => s < y - 2);
      if (next === undefined) return;
      lockedUntil = now + STEP_MS;
      window.scrollTo({ top: next, behavior: reducedMotion.matches ? "auto" : "smooth" });
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [panel]);
}

// Whether the wheel's target, or a scrolling box around it, can still scroll in that direction.
function canScroll(target: EventTarget | null, down: boolean) {
  for (let el = target instanceof Element ? target : null; el && el !== document.documentElement; el = el.parentElement) {
    if (!/auto|scroll/.test(getComputedStyle(el).overflowY) || el.scrollHeight <= el.clientHeight) continue;
    if (down ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
  }
  return false;
}
