import { siteConfig } from "@/config/site";
import { getAllCars } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { Hero } from "@/components/home/Hero";
import { Fleet } from "@/components/home/Fleet";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FinalCta } from "@/components/home/FinalCta";
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
  ];

  return (
    <PageTransition>
      <JsonLd data={jsonLd} />
      <Hero />
      <Fleet />
      <WhyChooseUs />
      <HowItWorks />
      <FinalCta />
    </PageTransition>
  );
}
