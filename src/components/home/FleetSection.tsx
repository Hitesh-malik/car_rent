"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { SearchX } from "lucide-react";
import type { Car, CarCategory } from "@/types/car";
import { EASE_OUT } from "@/lib/motion";
import { CarCard } from "@/components/car/CarCard";
import { FleetFilter } from "./FleetFilter";

export type FleetFilterValue = "All" | CarCategory;

export function FleetGrid({ cars, categories }: { cars: Car[]; categories: CarCategory[] }) {
  const [filter, setFilter] = useState<FleetFilterValue>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: cars.length };
    for (const c of cars) map[c.category] = (map[c.category] ?? 0) + 1;
    return map;
  }, [cars]);

  const visible = filter === "All" ? cars : cars.filter((c) => c.category === filter);

  return (
    <>
      <FleetFilter options={["All", ...categories]} value={filter} onChange={setFilter} counts={counts} />

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "car" : "cars"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <m.ul layout className="mt-10 grid min-h-[28rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((car, i) => (
            <m.li
              key={car.id}
              layout
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: (i % 3) * 0.06 }}
            >
              <CarCard car={car} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      {visible.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line bg-mist px-6 py-16 text-center">
          <SearchX className="size-6 text-muted" aria-hidden />
          <p className="mt-3 font-semibold text-ink">No cars in this category yet</p>
          <p className="mt-1 text-sm text-muted">Try another category, or message us on WhatsApp for a recommendation.</p>
          <button
            type="button"
            onClick={() => setFilter("All")}
            className="mt-5 h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-surface"
          >
            Show all cars
          </button>
        </div>
      )}
    </>
  );
}
