import { siteConfig } from "@/config/site";
import { getAllCars, getCategories, getHeroCar } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { HeroStage } from "./HeroStage";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const car = getHeroCar();
  const fleetCount = getAllCars().length;
  const categoryCount = getCategories().length;

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-night text-white">
      {/* ── lighting ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]" />
        <div className="glow-pulse absolute right-[-10%] top-[18%] h-[38rem] w-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(230_57_70/0.38),transparent)] blur-2xl" />
        <div className="absolute -left-40 bottom-0 h-[26rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(143_20_36/0.35),transparent)] blur-2xl" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
      </div>

      <Container className="relative grid min-h-[min(54rem,calc(100svh-4.5rem))] items-center gap-6 pb-36 pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-4 lg:pb-44 lg:pt-6">
        {/* ── copy ── */}
        <div className="relative z-20 lg:col-span-6 xl:col-span-5">
          <p className="hero-fade inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur" style={d(0)}>
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-bright/70 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-bright" />
            </span>
            Premium car rentals
          </p>

          <h1 id="hero-heading" className="mt-7 font-[family-name:var(--font-display)] text-[3.1rem] font-extrabold uppercase leading-[0.9] tracking-[-0.055em] min-[400px]:text-[3.6rem] sm:text-[5rem] xl:text-[6.25rem]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="hero-line" style={d(80)}>
                Drive
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="hero-line text-white/90" style={d(170)}>
                Beyond
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line text-red-gradient" style={d(260)}>
                Ordinary.
              </span>
            </span>
          </h1>

          <span aria-hidden className="hero-rule mt-6 block h-px w-40 bg-gradient-to-r from-racing via-bright/60 to-transparent" style={d(420)} />

          <p className="hero-fade mt-6 max-w-md text-pretty text-base leading-relaxed text-white/65 sm:text-lg" style={d(380)}>
            Discover exceptional vehicles for every journey. Experience premium car rentals with effortless booking and
            unmatched convenience.
          </p>

          <div className="mt-9 flex flex-col gap-3 min-[440px]:flex-row">
            <div className="hero-fade" style={d(480)}>
              <ButtonLink href="/cars" size="lg" arrow className="w-full min-[440px]:w-auto">
                Explore Cars
              </ButtonLink>
            </div>
            <div className="hero-fade" style={d(560)}>
              <ButtonLink href="/#showroom" size="lg" variant="outlineDark" className="w-full min-[440px]:w-auto">
                Enter 3D Showroom
              </ButtonLink>
            </div>
          </div>

          <dl className="hero-fade mt-12 hidden max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid" style={d(680)}>
            {[
              { k: "Cars in the fleet", v: String(fleetCount).padStart(2, "0") },
              { k: "Categories", v: String(categoryCount).padStart(2, "0") },
              { k: "Enquiry reply", v: "WhatsApp" },
            ].map((s) => (
              <div key={s.k} className="bg-night/90 px-4 py-3.5 backdrop-blur">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">{s.k}</dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.03em] text-white">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── 3D stage ── */}
        <div className="relative z-10 -mx-4 sm:mx-0 lg:col-span-6 lg:-mr-16 xl:col-span-7 xl:-mr-24">
          <HeroStage car={car} wordmark={siteConfig.wordmark} />
        </div>
      </Container>

      {/* bottom fade into the trip planner band */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
