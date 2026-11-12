import type { CarCategory } from "@/types/car";

/** Display copy for each vehicle category (navigation, footer, explore filters). */
export const CATEGORY_META: Record<CarCategory, { label: string; blurb: string }> = {
  SUV: { label: "SUVs", blurb: "Command the road, city or highway" },
  Sedan: { label: "Sedans", blurb: "Refined, roomy and quiet" },
  Hatchback: { label: "Hatchbacks", blurb: "Agile and easy in the city" },
  MPV: { label: "MPVs", blurb: "Space for the whole family" },
  Luxury: { label: "Luxury", blurb: "Executive comfort, premium badge" },
};
