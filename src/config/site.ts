/**
 * Central site configuration.
 * Change the brand, WhatsApp number and contact details here — every component reads from this file.
 */
export const siteConfig = {
  name: "Roy Rentals",
  wordmark: "ROY",
  wordmarkSuffix: "RENTALS",
  tagline: "Premium car rentals",
  description:
    "Explore a curated collection of premium rental cars — SUVs, sedans, hatchbacks and luxury models. View photos, specifications and enquire instantly on WhatsApp.",
  /** Public URL used for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",

  /** WhatsApp number in international format, digits only (no +, spaces or dashes). */
  whatsappNumber: "919999999999",

  contact: {
    phoneDisplay: "+91 99999 99999",
    phoneHref: "tel:+919999999999",
    email: "hello@example.com",
    address: "Your business address, City, State",
    hours: "Mon – Sun, 9:00 am – 9:00 pm",
  },

  nav: [
    { label: "Explore Cars", href: "/cars" },
    { label: "Showroom", href: "/showroom" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],

  /**
   * Social profiles shown in the footer. Add entries like
   * { label: "Instagram", href: "https://instagram.com/yourbrand" } — nothing renders while the list is empty.
   */
  social: [] as ReadonlyArray<{ label: string; href: string }>,
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
