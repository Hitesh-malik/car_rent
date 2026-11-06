import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      transitionTypes={["nav-back"]}
      aria-label={`${siteConfig.name} — home`}
      className={cn("group inline-flex items-baseline gap-1.5 leading-none", className)}
    >
      <span className={cn("text-[1.35rem] font-extrabold tracking-[-0.04em]", tone === "dark" ? "text-ink" : "text-white")}>
        {siteConfig.wordmark}
      </span>
      <span aria-hidden className="mb-0.5 size-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
      <span
        className={cn(
          "text-[0.7rem] font-semibold tracking-[0.32em]",
          tone === "dark" ? "text-muted" : "text-white/60",
        )}
      >
        {siteConfig.wordmarkSuffix}
      </span>
    </Link>
  );
}
