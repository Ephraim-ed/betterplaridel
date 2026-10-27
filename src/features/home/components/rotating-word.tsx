import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SHOWN_FOR_MS = 8000;
const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

// Shows each word in turn, sliding the next one up into place. The slot eases to each word's width, so the text
// after it glides along instead of jumping. Visitors who prefer reduced motion just see the first word.
export function RotatingWord({ words }: { words: readonly string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const sizers = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), SHOWN_FOR_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, words.length]);

  // Measures every word once it renders, and again if the font or size changes.
  useEffect(() => {
    const observer = new ResizeObserver(() =>
      setWidths(sizers.current.map((el) => el?.getBoundingClientRect().width ?? 0)),
    );
    sizers.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [words]);

  return (
    <motion.span
      initial={false}
      animate={widths[index] ? { width: widths[index] } : undefined}
      transition={transition}
      // Overflow is clipped so words slide in and out of view; aligning its bottom with the line keeps the baseline.
      className="relative inline-block overflow-hidden align-bottom whitespace-nowrap"
    >
      {words.map((word, i) => (
        <span
          key={word}
          ref={(el) => {
            sizers.current[i] = el;
          }}
          aria-hidden
          className="invisible absolute top-0 left-0"
        >
          {word}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={transition}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
