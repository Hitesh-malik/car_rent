import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * primary   – racing-red gradient with a soft red glow (main CTA, any background)
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

/* A light sheen sweeps across red buttons on hover (pure CSS, transform-only). */
const sheen =
  "before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:-z-10 before:w-1/2 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-[var(--ease-out-expo)] hover:before:translate-x-[300%]";

const variants: Record<Variant, string> = {
  primary: cn(
    "bg-[linear-gradient(135deg,#ff334f_0%,#e63946_42%,#b81d30_100%)] text-white shadow-[var(--shadow-btn)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgb(255_51_79/0.75),inset_0_1px_0_rgb(255_255_255/0.2)]",
    sheen,
  ),
  dark: "bg-night text-white hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-[0_14px_30px_-16px_rgb(11_11_13/0.6)]",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/40 hover:bg-mist",
  outlineDark: "border border-white/15 bg-white/[0.03] text-white backdrop-blur-sm hover:border-white/35 hover:bg-white/[0.08]",
  ghost: "text-ink hover:bg-surface",
  light: cn("bg-white text-ink hover:-translate-y-0.5 hover:bg-white hover:text-racing hover:shadow-[0_14px_34px_-14px_rgb(0_0_0/0.5)]", sheen),
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
