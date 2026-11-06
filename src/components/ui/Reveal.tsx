"use client";

import { m, type Variants } from "motion/react";
import { EASE_OUT, DURATION } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/** Fades and lifts its content once, the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.section, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
}

const group: Variants = { hidden: {}, show: {} };
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE_OUT } },
};

/** Parent that staggers its <RevealItem> children into view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={{ ...group, show: { transition: { staggerChildren: stagger } } }}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
