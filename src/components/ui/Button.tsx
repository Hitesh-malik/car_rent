import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light" | "whatsapp";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-[0_8px_20px_-10px_rgb(37_99_235/0.7)] hover:bg-accent-strong",
  dark: "bg-ink text-white hover:bg-ink-soft",
  outline: "border border-line bg-canvas text-ink hover:border-ink/25 hover:bg-mist",
  ghost: "text-ink hover:bg-surface",
  light: "bg-white text-ink hover:bg-accent hover:text-white",
  whatsapp: "bg-ink text-white hover:bg-whatsapp",
};

const sizes: Record<Size, string> = {
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
      className={cn("size-4 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1", className)}
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
