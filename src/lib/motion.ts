import type { Transition, Variants } from "motion/react";

/** Shared easing: a refined ease-out (fast start, long settle). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  micro: 0.2,
  base: 0.3,
  section: 0.55,
} as const;

export const springSoft: Transition = { type: "spring", stiffness: 380, damping: 34, mass: 0.8 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE_OUT } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});
