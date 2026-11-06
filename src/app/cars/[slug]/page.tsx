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
        { "@type": "ListItem", position: 2, name: "Fleet", item: `${siteConfig.url}/#fleet` },
        { "@type": "ListItem", position: 3, name, item: `${siteConfig.url}/cars/${car.slug}` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <Container className="pb-16 pt-4 sm:pt-6 lg:pb-24">
        {/* breadcrumb / back */}
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <Link
            href="/#fleet"
            transitionTypes={["nav-back"]}
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white pl-3 pr-4 text-sm font-semibold text-ink transition-colors hover:bg-mist"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
            Back to fleet
          </Link>
          <nav aria-label="Breadcrumb" className="hidden text-sm text-muted sm:block">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" transitionTypes={["nav-back"]} className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href="/#fleet" transitionTypes={["nav-back"]} className="hover:text-ink">
                  Fleet
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                {name}
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {/* showcase (≈60%) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CarShowcase car={car} />
          </div>

          {/* info (≈40%) */}
          <div className="lg:pt-14">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {car.categoryLabel}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl xl:text-[3.5rem]">
              <span className="block text-lg font-medium tracking-[-0.01em] text-muted sm:text-xl">{car.brand}</span>
              {car.model}
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted sm:text-lg">{car.shortDescription}</p>

            <div className="mt-8 flex items-baseline justify-between gap-4 rounded-2xl border border-line bg-mist px-5 py-4">
              <span className="text-sm text-muted">Rental price</span>
              <span className="text-lg font-semibold tracking-[-0.02em] text-ink">{formatPrice(car.pricePerDay)}</span>
            </div>

            <h2 className="sr-only">Specifications</h2>
            <div className="mt-8">
              <SpecGrid car={car} />
            </div>

            <div id="rent-cta" className="mt-8">
              <RentButton car={car} />
              <p className="mt-3 text-center text-sm text-muted">Enquire about this car on WhatsApp</p>
            </div>

            <p className="mt-6 flex gap-3 rounded-2xl bg-accent-soft/60 p-4 text-[13px] leading-relaxed text-ink-soft">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span>
                Vehicle availability, pricing and final rental terms are confirmed with our team on WhatsApp. Specifications are
                indicative and may vary by variant.
              </span>
            </p>
          </div>
        </div>
      </Container>

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
