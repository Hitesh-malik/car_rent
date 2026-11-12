"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Fuel, Luggage, Settings2, Snowflake, Users, CarFront } from "lucide-react";
import type { Car } from "@/types/car";
import { formatPrice } from "@/lib/cars";
import { studioViews, viewHighlight } from "@/lib/views";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { buttonClasses, ArrowNudge } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { StickyRentBar } from "@/components/car/StickyRentBar";
import { StudioViewer } from "./StudioViewer";

/** Reads ?car= (needs Suspense under Cache Components) and pushes it into the showroom state. */
function CarParamSync({ cars, onCar }: { cars: Car[]; onCar: (slug: string) => void }) {
  const slug = useSearchParams().get("car");
  useEffect(() => {
    if (slug && cars.some((c) => c.slug === slug)) onCar(slug);
  }, [slug, cars, onCar]);
  return null;
}

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.4, ease: EASE_OUT } };

export function ShowroomExperience({ cars, defaultSlug }: { cars: Car[]; defaultSlug: string }) {
  const [{ slug, viewIdx }, setState] = useState({ slug: defaultSlug, viewIdx: 0 });
  const setViewIdx = useCallback((i: number) => setState((st) => ({ ...st, viewIdx: i })), []);
  const car = cars.find((c) => c.slug === slug) ?? cars[0];
  const views = useMemo(() => studioViews(car), [car]);
  const carIdx = cars.indexOf(car);
  const name = carDisplayName(car);

  const selectFromUrl = useCallback((s: string) => setState((st) => (st.slug === s ? st : { slug: s, viewIdx: 0 })), []);

  function selectCar(next: Car, scroll = false) {
    if (next.slug === slug) return;
    setState({ slug: next.slug, viewIdx: 0 });
    const url = new URL(window.location.href);
    url.searchParams.set("car", next.slug);
    window.history.replaceState(window.history.state, "", url);
    if (scroll) {
      const top = document.getElementById("studio")?.getBoundingClientRect().top ?? 0;
      if (top < 0) document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  const stepCar = (d: 1 | -1) => selectCar(cars[(carIdx + d + cars.length) % cars.length]);

  function showView(i: number) {
    setViewIdx(i);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const specs = [
    { icon: CarFront, label: "Category", value: car.categoryLabel },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel type", value: car.fuelType },
    { icon: Users, label: "Seating", value: `${car.seats} seats` },
    { icon: Luggage, label: "Luggage", value: car.luggage },
    { icon: Snowflake, label: "Air conditioning", value: car.airConditioning },
  ];
  const bookHref = `/cars/${car.slug}#plan`;
  const detailHref = `/cars/${car.slug}`;

  return (
    <>
      <Suspense fallback={null}>
        <CarParamSync cars={cars} onCar={selectFromUrl} />
      </Suspense>

      {/* ═════════ STUDIO (dark) ═════════ */}
      <section aria-labelledby="showroom-heading" className="stage-dark relative isolate overflow-clip text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[30%] h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(216_58_78/0.06),transparent)] blur-2xl" />
          <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        </div>

        <Container className="pb-12 pt-8 sm:pt-12">
          {/* intro */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow tone="dark">Roy Rentals / Digital showroom</Eyebrow>
              <h1 id="showroom-heading" className="mt-5 font-[family-name:var(--font-display)] text-[2.6rem] font-bold leading-[1] tracking-[-0.045em] sm:text-6xl">
                Meet your <span className="text-red-gradient">next drive.</span>
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-white/60 sm:text-lg">
                Explore our collection of premium rental vehicles. Discover every detail, compare features and find the perfect car
                for your next journey.
              </p>
            </div>
            {/* compact vehicle indicator */}
            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 pl-4 lg:self-auto">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                  Now viewing · {String(carIdx + 1).padStart(2, "0")} / {String(cars.length).padStart(2, "0")}
                </p>
                <p className="truncate font-[family-name:var(--font-display)] text-sm font-bold">{name}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => stepCar(-1)} aria-label="Previous vehicle" className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-racing hover:bg-racing">
                  <ChevronLeft className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => stepCar(1)} aria-label="Next vehicle" className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-racing hover:bg-racing">
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>

          {/* viewer + info */}
          <div id="studio" className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={car.slug} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
                <StudioViewer car={car} views={views} index={viewIdx} onIndex={setViewIdx} />
              </m.div>
            </AnimatePresence>

            {/* information panel */}
            <aside aria-label={`${name} details`} className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-charcoal p-6">
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing to-transparent" />
              <AnimatePresence mode="wait" initial={false}>
                <m.div key={car.slug} {...fade}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-soft-red">{car.categoryLabel}</p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] leading-none">
                    <span className="block text-base font-semibold text-white/55">{car.brand}</span>
                    <span className="mt-1 block text-4xl font-bold tracking-[-0.04em]">{car.model}</span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{car.shortDescription}</p>

                  <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Daily rate</p>
                    <p className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold">{formatPrice(car.pricePerDay)}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/55">
                      <span className="size-1.5 rounded-full bg-whatsapp" aria-hidden />
                      Availability confirmed on WhatsApp
                    </p>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                    {specs.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex min-w-0 gap-2.5">
                        <Icon className="mt-0.5 size-4 shrink-0 text-soft-red" strokeWidth={1.8} aria-hidden />
                        <div className="min-w-0">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{label}</dt>
                          <dd className="mt-0.5 text-[13px] font-semibold leading-snug text-white">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  <div id="showroom-cta" className="mt-6 grid gap-2.5">
                    <Link href={bookHref} transitionTypes={["nav-forward"]} className={buttonClasses({ variant: "primary", size: "lg", className: "w-full" })}>
                      Book This Car
                      <ArrowNudge />
                    </Link>
                    <Link href={detailHref} transitionTypes={["nav-forward"]} className={buttonClasses({ variant: "outlineDark", size: "lg", className: "w-full" })}>
                      View Vehicle Details
                    </Link>
                  </div>
                </m.div>
              </AnimatePresence>
            </aside>
          </div>

          {/* collection selector */}
          <div className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.02em]">The collection</h2>
              <p className="text-sm text-white/55">{cars.length} vehicles</p>
            </div>
            <ul className="no-scrollbar -mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 xl:grid xl:grid-cols-7 xl:overflow-visible">
              {cars.map((c) => {
                const active = c.slug === car.slug;
                const img = c.images[0];
                return (
                  <li key={c.slug} className="w-[12.5rem] shrink-0 snap-start xl:w-auto">
                    <button
                      type="button"
                      onClick={() => selectCar(c, true)}
                      aria-pressed={active}
                      aria-label={`Show the ${carDisplayName(c)} in the showroom`}
                      className={cn(
                        "group relative block w-full overflow-hidden rounded-2xl border text-left transition-[border-color,background-color,transform] duration-300",
                        active ? "border-racing bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/20",
                      )}
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden bg-charcoal">
                        {img && (
                          <ImageWithFallback
                            src={img.src}
                            alt=""
                            fill
                            sizes="200px"
                            className={cn("object-cover transition-[transform,opacity] duration-500", active ? "opacity-100" : "opacity-70 group-hover:scale-105 group-hover:opacity-100")}
                            style={{ objectPosition: img.focus ?? "50% 55%" }}
                          />
                        )}
                        {active && (
                          <span className="absolute left-2 top-2 rounded-full bg-racing px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Viewing</span>
                        )}
                      </span>
                      <span className="block p-3">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{c.brand}</span>
                        <span className="mt-0.5 block truncate text-sm font-bold text-white">{c.model}</span>
                        <span className="mt-1 block truncate text-[11px] text-white/50">{c.categoryLabel}</span>
                        <span className="mt-1.5 block truncate text-[11px] font-semibold text-white/75">{formatPrice(c.pricePerDay)}</span>
                      </span>
                      {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-racing to-racing-deep" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* ═════════ HIGHLIGHTS — real photography of the selected car ═════════ */}
      <section aria-labelledby="highlights-heading" className="seam-top bg-mist py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Vehicle highlights</Eyebrow>
              <h2 id="highlights-heading" className="mt-4 text-balance text-3xl font-bold tracking-[-0.04em] text-ink sm:text-[2.6rem]">
                The {name}, <span className="text-muted">in detail.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-soft/80">Genuine photographs of this vehicle type. Select any image to open it in the studio.</p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.ul key={car.slug} {...fade} className="mt-10 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4">
              {views.map((v, i) => {
                const h = viewHighlight(v, car);
                const big = i === 0;
                const n = views.length;
                // Fill the bento without holes for 2–5+ photos.
                const span = big
                  ? "sm:col-span-2 sm:row-span-2"
                  : cn(
                      n === 2 && "lg:col-span-2 lg:row-span-2",
                      n === 3 && "lg:col-span-2",
                      n === 4 && i === 1 && "lg:col-span-2",
                      (n - 1) % 2 === 1 && i === n - 1 && "sm:col-span-2 lg:col-span-1",
                      n === 4 && i === n - 1 && "lg:col-span-1",
                    );
                return (
                  <li key={v.image.src} className={span}>
                    <button
                      type="button"
                      onClick={() => showView(i)}
                      className="group relative block h-full w-full overflow-hidden rounded-[var(--radius-panel)] bg-night text-left"
                    >
                      <ImageWithFallback
                        src={v.image.src}
                        alt={v.image.alt}
                        fill
                        sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                        style={{ objectPosition: v.image.focus ?? "50% 55%" }}
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-soft-red">{v.label}</span>
                        <span className={cn("mt-1 block font-[family-name:var(--font-display)] font-bold tracking-[-0.02em] text-white", big ? "text-2xl" : "text-lg")}>{h.title}</span>
                        <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-white/70">{h.body}</span>
                      </span>
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-racing to-racing-deep transition-transform duration-500 group-hover:scale-x-100" />
                    </button>
                  </li>
                );
              })}
            </m.ul>
          </AnimatePresence>
        </Container>
      </section>

      {/* ═════════ SPECIFICATIONS ═════════ */}
      <section aria-labelledby="specs-heading" className="bg-white py-20 sm:py-24">
        <Container>
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={car.slug} {...fade} className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Eyebrow>Technical specifications</Eyebrow>
                <h2 id="specs-heading" className="mt-4 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-[2.6rem]">
                  {name}
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft/85">
                  {car.longDescription.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                <p className="mt-5 text-xs text-muted">Specifications are indicative and may vary by variant.</p>
              </div>
              <div className="grid gap-6 lg:col-span-7">
                <dl className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-white">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-6 border-b border-line px-5 py-4 last:border-0 sm:px-6">
                      <dt className="flex items-center gap-3 text-sm text-ink-soft">
                        <Icon className="size-4 text-racing" strokeWidth={1.8} aria-hidden />
                        {label}
                      </dt>
                      <dd className="text-right text-sm font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
                    <dt className="text-sm text-ink-soft">Daily rate</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{formatPrice(car.pricePerDay)}</dd>
                  </div>
                </dl>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Features</h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {car.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-night text-white">
                          <Check className="size-3" strokeWidth={3} aria-hidden />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </m.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* ═════════ BOOKING CTA ═════════ */}
      <section aria-labelledby="book-heading" className="bg-mist py-20 sm:py-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-night px-6 py-14 text-white sm:px-12 sm:py-20">
            {car.images[0] && (
              <ImageWithFallback
                src={car.images[0].src}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="-z-20 object-cover opacity-50 [mask-image:linear-gradient(to_right,transparent_25%,black_75%)]"
                style={{ objectPosition: car.images[0].focus ?? "50% 55%" }}
              />
            )}
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,#151619_0%,#151619_35%,rgb(21_22_25/0.6)_60%,rgb(21_22_25/0.2)_85%,rgb(216_58_78/0.08)_100%)]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-racing via-racing-deep to-transparent" />
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-soft-red">{name}</p>
              <h2 id="book-heading" className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Ready to make it yours?
              </h2>
              <p className="mt-4 text-white/65 sm:text-lg">Your next journey starts with the right car.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={bookHref} transitionTypes={["nav-forward"]} className={buttonClasses({ variant: "primary", size: "lg" })}>
                  Book This Vehicle
                  <ArrowNudge />
                </Link>
                <a
                  href={buildWhatsAppUrl(car)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-whatsapp hover:bg-whatsapp"
                >
                  <WhatsAppIcon className="size-[18px]" />
                  Ask on WhatsApp
                </a>
              </div>
              <Link href="/cars" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition-colors hover:text-white">
                Compare the full fleet <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <StickyRentBar car={car} targetId="showroom-cta" />
    </>
  );
}
