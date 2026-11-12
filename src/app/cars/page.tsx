import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAllCars, getCategories } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { FleetExplorer } from "@/components/explore/FleetExplorer";

export const metadata: Metadata = {
  title: "Explore cars",
  description: `Browse the full ${siteConfig.name} fleet — filter SUVs, sedans, hatchbacks, MPVs and luxury cars by transmission, fuel and seating, then enquire on WhatsApp.`,
  alternates: { canonical: "/cars" },
};

export default function ExploreCarsPage() {
  const cars = getAllCars();
  const categories = getCategories(cars);

  return (
    <PageTransition>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${siteConfig.name} fleet`,
          itemListElement: cars.map((car, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${siteConfig.url}/cars/${car.slug}`,
            name: carDisplayName(car),
          })),
        }}
      />

      {/* page header */}
      <section aria-labelledby="explore-heading" className="stage-dark relative isolate overflow-hidden pb-28 pt-8 text-white sm:pb-32 sm:pt-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_80%_0%,black,transparent)]" />
          <div className="absolute -right-20 -top-40 h-[30rem] w-[44rem] rounded-full bg-racing/10 blur-[110px]" />
          <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </div>
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-white/55">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" transitionTypes={["nav-back"]} className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-white/80">
                Explore cars
              </li>
            </ol>
          </nav>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow tone="dark">The full fleet</Eyebrow>
              <h1 id="explore-heading" className="mt-5 text-balance font-[family-name:var(--font-display)] text-[2.75rem] font-bold leading-[1] tracking-[-0.045em] sm:text-7xl">
                Explore <span className="text-red-gradient">the fleet.</span>
              </h1>
            </div>
            <p className="max-w-md text-pretty text-white/60 sm:text-lg">
              {cars.length} hand-picked cars across {categories.length} categories. Filter by what matters to you, then check
              availability in one message.
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="Cars" className="seam-top relative flow-root bg-mist pb-20 sm:pb-28">
        <Container className="relative -mt-16">
          <FleetExplorer cars={cars} categories={categories} />
        </Container>
      </section>
    </PageTransition>
  );
}
