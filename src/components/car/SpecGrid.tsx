import { CarFront, Fuel, Luggage, Settings2, Snowflake, Users } from "lucide-react";
import type { Car } from "@/types/car";

/** Specification tiles for the dark showroom panel. */
export function SpecGrid({ car }: { car: Car }) {
  const specs = [
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel type", value: car.fuelType },
    { icon: Users, label: "Seating", value: `${car.seats} seats` },
    { icon: Snowflake, label: "Air conditioning", value: car.airConditioning },
    { icon: Luggage, label: "Luggage", value: car.luggage },
    { icon: CarFront, label: "Vehicle type", value: car.categoryLabel },
  ];
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {specs.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-colors duration-300 hover:border-racing/40 hover:bg-white/[0.05]"
        >
          <Icon className="size-[18px] text-soft-red" strokeWidth={1.7} aria-hidden />
          <dt className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</dt>
          <dd className="mt-0.5 text-sm font-semibold leading-snug text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
