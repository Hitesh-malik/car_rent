import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getAllCars, getHeroCar } from "@/lib/cars";
import { PageTransition } from "@/components/layout/PageTransition";
import { ShowroomExperience } from "@/components/showroom/ShowroomExperience";

export const metadata: Metadata = {
  title: "Digital showroom",
  description: `Explore every ${siteConfig.name} rental car from every angle — real photography, interior views, specifications and booking in one place.`,
  alternates: { canonical: "/showroom" },
};

export default function ShowroomPage() {
  return (
    <PageTransition>
      <ShowroomExperience cars={getAllCars()} defaultSlug={getHeroCar().slug} />
    </PageTransition>
  );
}
