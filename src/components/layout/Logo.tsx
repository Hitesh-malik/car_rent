import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Wordmark: bold ROY, a racing-red speed mark, spaced RENTALS. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      transitionTypes={["nav-back"]}
      aria-label={`${siteConfig.name} — home`}
      className={cn("group inline-flex items-center gap-2 leading-none", className)}
    >
      <span
        aria-hidden
        className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.6rem] bg-[linear-gradient(135deg,#ff334f,#e63946_45%,#8f1424)] shadow-[0_6px_18px_-6px_rgb(230_57_70/0.8)]"
      >
        <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-extrabold italic tracking-[-0.06em] text-white">R</span>
        <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/30 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-[400%]" />
      </span>
      <span className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-[family-name:var(--font-display)] text-[1.3rem] font-extrabold tracking-[-0.04em]",
            tone === "dark" ? "text-ink" : "text-white",
          )}
        >
          {siteConfig.wordmark}
        </span>
        <span className={cn("text-[0.62rem] font-semibold tracking-[0.34em]", tone === "dark" ? "text-muted" : "text-white/55")}>
          {siteConfig.wordmarkSuffix}
        </span>
      </span>
    </Link>
  );
}
