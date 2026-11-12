import { cn } from "@/lib/cn";

/** Minimal sports-car silhouette used by loaders. */
export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 64" fill="none" aria-hidden className={className}>
      <path
        d="M8 46c0-5 3-8 9-9l30-5c10-9 25-17 46-18h34c17 1 32 8 46 17l35 5c10 2 16 5 18 10v6c0 2-1 3-3 3h-14m-152 0H14c-4 0-6-2-6-5v-4Zm40 5h108"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M60 33c12-8 25-13 40-14h26c11 1 22 5 32 12" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="52" cy="52" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="184" cy="52" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Automotive loader: car silhouette over a red line racing along a track. */
export function Viewer3DSkeleton({ progress, fill = false }: { progress?: number; fill?: boolean }) {
  const pct = typeof progress === "number" ? Math.round(progress) : null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-panel)] bg-[radial-gradient(ellipse_70%_55%_at_50%_70%,#1f1e22_0%,#1b1c20_50%,#151619_100%)]",
        fill ? "absolute inset-0" : "aspect-[4/3] border border-white/[0.08] sm:aspect-[16/10]",
      )}
    >
      <CarSilhouette className="w-40 text-white/25 sm:w-52" />
      <div className="relative mt-5 h-[2px] w-48 overflow-hidden rounded-full bg-white/10 sm:w-56">
        {pct === null ? (
          <span className="race-line absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-bright to-soft-red" />
        ) : (
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-racing to-bright  transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
        Preparing 3D view{pct !== null ? ` · ${pct}%` : "…"}
      </p>
    </div>
  );
}
