import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatPrice, getAllCars, getCarBySlug } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { CarShowcase } from "@/components/car/CarShowcase";
import { SpecGrid } from "@/components/car/SpecGrid";
import { RentButton } from "@/components/car/RentButton";
import { TripPlanner } from "@/components/booking/TripPlanner";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { StickyRentBar } from "@/components/car/StickyRentBar";
import { CarOverview } from "@/components/car/CarOverview";
import { SimilarCars } from "@/components/car/SimilarCars";
import { CarDetailSkeleton } from "@/components/car/CarDetailSkeleton";

export function generateStaticParams() {
  return getAllCars().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Car not found", robots: { index: false } };

  const name = carDisplayName(car);
  const title = `Rent the ${name} — ${car.categoryLabel}`;
  const description = `${car.shortDescription} ${car.seats} seats · ${car.transmission} · ${car.fuelType}. View photos and specs, then enquire about the ${name} on WhatsApp.`;
  const image = car.images[0];
  return {
    title,
    description,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: {
      type: "website",
      title: `${title} · ${siteConfig.name}`,
      description,
      url: `/cars/${car.slug}`,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image.src] : undefined },
  };
}

async function CarDetail({ params }: { params: PageProps<"/cars/[slug]">["params"] }) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const name = carDisplayName(car);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Car",
      name,
      brand: { "@type": "Brand", name: car.brand },
      model: car.model,
      description: car.shortDescription,
      image: car.images.map((i) => `${siteConfig.url}${i.src}`),
      url: `${siteConfig.url}/cars/${car.slug}`,
      vehicleTransmission: car.transmission,
      fuelType: car.fuelType,
      vehicleSeatingCapacity: car.seats,
      bodyType: car.categoryLabel,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Fleet", item: `${siteConfig.url}/cars` },
        { "@type": "ListItem", position: 3, name, item: `${siteConfig.url}/cars/${car.slug}` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ───────── dark showroom ───────── */}
      <section aria-labelledby="car-heading" className="relative isolate overflow-clip bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />
          <div className="glow-pulse absolute -left-32 top-24 h-[34rem] w-[48rem] rounded-full bg-[radial-gradient(closest-side,rgb(230_57_70/0.28),transparent)] blur-2xl" />
          <div className="absolute -right-40 bottom-0 h-[26rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(143_20_36/0.35),transparent)] blur-2xl" />
          <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </div>

        <Container className="pb-16 pt-4 sm:pt-6 lg:pb-24">
          {/* breadcrumb / back */}
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Link
              href="/cars"
              transitionTypes={["nav-back"]}
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] pl-3 pr-4 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
              Back to fleet
            </Link>
            <nav aria-label="Breadcrumb" className="hidden text-sm text-white/45 sm:block">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link href="/" transitionTypes={["nav-back"]} className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5" />
                </li>
                <li>
                  <Link href="/cars" transitionTypes={["nav-back"]} className="transition-colors hover:text-white">
                    Fleet
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5" />
                </li>
                <li aria-current="page" className="font-medium text-white/80">
                  {name}
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12 xl:gap-14">
            {/* showcase (≈60%) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CarShowcase car={car} />
            </div>

            {/* info + booking (≈40%) */}
            <div className="lg:pt-14">
              <Eyebrow tone="dark">{car.categoryLabel}</Eyebrow>
              <h1 id="car-heading" className="mt-5 font-[family-name:var(--font-display)] leading-[0.95]">
                <span className="block text-lg font-semibold tracking-[-0.01em] text-white/55 sm:text-xl">{car.brand}</span>
                <span className="mt-1 block text-[2.75rem] font-extrabold uppercase tracking-[-0.05em] sm:text-6xl xl:text-[4.25rem]">{car.model}</span>
              </h1>
              <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/60 sm:text-lg">{car.shortDescription}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-baseline gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <span className="text-xs uppercase tracking-[0.14em] text-white/45">Rate</span>
                  <span className="font-[family-name:var(--font-display)] text-base font-bold text-white">{formatPrice(car.pricePerDay)}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  <span className="size-1.5 rounded-full bg-whatsapp shadow-[0_0_8px_rgb(31_168_85)]" aria-hidden />
                  Availability confirmed on WhatsApp
                </span>
              </div>

              <h2 className="sr-only">Specifications</h2>
              <div className="mt-8">
                <SpecGrid car={car} />
              </div>

              {/* booking panel */}
              <div id="plan" className="relative mt-8 overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-charcoal/80 p-5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] backdrop-blur sm:p-6">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing to-transparent" />
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-racing/20 blur-3xl" />
                <div className="relative">
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.02em]">Plan your trip</h2>
                  <p className="mt-1 text-sm text-white/50">Add your dates — we&apos;ll confirm availability and the final price.</p>
                  <TripPlanner variant="panel" car={car} className="mt-5" />

                  <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    <span className="h-px flex-1 bg-white/10" />
                    or
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <div id="rent-cta">
                    <RentButton car={car} variant="ghost" label="Just message us" />
                  </div>
                </div>
              </div>

              <p className="mt-5 flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-[13px] leading-relaxed text-white/55">
                <Info className="mt-0.5 size-4 shrink-0 text-soft-red" aria-hidden />
                <span>
                  Vehicle availability, pricing and final rental terms are confirmed with our team on WhatsApp. Specifications are
                  indicative and may vary by variant.
                </span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CarOverview car={car} />
      <SimilarCars car={car} />
      <StickyRentBar car={car} targetId="rent-cta" />
    </>
  );
}

export default function CarPage({ params }: PageProps<"/cars/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<CarDetailSkeleton />}>
        <CarDetail params={params} />
      </Suspense>
    </PageTransition>
  );
}
