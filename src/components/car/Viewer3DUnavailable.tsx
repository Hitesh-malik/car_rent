import { Images } from "lucide-react";
import { CarSilhouette } from "./Viewer3DSkeleton";

export function Viewer3DUnavailable({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-[radial-gradient(ellipse_70%_55%_at_50%_70%,#24141a_0%,#141419_50%,#0b0b0d_100%)] px-6 text-center sm:aspect-[16/10]">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <CarSilhouette className="relative w-40 text-white/25" />
      <h3 className="relative mt-5 text-lg font-bold tracking-[-0.02em] text-white sm:text-xl">3D preview not yet available</h3>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-white/55">
        We&apos;re preparing an interactive 3D model of the {name}. In the meantime, explore it in the photo gallery.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-racing hover:text-white"
      >
        <Images className="size-4" aria-hidden />
        View photos
      </button>
    </div>
  );
}
