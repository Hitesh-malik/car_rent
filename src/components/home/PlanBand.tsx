import { getCategories } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { TripPlanner } from "@/components/booking/TripPlanner";

/** Trip planner floating over the seam between the dark hero and the light fleet section. */
export function PlanBand() {
  return (
    <section id="plan" aria-label="Plan your trip" className="relative bg-[linear-gradient(to_bottom,var(--color-night)_0,var(--color-night)_50%,var(--color-mist)_50%)]">
      <Container className="relative -mt-28 lg:-mt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-[10%] -top-6 h-24 rounded-full bg-racing/30 blur-3xl" />
        <TripPlanner variant="search" vehicleTypes={getCategories()} />
      </Container>
    </section>
  );
}
