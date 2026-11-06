import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCars } from "@/lib/cars";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    ...getAllCars().map((car) => ({
      url: `${siteConfig.url}/cars/${car.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: car.images.map((i) => `${siteConfig.url}${i.src}`),
    })),
    { url: `${siteConfig.url}/credits`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
