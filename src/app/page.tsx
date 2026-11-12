import { siteConfig } from "@/config/site";
import { getAllCars } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Hero } from "@/components/home/Hero";
import { FeaturedFleet } from "@/components/home/FeaturedFleet";
import { Showroom } from "@/components/home/Showroom";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PromoBanner } from "@/components/home/PromoBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection, FAQ_ITEMS } from "@/components/home/FaqSection";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  const cars = getAllCars();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      telephone: siteConfig.contact.phoneDisplay,
      email: siteConfig.contact.email,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${siteConfig.name} fleet`,
      itemListElement: cars.map((car, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}/cars/${car.slug}`,
        name: carDisplayName(car),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <PageTransition>
      <JsonLd data={jsonLd} />
      <Hero />
      <FeaturedFleet />
      <Showroom />
      <WhyChooseUs />
      <PromoBanner />
      <HowItWorks />
      <FaqSection />
    </PageTransition>
  );
}
