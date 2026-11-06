import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Fuel, Settings2, Users } from "lucide-react";
import type { Car } from "@/types/car";
import { formatPrice } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export function CarCard({ car, priority = false, className }: { car: Car; priority?: boolean; className?: string }) {
  const img = car.images[0];
  return (
    <Link
      href={`/cars/${car.slug}`}
      transitionTypes={["nav-forward"]}
      aria-label={`${carDisplayName(car)} — ${car.categoryLabel}. View details`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-1",
        className,
      )}
    >
      <div className="relative m-2 overflow-hidden rounded-[calc(var(--radius-card)-0.4rem)] bg-surface">
        <ViewTransition name={`car-${car.slug}`} share="morph" default="none">
          <div className="relative aspect-[16/10]">
            {img ? (
              <ImageWithFallback
                src={img.src}
                alt={img.alt}
                fill
                preload={priority}
                sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.045]"
                style={{ objectPosition: img.focus ?? "50% 55%" }}
              />
            ) : null}
          </div>
        </ViewTransition>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">
            {car.categoryLabel}
          </span>
          {car.featured && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Featured</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{car.brand}</p>
            <h3 className="mt-1 truncate text-xl font-semibold tracking-[-0.03em] text-ink">{car.model}</h3>
          </div>
          <span
            aria-hidden
            className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <ArrowRight className="size-4 -rotate-45 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:rotate-0" />
          </span>
        </div>

        <ul className="mb-5 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
          <li className="inline-flex items-center gap-1.5">
            <Settings2 className="size-3.5" aria-hidden />
            {car.transmission}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Fuel className="size-3.5" aria-hidden />
            {car.fuelType}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {car.seats} seats
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-semibold text-ink">{formatPrice(car.pricePerDay)}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-accent">
            View Details
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
