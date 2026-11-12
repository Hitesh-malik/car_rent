import type { Car, CarCategory } from "@/types/car";

export type SortKey = "recommended" | "name" | "seats" | "price-asc" | "price-desc";

export interface FleetFilters {
  query: string;
  category: "All" | CarCategory;
  transmission: "Any" | "Manual" | "Automatic";
  fuels: string[];
  minSeats: number;
  maxPrice: number | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: FleetFilters = {
  query: "",
  category: "All",
  transmission: "Any",
  fuels: [],
  minSeats: 0,
  maxPrice: null,
  sort: "recommended",
};

export const fuelsOf = (car: Car) => car.fuelType.split(" / ");

/** Applies every filter except the one named in `skip` (used to compute per-option counts). */
export function applyFilters(cars: Car[], f: FleetFilters, skip?: keyof FleetFilters): Car[] {
  const q = f.query.trim().toLowerCase();
  const list = cars.filter((c) => {
    if (skip !== "query" && q) {
      const hay = [c.brand, c.model, c.categoryLabel, c.category, c.fuelType, c.transmission, ...c.features].join(" ").toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    if (skip !== "category" && f.category !== "All" && c.category !== f.category) return false;
    if (skip !== "transmission" && f.transmission !== "Any" && !c.transmission.includes(f.transmission)) return false;
    if (skip !== "fuels" && f.fuels.length && !fuelsOf(c).some((fu) => f.fuels.includes(fu))) return false;
    if (skip !== "minSeats" && f.minSeats && c.seats < f.minSeats) return false;
    if (skip !== "maxPrice" && f.maxPrice !== null && (c.pricePerDay === undefined || c.pricePerDay > f.maxPrice)) return false;
    return true;
  });
  return sortCars(list, f.sort, cars);
}

function sortCars(list: Car[], sort: SortKey, original: Car[]) {
  const order = (c: Car) => original.indexOf(c);
  const priced = (c: Car) => c.pricePerDay ?? Number.POSITIVE_INFINITY;
  const copy = [...list];
  switch (sort) {
    case "name":
      return copy.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
    case "seats":
      return copy.sort((a, b) => b.seats - a.seats || order(a) - order(b));
    case "price-asc":
      return copy.sort((a, b) => priced(a) - priced(b));
    case "price-desc":
      return copy.sort((a, b) => (b.pricePerDay ?? -1) - (a.pricePerDay ?? -1));
    default:
      return copy.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || order(a) - order(b));
  }
}

export function activeFilterCount(f: FleetFilters) {
  return (
    (f.query.trim() ? 1 : 0) +
    (f.category !== "All" ? 1 : 0) +
    (f.transmission !== "Any" ? 1 : 0) +
    f.fuels.length +
    (f.minSeats ? 1 : 0) +
    (f.maxPrice !== null ? 1 : 0)
  );
}
