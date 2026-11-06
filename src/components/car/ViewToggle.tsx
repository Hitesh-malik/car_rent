"use client";

import { m } from "motion/react";
import { Box, Images } from "lucide-react";
import { cn } from "@/lib/cn";

export type ShowcaseMode = "photos" | "3d";

const OPTIONS: { value: ShowcaseMode; label: string; icon: typeof Images }[] = [
  { value: "photos", label: "Photos", icon: Images },
  { value: "3d", label: "3D View", icon: Box },
];

export function ViewToggle({
  value,
  onChange,
  has3D,
}: {
  value: ShowcaseMode;
  onChange: (v: ShowcaseMode) => void;
  has3D: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Vehicle view" className="inline-flex rounded-full border border-line bg-white p-1 shadow-[var(--shadow-soft)]">
      {OPTIONS.map(({ value: v, label, icon: Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                onChange(v === "photos" ? "3d" : "photos");
                const sibling = (e.currentTarget.parentElement?.querySelector(`[aria-checked="false"]`) as HTMLElement | null);
                sibling?.focus();
              }
            }}
            tabIndex={active ? 0 : -1}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200 sm:px-5",
              active ? "text-white" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <m.span
                layoutId="showcase-toggle"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 450, damping: 36 }}
              />
            )}
            <Icon className="relative size-4" aria-hidden />
            <span className="relative">{label}</span>
            {v === "3d" && !has3D && (
              <span className={cn("relative rounded-full px-1.5 py-px text-[10px] font-semibold", active ? "bg-white/15" : "bg-surface")}>
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
