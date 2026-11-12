"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/** Clips its child image and drifts it vertically (≤ 40px) as the section scrolls past. */
export function ParallaxImage({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <m.div style={{ y }} className="absolute -inset-y-12 inset-x-0">
        {children}
      </m.div>
    </div>
  );
}
