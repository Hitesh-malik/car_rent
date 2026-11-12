import Image from "next/image";
import Link from "next/link";
import { Expand, ScanEye, SlidersHorizontal } from "lucide-react";
import { getAllCars } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const POINTS = [
  { icon: ScanEye, title: "Every angle", body: "Front, side, rear and cabin views of each car." },
  { icon: Expand, title: "Up close", body: "Zoom into details, or go fullscreen." },
  { icon: SlidersHorizontal, title: "Side by side", body: "Switch between cars and compare specs instantly." },
];

/** Home teaser for the /showroom page, built from real fleet photography. */
export function Showroom() {
  const cars = getAllCars();
  const feature = cars.find((c) => c.images.some((i) => i.angle === "side")) ?? cars[0];
  const img = feature.images.find((i) => i.angle === "side") ?? feature.images[0];

  return (
    <section id="showroom" aria-labelledby="showroom-heading" className="relative isolate overflow-hidden bg-[#101014] py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-racing/60 to-transparent" />
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-racing/[0.12] blur-[120px]" />
        <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      </div>

      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="dark"
            id="showroom-heading"
            eyebrow="Digital showroom"
            title={
              <>
                Explore every angle, <span className="text-red-gradient">before you drive.</span>
              </>
            }
            description="Step into our studio and see each car in genuine photography — exterior, interior and every spec, ready to compare."
          />
          <RevealGroup as="ul" stagger={0.08} className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <RevealItem as="li" key={title}>
                <Icon className="size-5 text-soft-red" strokeWidth={1.7} aria-hidden />
                <p className="mt-2.5 font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.15} className="mt-9">
            <ButtonLink href="/showroom" size="lg" arrow>
              Enter the Showroom
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" y={32}>
          <Link
            href={`/showroom?car=${feature.slug}`}
            className="group relative block aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,#1d1d24_0%,#101014_72%)]"
          >
            <div aria-hidden className="absolute left-1/2 top-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(230_57_70/0.26),transparent)] blur-2xl" />
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] [-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent),linear-gradient(to_bottom,transparent,black_10%,black_86%,transparent)] group-hover:scale-[1.03]"
              style={{ objectPosition: img.focus ?? "50% 55%" }}
            />
            <div aria-hidden className="absolute inset-x-[22%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-bright/70 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#101014]/70 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              {carDisplayName(feature)} <span className="text-white/45">· Side</span>
            </span>
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors group-hover:bg-racing group-hover:text-white">
              Open in studio
            </span>
          </Link>

          {/* the collection */}
          <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {cars.map((c, i) => (
              <li key={c.slug} className={i > 3 ? "hidden sm:block" : undefined}>
                <Link
                  href={`/showroom?car=${c.slug}`}
                  aria-label={`View the ${carDisplayName(c)} in the showroom`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#17171C] transition-colors hover:border-racing"
                >
                  <Image
                    src={c.images[0].src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover opacity-70 transition-[opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-100"
                    style={{ objectPosition: c.images[0].focus ?? "50% 55%" }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
