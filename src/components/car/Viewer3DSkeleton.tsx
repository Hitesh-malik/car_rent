import { Box } from "lucide-react";

export function Viewer3DSkeleton({ progress }: { progress?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-panel)] bg-gradient-to-b from-white to-surface sm:aspect-[16/10]"
    >
      <div aria-hidden className="skeleton absolute inset-x-[18%] bottom-[22%] h-6 rounded-[50%] opacity-60 blur-md" />
      <Box className="size-7 animate-pulse text-muted" strokeWidth={1.5} aria-hidden />
      <p className="mt-3 text-sm font-medium text-muted">
        Preparing 3D view{typeof progress === "number" ? ` · ${Math.round(progress)}%` : "…"}
      </p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1 w-40 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
