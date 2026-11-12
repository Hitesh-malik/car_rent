import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type Tone = "light" | "dark";

export function Eyebrow({ children, className, tone = "light" }: { children: React.ReactNode; className?: string; tone?: Tone }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em]",
        tone === "dark" ? "text-white/60" : "text-muted",
        className,
      )}
    >
      <span aria-hidden className="relative h-px w-7 bg-gradient-to-r from-racing to-bright">
        <span className="absolute -right-0.5 -top-[2px] size-[5px] rounded-full bg-bright shadow-[0_0_8px_2px_rgb(255_51_79/0.6)]" />
      </span>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  id?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={tone} className={cn("mb-5", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "text-balance text-[2rem] font-bold leading-[1.04] tracking-[-0.04em] sm:text-[2.6rem] lg:text-[3.4rem]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto max-w-xl",
            tone === "dark" ? "text-white/60" : "text-ink-soft/80",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
