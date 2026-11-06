"use client";

import { m } from "motion/react";
import { cn } from "@/lib/cn";
import type { FleetFilterValue } from "./FleetSection";

const LABELS: Partial<Record<FleetFilterValue, string>> = { All: "All Cars" };

export function FleetFilter({
  options,
  value,
  onChange,
  counts,
}: {
  options: FleetFilterValue[];
  value: FleetFilterValue;
  onChange: (v: FleetFilterValue) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div role="group" aria-label="Filter cars by category" className="inline-flex gap-1 rounded-full border border-line bg-mist p-1">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt)}
              className={cn(
                "relative inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-200",
                active ? "text-white" : "text-muted hover:text-ink",
              )}
            >
              {active && (
                <m.span
                  layoutId="fleet-filter-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{LABELS[opt] ?? opt}</span>
              <span
                className={cn(
                  "relative rounded-full px-1.5 text-[11px] tabular-nums transition-colors",
                  active ? "bg-white/15 text-white" : "bg-white text-muted",
                )}
              >
                {counts[opt] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
