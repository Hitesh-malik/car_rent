import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAllCars } from "@/lib/cars";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  const cars = getAllCars();
  return (
    <footer id="contact" aria-labelledby="footer-heading" className="border-t border-line bg-mist">
      <h2 id="footer-heading" className="sr-only">
        Contact and site information
      </h2>
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            A curated collection of well-kept cars for city drives, family trips and special occasions. Browse the fleet and
            message us on WhatsApp — we&apos;ll take it from there.
          </p>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp"
          >
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {siteConfig.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-muted transition-colors hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Fleet</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {cars.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cars/${c.slug}`} className="text-muted transition-colors hover:text-ink">
                    {carDisplayName(c)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
                <a href={siteConfig.contact.phoneHref} className="transition-colors hover:text-ink">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
                <a href={`mailto:${siteConfig.contact.email}`} className="break-all transition-colors hover:text-ink">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Vehicle photos via Wikimedia Commons —{" "}
            <Link href="/credits" className="underline underline-offset-2 hover:text-ink">
              image credits
            </Link>
            .
          </p>
        </Container>
      </div>
    </footer>
  );
}
