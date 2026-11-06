import { siteConfig } from "@/config/site";
import type { Car } from "@/types/car";

export function carDisplayName(car: Pick<Car, "brand" | "model">) {
  return `${car.brand} ${car.model}`;
}

export function buildWhatsAppMessage(car?: Pick<Car, "brand" | "model">) {
  if (!car) {
    return `Hi, I'm interested in renting a car from ${siteConfig.name}. Could you please share the available cars, pricing, and rental details?`;
  }
  return `Hi, I'm interested in renting the ${carDisplayName(car)}. Could you please share its availability, pricing, and rental details?`;
}

/** Returns a wa.me deep link with a URL-encoded, car-specific message. */
export function buildWhatsAppUrl(car?: Pick<Car, "brand" | "model">) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(car))}`;
}
