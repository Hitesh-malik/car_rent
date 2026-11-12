import type { TripDetails } from "@/lib/whatsapp";

export type TripErrors = Partial<Record<keyof TripDetails, string>>;

/** Local yyyy-mm-dd for a Date (input[type=date] format). */
export function toDateInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toDateTime(date: string, time: string) {
  if (!date) return null;
  const d = new Date(`${date}T${time || "10:00"}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Whole rental days (any started 24h block counts as a day). */
export function rentalDays(trip: Pick<TripDetails, "pickupDate" | "pickupTime" | "returnDate" | "returnTime">) {
  const a = toDateTime(trip.pickupDate, trip.pickupTime);
  const b = toDateTime(trip.returnDate, trip.returnTime);
  if (!a || !b || b <= a) return null;
  return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86_400_000));
}

export function validateTrip(trip: TripDetails, now = new Date()): TripErrors {
  const errors: TripErrors = {};
  if (trip.pickupLocation.trim().length < 2) errors.pickupLocation = "Enter a pickup location";
  if (!trip.pickupDate) errors.pickupDate = "Choose a pickup date";
  if (!trip.pickupTime) errors.pickupTime = "Choose a time";
  if (!trip.returnDate) errors.returnDate = "Choose a return date";
  if (!trip.returnTime) errors.returnTime = "Choose a time";

  const pickup = toDateTime(trip.pickupDate, trip.pickupTime);
  const ret = toDateTime(trip.returnDate, trip.returnTime);
  if (pickup && !errors.pickupDate && pickup.getTime() < now.getTime() - 15 * 60_000) {
    errors.pickupDate = "Pickup can't be in the past";
  }
  if (pickup && ret && !errors.returnDate && ret <= pickup) {
    errors.returnDate = "Return must be after pickup";
  }
  return errors;
}
