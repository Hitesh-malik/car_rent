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

/** Trip details collected by the trip planner (home search widget and car detail panel). */
export interface TripDetails {
  pickupLocation: string;
  /** Empty when the car is returned to the pickup location. */
  dropoffLocation?: string;
  pickupDate: string; // yyyy-mm-dd
  pickupTime: string; // HH:mm
  returnDate: string;
  returnTime: string;
  /** Vehicle type preference when no specific car is chosen, e.g. "SUV". */
  vehicleType?: string;
}

function readableDate(date: string, time: string) {
  const d = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim();
  const day = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const t = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${t}`;
}

export function buildTripMessage(trip: TripDetails, car?: Pick<Car, "brand" | "model">) {
  const typePhrase: Record<string, string> = {
    SUV: "an SUV",
    MPV: "an MPV",
    Sedan: "a sedan",
    Hatchback: "a hatchback",
    Luxury: "a luxury car",
  };
  const subject = car
    ? `the ${carDisplayName(car)}`
    : (trip.vehicleType && typePhrase[trip.vehicleType]) || "a car";
  const dropoff = trip.dropoffLocation?.trim() || trip.pickupLocation.trim();
  return [
    `Hi, I'd like to check availability for ${subject} from ${siteConfig.name}.`,
    "",
    `Pickup: ${trip.pickupLocation.trim()} — ${readableDate(trip.pickupDate, trip.pickupTime)}`,
    `Return: ${dropoff} — ${readableDate(trip.returnDate, trip.returnTime)}`,
    "",
    "Could you please confirm availability, pricing and rental details?",
  ].join("\n");
}

export function buildTripWhatsAppUrl(trip: TripDetails, car?: Pick<Car, "brand" | "model">) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(buildTripMessage(trip, car))}`;
}
