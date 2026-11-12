"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

export type FaqItem = { q: string; a: string };

/** Accessible accordion (one panel open at a time). */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-panel)] border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${uid}-q${i}`;
        const panel = `${uid}-a${i}`;
        return (
          <li key={item.q} className={cn("relative transition-colors duration-300", isOpen && "bg-rose/45")}>
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 left-0 w-[3px] origin-top bg-racing transition-transform duration-500 ease-[var(--ease-out-expo)]",
                isOpen ? "scale-y-100" : "scale-y-0",
              )}
            />
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8 sm:py-6"
              >
                <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-[-0.02em] text-ink sm:text-lg">{item.q}</span>
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)]",
                    isOpen ? "rotate-45 border-racing/40 bg-red-tint text-racing-deep" : "border-line text-ink group-hover:border-ink/30",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl px-6 pb-6 text-[15px] leading-relaxed text-ink-soft/85 sm:px-8">{item.a}</p>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
