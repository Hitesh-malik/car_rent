import { Gauge, Move3d, ScanEye } from "lucide-react";
import { getAllCars } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ShowroomStage } from "./ShowroomStage";

const POINTS = [
  { icon: Move3d, title: "Walk around it", body: "Drag to orbit a full 360°, pinch or scroll to get closer." },
  { icon: ScanEye, title: "Study the details", body: "Studio lighting picks out every line and surface." },
  { icon: Gauge, title: "Then take the real one", body: "See photos and specs of the actual car you'll drive." },
];

export function Showroom() {
  const car = getAllCars().find((c) => c.model3d);
  if (!car?.model3d) return null;

  return (
    <section id="showroom" aria-labelledby="showroom-heading" className="relative isolate overflow-hidden bg-night py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-racing/60 to-transparent" />
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-racing/[0.14] blur-[120px]" />
        <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      </div>

      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="dark"
            id="showroom-heading"
            eyebrow="3D showroom"
            title={
              <>
                Explore every angle, <span className="text-red-gradient">before you drive.</span>
              </>
            }
            description="Step into our interactive studio. Rotate, zoom and inspect a car in real-time 3D — right in your browser."
          />
          <RevealGroup as="ul" stagger={0.1} className="mt-10 space-y-3">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <RevealItem
                as="li"
                key={title}
                className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-racing/35 hover:bg-white/[0.04]"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-racing/15 text-soft-red ring-1 ring-inset ring-racing/25">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-white">{title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-white/55">{body}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.2} className="mt-8">
            <ButtonLink href={`/cars/${car.slug}`} variant="outlineDark" arrow transitionTypes={["nav-forward"]}>
              View the {carDisplayName(car)}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" y={32}>
          <ShowroomStage model={car.model3d} name={carDisplayName(car)} />
        </Reveal>
      </Container>
    </section>
  );
}
