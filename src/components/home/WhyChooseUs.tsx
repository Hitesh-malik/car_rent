import { Armchair, CalendarClock, MessageCircle, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const POINTS = [
  {
    icon: Wrench,
    title: "Well-Maintained Vehicles",
    body: "Every car is cleaned and checked before it goes out, so you can focus on the road ahead.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Rental Options",
    body: "Short city runs or longer trips — tell us your plans and we'll work out an arrangement that fits.",
  },
  {
    icon: MessageCircle,
    title: "Simple WhatsApp Inquiries",
    body: "No forms or accounts. Send one message about the car you like and talk to a real person.",
  },
  {
    icon: Armchair,
    title: "Comfortable Driving Experience",
    body: "Modern cabins, air conditioning and the features you expect, across every category we offer.",
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="bg-mist py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeading
            id="why-heading"
            eyebrow="Why choose us"
            title="Rental, without the friction."
            description="A small, carefully looked-after fleet and a direct line to the people who look after it."
          />
        </div>
        <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-2 lg:col-span-8">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <RevealItem as="li" key={title} className="group bg-white p-7 sm:p-9">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-line text-ink transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:text-accent">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
