import { siteConfig } from "@/config/site";
import { getAllCars, getCategories, getHeroCar } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const car = getHeroCar();
  const fleetCount = getAllCars().length;
  const categoryCount = getCategories().length;

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* soft backdrop wash */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[78%] bg-gradient-to-b from-mist to-white" />

      <Container className="grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10 lg:col-span-5">
          <p
            className="hero-fade inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            Premium car rentals
          </p>

          <h1
            id="hero-heading"
            className="mt-6 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] text-ink min-[400px]:text-5xl sm:text-6xl xl:text-[5.25rem]"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line" style={{ "--d": "80ms" } as React.CSSProperties}>
                Your Journey.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line text-muted/80" style={{ "--d": "180ms" } as React.CSSProperties}>
                Your <span className="text-accent">Drive.</span>
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-6 max-w-md text-pretty text-base leading-relaxed text-muted sm:text-lg"
            style={{ "--d": "320ms" } as React.CSSProperties}
          >
            Discover exceptional cars for every journey. Explore our collection and find the perfect drive.
          </p>

          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <div className="hero-fade" style={{ "--d": "420ms" } as React.CSSProperties}>
              <ButtonLink href="/#fleet" size="lg" arrow className="w-full min-[420px]:w-auto">
                Explore Our Cars
              </ButtonLink>
            </div>
            <div className="hero-fade" style={{ "--d": "500ms" } as React.CSSProperties}>
              <ButtonLink href="/#how-it-works" size="lg" variant="outline" className="w-full min-[420px]:w-auto">
                How It Works
              </ButtonLink>
            </div>
          </div>

          <dl
            className="hero-fade mt-12 hidden max-w-md grid-cols-3 divide-x divide-line border-t border-line pt-6 sm:grid"
            style={{ "--d": "620ms" } as React.CSSProperties}
          >
            {[
              { k: "Cars in fleet", v: String(fleetCount) },
              { k: "Categories", v: String(categoryCount) },
              { k: "Enquiries", v: "WhatsApp" },
            ].map((s) => (
              <div key={s.k} className="px-4 first:pl-0">
                <dt className="text-xs text-muted">{s.k}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-7">
          <HeroVisual car={car} wordmark={siteConfig.wordmark} />
        </div>
      </Container>
    </section>
  );
}
