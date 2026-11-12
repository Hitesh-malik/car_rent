import Image from "next/image";
import { CalendarClock, Gem, Headset, MessageCircle, ReceiptText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAllCars } from "@/lib/cars";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const POINTS = [
  {
    icon: MessageCircle,
    title: "Effortless booking",
    body: "Pick a car, choose your dates and send one message. No accounts, no lengthy forms.",
  },
  {
    icon: ReceiptText,
    title: "Clear, upfront quotes",
    body: "Rates and rental terms are shared with you on WhatsApp before you commit to anything.",
  },
  {
    icon: CalendarClock,
    title: "Flexible rental options",
    body: "Short city runs or longer trips — tell us your plans and we'll work out an arrangement that fits.",
  },
  {
    icon: Headset,
    title: "Real people, real support",
    body: `Talk directly to the team that looks after the cars. Available ${siteConfig.contact.hours}.`,
  },
];

export function WhyChooseUs() {
  const interior = getAllCars().find((c) => c.slug === "kia-seltos")?.images.find((i) => i.angle === "interior");

  return (
    <section aria-labelledby="why-heading" className="relative bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="why-heading"
          eyebrow="Why choose us"
          align="center"
          title={
            <>
              Rental, <span className="text-red-gradient">without the friction.</span>
            </>
          }
          description="A carefully looked-after fleet and a direct line to the people who look after it."
        />

        <RevealGroup as="ul" stagger={0.08} className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* feature tile — premium collection */}
          <RevealItem
            as="li"
            className="group relative isolate min-h-[22rem] overflow-hidden rounded-[var(--radius-panel)] bg-night p-7 text-white md:col-span-2 lg:row-span-2 lg:min-h-0 sm:p-9"
          >
            {interior && (
              <Image
                src={interior.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="-z-20 object-cover opacity-60 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
            )}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/20" />
            <div aria-hidden className="absolute -bottom-24 -left-24 -z-10 size-80 rounded-full bg-racing/40 blur-[90px]" />
            <div className="flex h-full flex-col justify-end">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-racing text-white shadow-[0_10px_30px_-8px_rgb(230_57_70/0.8)]">
                <Gem className="size-5" aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Premium vehicle collection</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/65">
                Every car is cleaned and checked before it goes out — modern cabins, air conditioning and the features you
                expect, across every category we offer.
              </p>
            </div>
          </RevealItem>

          {POINTS.map(({ icon: Icon, title, body }) => (
            <RevealItem
              as="li"
              key={title}
              className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-mist p-7 transition-[border-color,box-shadow,background-color] duration-300 hover:border-racing/30 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgb(230_57_70/0.5)]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-racing to-bright transition-transform duration-500 group-hover:scale-x-100" />
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors duration-300 group-hover:border-racing group-hover:bg-racing group-hover:text-white">
                <Icon className="size-5" strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-[-0.02em] text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">{body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
