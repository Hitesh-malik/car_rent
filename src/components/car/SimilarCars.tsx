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
    <section aria-labelledby="similar-heading" className="relative isolate overflow-hidden bg-night py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-racing/60 to-transparent" />
        <div className="absolute -left-40 bottom-0 h-[30rem] w-[40rem] rounded-full bg-racing/[0.12] blur-[120px]" />
      </div>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            tone="dark"
            id="similar-heading"
            eyebrow="Keep exploring"
            title={
              <>
                You might <span className="text-red-gradient">also like.</span>
              </>
            }
          />
          <ButtonLink href="/cars" variant="outlineDark" arrow transitionTypes={["nav-back"]} className="self-start sm:self-auto">
            View all cars
          </ButtonLink>
        </div>
        <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {similar.map((c) => (
            <RevealItem as="li" key={c.id}>
              <CarCard car={c} tone="dark" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
