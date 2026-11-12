import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CarSilhouette } from "@/components/car/Viewer3DSkeleton";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-racing/20 blur-[120px]" />
      </div>
      <Container className="flex min-h-[72vh] flex-col items-center justify-center py-24 text-center">
        <p aria-hidden className="font-[family-name:var(--font-display)] text-[8rem] font-extrabold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.18)] sm:text-[12rem]">
          404
        </p>
        <CarSilhouette className="-mt-10 w-48 text-soft-red/70 sm:-mt-14 sm:w-64" />
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
          This road doesn&apos;t lead <span className="text-red-gradient">anywhere.</span>
        </h1>
        <p className="mt-4 max-w-md text-white/60">The page or car you&apos;re looking for isn&apos;t here. Let&apos;s get you back to the fleet.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/cars" size="lg" arrow>
            Explore Our Cars
          </ButtonLink>
          <ButtonLink href="/" size="lg" variant="outlineDark">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
