import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAllCars, getCategories } from "@/lib/cars";
import { CATEGORY_META } from "@/lib/categories";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";

const linkCls = "text-white/55 transition-colors duration-200 hover:text-white";

export function Footer() {
  const cars = getAllCars();
  const categories = getCategories(cars);
  return (
    <footer id="contact" aria-labelledby="footer-heading" className="relative isolate overflow-hidden bg-night text-white">
      <h2 id="footer-heading" className="sr-only">
        Contact and site information
      </h2>

      {/* lighting + grain */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing/70 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[70rem] -translate-x-1/2 rounded-full bg-racing/[0.12] blur-[100px]" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />

      {/* contact strip */}
      <Container className="pt-16 sm:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/[0.08] pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-soft-red">Get in touch</p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Your next drive is <span className="text-red-gradient">one message</span> away.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-white px-7 text-[15px] font-semibold text-ink transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon className="size-[18px]" />
              Chat on WhatsApp
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-white/15 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/[0.06]"
            >
              <Phone className="size-4" aria-hidden />
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </Container>

      <Container className="grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            A curated collection of well-kept cars for city drives, family trips and special occasions. Browse the fleet and
            message us on WhatsApp — we&apos;ll take it from there.
          </p>
          {siteConfig.social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {siteConfig.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-4 text-sm text-white/70 transition-colors hover:border-racing hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/" className={linkCls}>
                  Home
                </Link>
              </li>
              {siteConfig.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkCls}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Categories</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/cars?category=${encodeURIComponent(c)}`} className={linkCls}>
                    {CATEGORY_META[c].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Fleet</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {cars.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cars/${c.slug}`} className={linkCls}>
                    {carDisplayName(c)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/55">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                <a href={`mailto:${siteConfig.contact.email}`} className="break-all transition-colors hover:text-white">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </nav>
      </Container>

      {/* oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.2em] whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[12.5vw] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.09)] 2xl:text-[11.5rem]">
          {siteConfig.wordmark} {siteConfig.wordmarkSuffix}
        </p>
      </div>

      <div className="relative border-t border-white/[0.08] bg-night">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Vehicle photos via Wikimedia Commons —{" "}
            <Link href="/credits" className="underline underline-offset-2 hover:text-white">
              image credits
            </Link>
            .
          </p>
        </Container>
      </div>
    </footer>
  );
}
