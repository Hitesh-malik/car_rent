"use client";

import { m, useReducedMotion } from "motion/react";

/**
 * Gentle image reveal: the frame opens from a slight inset as it scrolls into view (once).
 * The initial state is identical on server and client (no hydration mismatch); reduced motion
 * only shortens the transition to an instant change.
 */
export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ clipPath: "inset(6% 6% 6% 6% round 2rem)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
