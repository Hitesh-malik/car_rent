import { CarFront, Fuel, Luggage, Settings2, Snowflake, Users } from "lucide-react";
import type { Car } from "@/types/car";

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
    <dl className="grid grid-cols-2 border-t border-line">
      {specs.map(({ icon: Icon, label, value }, i) => (
        <div
          key={label}
          className={`flex gap-3 border-b border-line py-4 ${i % 2 === 0 ? "pr-4" : "border-l pl-4"}`}
        >
          <Icon className="mt-0.5 size-[18px] shrink-0 text-ink" strokeWidth={1.6} aria-hidden />
          <div className="min-w-0">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
