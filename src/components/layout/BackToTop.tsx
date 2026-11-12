"use client";

import { useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

/** Appears after ~1.5 screens of scrolling; returns to the top (instantly under reduced motion). */
export function BackToTop() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 1.5));

  return (
    <AnimatePresence>
      {show && (
        <m.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="fixed bottom-24 right-4 z-40 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-night/90 text-white shadow-[var(--shadow-lift)] backdrop-blur-md transition-colors hover:bg-racing sm:right-6 lg:bottom-6"
        >
          <ArrowUp className="size-4" aria-hidden />
        </m.button>
      )}
    </AnimatePresence>
  );
}
