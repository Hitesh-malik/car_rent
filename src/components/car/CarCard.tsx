import Link from "next/link";
import { ViewTransition } from "react";
import { Fuel, Settings2, Users } from "lucide-react";
import type { Car } from "@/types/car";
import { formatPrice } from "@/lib/cars";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { TiltCard } from "@/components/ui/TiltCard";

type Tone = "light" | "dark";

/** Premium vehicle card with 3D tilt. `tone="dark"` renders the charcoal variant for dark sections. */
export function CarCard({
  car,
  priority = false,
  className,
  tone = "light",
}: {
  car: Car;
  priority?: boolean;
  className?: string;
  tone?: Tone;
}) {
  const img = car.images[0];
  const dark = tone === "dark";
  const name = carDisplayName(car);
  const price = formatPrice(car.pricePerDay);
  const [amount, unit] = price.includes(" / ") ? price.split(" / ") : [price, ""];

  return (
    <TiltCard
      as="article"
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border transition-[box-shadow,border-color,transform]",
        dark
          ? "border-white/[0.08] bg-charcoal hover:border-racing/40 hover:shadow-[0_30px_60px_-28px_rgb(0_0_0/0.9),0_0_0_1px_rgb(230_57_70/0.25),0_20px_60px_-30px_rgb(230_57_70/0.6)]"
          : "border-line bg-white hover:border-racing/30 hover:shadow-[0_30px_60px_-30px_rgb(11_11_13/0.35),0_18px_50px_-30px_rgb(230_57_70/0.45)]",
        className,
      )}
    >
      {/* media */}
      <div className="relative overflow-hidden bg-night">
        <ViewTransition name={`car-${car.slug}`} share="morph" default="none">
          <div className="relative aspect-[16/10.5]">
            {img ? (
              <ImageWithFallback
                src={img.src}
                alt={img.alt}
                fill
                preload={priority}
                sizes="(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tilt:scale-[1.06]"
                style={{ objectPosition: img.focus ?? "50% 55%" }}
              />
            ) : null}
          </div>
        </ViewTransition>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-night/0 to-night/10" />
        {/* red light line that draws in on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-racing via-bright to-soft-red transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tilt:scale-x-100"
        />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full border border-white/15 bg-night/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {car.categoryLabel}
          </span>
          {car.featured && (
            <span className="rounded-full bg-racing px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_16px_-6px_rgb(230_57_70/0.9)]">
              Featured
            </span>
          )}
        </div>
        <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
          {car.brand}
        </p>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={cn("font-[family-name:var(--font-display)] text-[1.35rem] font-bold leading-tight tracking-[-0.03em]", dark ? "text-white" : "text-ink")}>
          {/* stretched link: the whole card opens the details page */}
          <Link
            href={`/cars/${car.slug}`}
            transitionTypes={["nav-forward"]}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-bright"
          >
            {car.model}
            <span className="sr-only"> — {car.brand}, {car.categoryLabel}. View details</span>
          </Link>
        </h3>

        <ul className={cn("mt-4 grid grid-cols-3 gap-2 text-[12px]", dark ? "text-white/65" : "text-ink-soft")}>
          {[
            { icon: Settings2, v: car.transmission.replace("Manual / Automatic", "MT / AT"), label: "Transmission" },
            { icon: Fuel, v: car.fuelType.replace("Petrol / Diesel", "Petrol/Diesel"), label: "Fuel" },
            { icon: Users, v: `${car.seats} seats`, label: "Seating" },
          ].map(({ icon: Icon, v, label }) => (
            <li
              key={label}
              className={cn("flex min-w-0 flex-col gap-1.5 rounded-xl border px-2.5 py-2", dark ? "border-white/[0.07] bg-white/[0.03]" : "border-line bg-mist")}
            >
              <Icon className={cn("size-3.5", dark ? "text-soft-red" : "text-racing")} aria-hidden />
              <span className="sr-only">{label}: </span>
              <span className="truncate font-medium">{v}</span>
            </li>
          ))}
        </ul>

        <div className={cn("mt-5 flex items-end justify-between gap-3 border-t pt-4", dark ? "border-white/[0.08]" : "border-line")}>
          <div className="min-w-0">
            <p className={cn("text-[11px] uppercase tracking-[0.16em]", dark ? "text-white/45" : "text-muted")}>Rental rate</p>
            <p className={cn("mt-0.5 truncate font-[family-name:var(--font-display)] text-base font-bold tracking-[-0.02em]", dark ? "text-white" : "text-ink")}>
              {amount}
              {unit && <span className={cn("ml-1 text-xs font-medium", dark ? "text-white/50" : "text-muted")}>/ {unit}</span>}
            </p>
          </div>
          <a
            href={buildWhatsAppUrl(car)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Book the ${name} on WhatsApp (opens in a new tab)`}
            className="relative z-20 inline-flex h-10 shrink-0 items-center rounded-full bg-[linear-gradient(135deg,#ff334f,#e63946_45%,#b81d30)] px-4 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgb(230_57_70/0.8)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-8px_rgb(255_51_79/0.9)]"
          >
            Book Now
          </a>
        </div>
      </div>
    </TiltCard>
  );
}
