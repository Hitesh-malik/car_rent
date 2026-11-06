import type { Car } from "@/types/car";
import { getSimilarCars } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CarCard } from "./CarCard";

export function SimilarCars({ car }: { car: Car }) {
  const similar = getSimilarCars(car, 3);
  if (!similar.length) return null;
  return (
    <section aria-labelledby="similar-heading" className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="similar-heading" eyebrow="Keep exploring" title="You Might Also Like" />
          <ButtonLink href="/#fleet" variant="outline" arrow transitionTypes={["nav-back"]} className="self-start sm:self-auto">
            View all cars
          </ButtonLink>
        </div>
        <RevealGroup as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {similar.map((c) => (
            <RevealItem as="li" key={c.id}>
              <CarCard car={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
