import Link from "next/link";
import { getAllCars, getCategories } from "@/lib/cars";
import { CATEGORY_META } from "@/lib/categories";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CarCard } from "@/components/car/CarCard";

export function FeaturedFleet() {
  const all = getAllCars();
  const cars = [...all].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 6);
  const categories = getCategories(all);

  return (
    <section id="fleet" aria-labelledby="fleet-heading" className="bg-mist pb-20 pt-16 sm:pb-28 sm:pt-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="fleet-heading"
            eyebrow="The fleet"
            title={
              <>
                Find your <span className="text-red-gradient">perfect drive.</span>
              </>
            }
            description="A carefully selected collection — from agile city hatchbacks to executive luxury."
          />
          <ButtonLink href="/cars" variant="dark" arrow className="self-start lg:self-auto">
            View all {all.length} cars
          </ButtonLink>
        </div>

        {/* category quick links */}
        <nav aria-label="Browse by category" className="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            {categories.map((c) => (
              <li key={c} className="shrink-0">
                <Link
                  href={`/cars?category=${encodeURIComponent(c)}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink-soft transition-[border-color,color,box-shadow] duration-200 hover:border-racing/50 hover:text-ink hover:shadow-[0_6px_18px_-10px_rgb(230_57_70/0.6)]"
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-racing" />
                  {CATEGORY_META[c].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <RevealGroup as="ul" stagger={0.07} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {cars.map((car) => (
            <RevealItem as="li" key={car.id}>
              <CarCard car={car} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
