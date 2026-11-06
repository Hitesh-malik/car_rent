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
    <section aria-labelledby="overview-heading" className="border-t border-line bg-mist py-20 sm:py-24">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Vehicle overview</Eyebrow>
          <h2 id="overview-heading" className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-4xl">
            About the {name}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted sm:text-base">
            {car.longDescription.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">Feature highlights</h3>
          </Reveal>
          <RevealGroup as="ul" stagger={0.05} className="mt-5 grid gap-3 sm:grid-cols-2">
            {car.features.map((f) => (
              <RevealItem as="li" key={f} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-sm font-medium text-ink">{f}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {extra.length > 0 && (
          <div className="lg:col-span-12">
            <Reveal>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">More views</h3>
            </Reveal>
            <RevealGroup className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {extra.map((img, i) => (
                <RevealItem
                  key={img.src}
                  className={`relative overflow-hidden rounded-[var(--radius-card)] bg-surface ${i === 0 && extra.length % 2 === 1 ? "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-auto" : "aspect-[4/3]"}`}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: img.focus ?? "50% 55%" }}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </Container>
    </section>
  );
}
