import { cars, HERO_CAR_SLUG } from "@/data/cars";
import type { Car, CarCategory } from "@/types/car";

const CATEGORY_ORDER: CarCategory[] = ["SUV", "Sedan", "Hatchback", "MPV", "Luxury"];

export function getAllCars(): Car[] {
  return cars;
}

/** The car featured in the home hero (falls back to the first featured car). */
export function getHeroCar(): Car {
  return cars.find((c) => c.slug === HERO_CAR_SLUG) ?? cars.find((c) => c.featured) ?? cars[0];
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

/** Categories that actually exist in the data, in a stable display order. */
export function getCategories(list: Car[] = cars): CarCategory[] {
  const present = new Set(list.map((c) => c.category));
  return CATEGORY_ORDER.filter((c) => present.has(c));
}

/** Same category first, then featured, then the rest. */
export function getSimilarCars(car: Car, limit = 3): Car[] {
  const others = cars.filter((c) => c.id !== car.id);
  const score = (c: Car) => (c.category === car.category ? 2 : 0) + (c.featured ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(price?: number) {
  return typeof price === "number" ? `${inr.format(price)} / day` : "Price on inquiry";
}

export function primaryImage(car: Car) {
  return car.images[0];
}
