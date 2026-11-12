import { Check } from "lucide-react";
import type { Car } from "@/types/car";
import { carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export function CarOverview({ car }: { car: Car }) {
  const name = carDisplayName(car);
  const extra = car.images.slice(1);

  return (
    <section aria-labelledby="overview-heading" className="bg-white py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Vehicle overview</Eyebrow>
          <h2 id="overview-heading" className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[2.75rem]">
            About the <span className="text-red-gradient">{name}</span>
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft/85 sm:text-base">
            {car.longDescription.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">Features &amp; amenities</h3>
          </Reveal>
          <RevealGroup as="ul" stagger={0.05} className="mt-5 grid gap-3 sm:grid-cols-2">
            {car.features.map((f) => (
              <RevealItem
                as="li"
                key={f}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-mist p-4 transition-[border-color,background-color] duration-300 hover:border-racing/30 hover:bg-white"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-night text-white transition-colors duration-300 group-hover:bg-racing">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-sm font-semibold text-ink">{f}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {extra.length > 0 && (
          <div className="lg:col-span-12">
            <Reveal>
              <h3 className="text-lg font-bold tracking-[-0.02em] text-ink">More views</h3>
            </Reveal>
            <RevealGroup className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {extra.map((img, i) => (
                <RevealItem
                  key={img.src}
                  className={`group relative overflow-hidden rounded-[var(--radius-card)] bg-night ${i === 0 && extra.length % 2 === 1 ? "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-auto" : "aspect-[4/3]"}`}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                    style={{ objectPosition: img.focus ?? "50% 55%" }}
                  />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-racing to-bright transition-transform duration-500 group-hover:scale-x-100" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </Container>
    </section>
  );
}
