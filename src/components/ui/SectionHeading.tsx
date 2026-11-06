import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted", className)}>
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className={cn("mb-4", align === "center" && "justify-center")}>{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-4xl lg:text-[3.25rem]">
        {title}
      </h2>
      {description && <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </Reveal>
  );
}
