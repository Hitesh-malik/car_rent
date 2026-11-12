"use client";

import { m } from "motion/react";
import { Check, Search, X } from "lucide-react";
import type { Car, CarCategory } from "@/types/car";
import { CATEGORY_META } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { applyFilters, fuelsOf, type FleetFilters } from "./filters";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-5">
      <legend className="float-left mb-3 w-full text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

/** Segmented control with a shared sliding pill. */
function Segmented<T extends string | number>({
  id,
  options,
  value,
  onChange,
  label,
}: {
  id: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-line bg-mist p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn("relative h-9 rounded-lg text-[13px] font-semibold transition-colors duration-200", active ? "text-white" : "text-ink-soft hover:text-ink")}
          >
            {active && <m.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-lg bg-night" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel({
  cars,
  categories,
  filters,
  set,
  idPrefix,
}: {
  cars: Car[];
  categories: CarCategory[];
  filters: FleetFilters;
  set: (patch: Partial<FleetFilters>) => void;
  idPrefix: string;
}) {
  const allFuels = ["Petrol", "Diesel", "Hybrid", "Electric"].filter((f) => cars.some((c) => fuelsOf(c).includes(f)));
  const prices = cars.map((c) => c.pricePerDay).filter((p): p is number => typeof p === "number");
  const priceMax = prices.length ? Math.max(...prices) : 0;
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const count = (patch: Partial<FleetFilters>) => applyFilters(cars, { ...filters, ...patch }).length;
  const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      {/* search */}
      <div>
        <label htmlFor={`${idPrefix}-search`} className="sr-only">
          Search cars
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id={`${idPrefix}-search`}
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Search brand, model, feature…"
            className="h-12 w-full rounded-xl border border-field bg-white pl-10 pr-10 text-[15px] font-medium text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/80 hover:border-ink/60 focus:border-racing focus:shadow-[0_0_0_4px_rgb(189_57_74/0.05)] [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => set({ query: "" })}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <Group title="Category">
        <div className="space-y-1">
          {(["All", ...categories] as const).map((c) => {
            const active = filters.category === c;
            const n = count({ category: c });
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => set({ category: c })}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-200",
                  active ? "bg-night text-white" : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className={cn("size-1.5 rounded-full transition-colors", active ? "bg-bright " : "bg-line group-hover:bg-racing")} />
                  {c === "All" ? "All cars" : CATEGORY_META[c].label}
                </span>
                <span className={cn("text-xs tabular-nums", active ? "text-white/60" : "text-muted")}>{n}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Transmission">
        <Segmented
          id={`${idPrefix}-trans`}
          label="Transmission"
          value={filters.transmission}
          onChange={(v) => set({ transmission: v })}
          options={[
            { value: "Any", label: "Any" },
            { value: "Manual", label: "Manual" },
            { value: "Automatic", label: "Automatic" },
          ]}
        />
      </Group>

      <Group title="Fuel type">
        <div className="flex flex-wrap gap-2">
          {allFuels.map((f) => {
            const on = filters.fuels.includes(f);
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => set({ fuels: on ? filters.fuels.filter((x) => x !== f) : [...filters.fuels, f] })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-200",
                  on ? "border-racing bg-racing text-white" : "border-line bg-white text-ink-soft hover:border-ink/25 hover:text-ink",
                )}
              >
                {on && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                {f}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Seating capacity">
        <Segmented
          id={`${idPrefix}-seats`}
          label="Minimum seats"
          value={filters.minSeats}
          onChange={(v) => set({ minSeats: v })}
          options={[
            { value: 0, label: "Any" },
            { value: 5, label: "5+" },
            { value: 7, label: "7+" },
          ]}
        />
      </Group>

      {prices.length > 0 && priceMax > priceMin && (
        <Group title="Max price / day">
          <input
            type="range"
            aria-label="Maximum price per day"
            min={priceMin}
            max={priceMax}
            step={100}
            value={filters.maxPrice ?? priceMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              set({ maxPrice: v >= priceMax ? null : v });
            }}
            className="w-full accent-racing"
          />
          <p className="mt-2 text-sm font-semibold text-ink">{filters.maxPrice === null ? "Any price" : `Up to ${inr(filters.maxPrice)}`}</p>
        </Group>
      )}
    </div>
  );
}
