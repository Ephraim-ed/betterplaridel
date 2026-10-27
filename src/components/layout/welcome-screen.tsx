import { createContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

const STORAGE_KEY = "betterplaridel:welcome";
const SHOWN_FOR_MS = 2600;
const ease = [0.76, 0, 0.24, 1] as const;

// True while the welcome screen covers the page, so things that open by themselves (like the statistics tour)
// can wait for it.
export const WelcomeContext = createContext(false);

// Plays once per browser session, on the first page a visitor opens. Visitors who prefer reduced motion skip it.
function shouldShow() {
  try {
    return !sessionStorage.getItem(STORAGE_KEY) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
});

export function WelcomeScreen({ children }: { children: ReactNode }) {
  const [showing, setShowing] = useState(shouldShow);

  useEffect(() => {
    if (!showing) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      // Not remembering only means it plays again on the next load.
    }
    const timer = setTimeout(() => setShowing(false), SHOWN_FOR_MS);
    return () => clearTimeout(timer);
  }, [showing]);

  return (
    <WelcomeContext.Provider value={showing}>
      {children}
      <AnimatePresence>
        {showing && (
          // Blurs and fades away. The backdrop blur fades with it, so the page comes into focus as it appears.
          // A click or tap skips ahead.
          <motion.div
            key="welcome"
            onClick={() => setShowing(false)}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-brand-deep px-6 text-center text-white backdrop-blur-xl"
          >
            <motion.div
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.img
                src="/betterplaridel-symbol.svg"
                alt=""
                aria-hidden
                initial={{ opacity: 0, scale: 0.6, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="h-20 w-auto brightness-0 invert sm:h-24"
              />
              <motion.p {...rise(0.35)} className="mt-7 text-xs font-medium tracking-[0.3em] text-white/70 uppercase">
                Welcome to
              </motion.p>
              <motion.p {...rise(0.5)} className="mt-2 text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">
                <span className="font-medium">Better</span>Plaridel
              </motion.p>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.85, duration: 0.6, ease }}
                className="mt-5 h-1 w-16 rounded-full bg-brand-yellow"
              />
              <motion.p {...rise(1)} className="mt-4 flex items-center gap-2 text-sm text-white/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bettergov-icon.svg" alt="" aria-hidden className="h-8 w-auto opacity-80 brightness-0 invert" />
                a part of BetterGov.ph
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WelcomeContext.Provider>
  );
}
