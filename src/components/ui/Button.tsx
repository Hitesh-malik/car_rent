import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * primary   – muted racing red (main CTA, any background)
 * dark      – black (on light backgrounds)
 * outline   – hairline on light backgrounds
 * outlineDark – hairline on dark backgrounds
 * ghost     – text-only on light
 * light     – white (on dark/red backgrounds)
 * whatsapp  – black that turns WhatsApp green on hover
 */
type Variant = "primary" | "dark" | "outline" | "outlineDark" | "ghost" | "light" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-racing text-white shadow-[var(--shadow-btn)] hover:bg-racing-deep",
  dark: "bg-night text-white hover:bg-charcoal-2",
  outline: "border border-line bg-white text-ink hover:border-ink/30 hover:bg-mist",
  outlineDark: "border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/[0.06]",
  ghost: "text-ink hover:bg-surface",
  light: "bg-white text-ink hover:bg-mist",
  whatsapp: "bg-night text-white hover:bg-whatsapp",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ArrowNudge({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden
      className={cn("size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1", className)}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  external?: boolean;
  /** View-transition types for in-app navigation, e.g. ["nav-forward"]. */
  transitionTypes?: string[];
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

export function ButtonLink({ href, variant, size, className, arrow, external, transitionTypes, children, ...rest }: ButtonLinkProps) {
  const cls = buttonClasses({ variant, size, className });
  const content = (
    <>
      {children}
      {arrow && <ArrowNudge />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} transitionTypes={transitionTypes} className={cls} {...rest}>
      {content}
    </Link>
  );
}
