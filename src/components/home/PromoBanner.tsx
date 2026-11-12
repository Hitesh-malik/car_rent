import Image from "next/image";
import { getAllCars } from "@/lib/cars";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function PromoBanner() {
  const thar = getAllCars().find((c) => c.slug === "mahindra-thar");
  const img = thar?.images.find((i) => i.src.endsWith("front-2.jpg")) ?? thar?.images[0];

  return (
    <section aria-labelledby="promo-heading" className="bg-mist py-20 sm:py-28">
      <Container>
        <ImageReveal className="relative isolate overflow-hidden rounded-[2rem] bg-night">
          {img && (
            <ParallaxImage className="absolute inset-y-0 right-0 -z-20 w-full md:w-[72%] md:[mask-image:linear-gradient(to_right,transparent,black_35%)]">
              <Image src={img.src} alt="" fill sizes="(min-width: 768px) 68vw, 100vw" className="object-cover" style={{ objectPosition: "60% 60%" }} />
            </ParallaxImage>
          )}
          {/* black → red grade */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,#19191c_0%,#19191c_32%,rgb(25_25_28/0.7)_55%,rgb(25_25_28/0.25)_80%,rgb(189_57_74/0.08)_100%)]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night/80 via-transparent to-transparent md:hidden" />
          <div aria-hidden className="absolute -left-20 -top-20 -z-10 size-72 rounded-full bg-racing/12 blur-[90px]" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-racing via-bright to-transparent" />

          <div className="max-w-xl px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-soft-red">Weekend escapes</p>
            <h2 id="promo-heading" className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl">
              Long weekend? <span className="block text-white/55">Make it a road trip.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-white/65 sm:text-lg">
              SUVs and MPVs with room for the whole crew and their luggage. Share your dates and we&apos;ll line up the right
              car.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/cars?category=SUV" size="lg" arrow>
                Browse SUVs
              </ButtonLink>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-whatsapp hover:bg-whatsapp"
              >
                <WhatsAppIcon className="size-[18px]" />
                Plan it on WhatsApp
              </a>
            </div>
          </div>
        </ImageReveal>
      </Container>
    </section>
  );
}
