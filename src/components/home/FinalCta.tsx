import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="pb-20 sm:pb-28">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* subtle oversized type + light ring */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[9rem] font-extrabold leading-none tracking-[-0.06em] text-white/[0.035] sm:text-[15rem]"
          >
            {siteConfig.wordmark} {siteConfig.wordmarkSuffix}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Ready when you are</p>
          <h2 id="cta-heading" className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
            Your Next Drive Starts Here.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-white/60">
            Pick a car you love and send us a message — we&apos;ll confirm availability and the details.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/#fleet" size="lg" variant="light" arrow>
              Explore Our Fleet
            </ButtonLink>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              <WhatsAppIcon className="size-[18px]" />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
