import { cn } from "@/lib/cn";

type Tone = "light" | "dark";

/** Labelled form field wrapper with an optional icon and inline error. */
export function Field({
  id,
  label,
  icon,
  error,
  tone = "light",
  className,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  error?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className={cn(
          "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
          tone === "dark" ? "text-white/55" : "text-muted",
        )}
      >
        {icon}
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={cn("mt-1.5 text-xs font-medium", tone === "dark" ? "text-soft-red" : "text-accent-strong")}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared classes for inputs/selects so every form control matches. */
export function inputClasses({ tone = "light", invalid = false }: { tone?: Tone; invalid?: boolean } = {}) {
  return cn(
    "h-12 w-full min-w-0 rounded-xl border px-3.5 text-[15px] font-medium outline-none transition-[border-color,box-shadow,background-color] duration-200",
    tone === "dark"
      ? "border-white/10 bg-white/[0.04] text-white [color-scheme:dark] placeholder:text-white/55 hover:border-white/20 focus:border-bright focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgb(216_58_78/0.06)]"
      : "border-line bg-mist text-ink [color-scheme:light] placeholder:text-muted/70 hover:border-ink/20 focus:border-racing focus:bg-white focus:shadow-[0_0_0_4px_rgb(216_58_78/0.05)]",
    invalid && (tone === "dark" ? "border-soft-red/70" : "border-racing/70"),
  );
}
