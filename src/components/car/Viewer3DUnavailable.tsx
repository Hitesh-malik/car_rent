import { Box, Images } from "lucide-react";

export function Viewer3DUnavailable({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-panel)] border border-line bg-gradient-to-b from-mist to-surface px-6 text-center sm:aspect-[16/10]">
      {/* faint isometric grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(#e7e9ed_1px,transparent_1px),linear-gradient(90deg,#e7e9ed_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <span className="relative inline-flex size-14 items-center justify-center rounded-2xl border border-line bg-white text-ink shadow-[var(--shadow-soft)]">
        <Box className="size-6" strokeWidth={1.6} aria-hidden />
      </span>
      <h3 className="relative mt-5 text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">3D preview not yet available</h3>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-muted">
        We&apos;re preparing an interactive 3D model of the {name}. In the meantime, explore it in the photo gallery.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
      >
        <Images className="size-4" aria-hidden />
        View photos
      </button>
    </div>
  );
}
