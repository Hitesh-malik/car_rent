import { getAllCars, getCategories } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FleetGrid } from "./FleetSection";

export function Fleet() {
  const cars = getAllCars();
  return (
    <section id="fleet" aria-labelledby="fleet-heading" className="py-20 sm:py-28">
      <Container>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="fleet-heading"
            eyebrow="The fleet"
            title="Find Your Perfect Drive"
            description="Explore our carefully selected rental collection."
          />
        </div>
        <FleetGrid cars={cars} categories={getCategories(cars)} />
      </Container>
    </section>
  );
}
