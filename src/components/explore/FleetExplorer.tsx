"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpDown, SearchX, SlidersHorizontal, X } from "lucide-react";
import type { Car, CarCategory } from "@/types/car";
import { CATEGORY_META } from "@/lib/categories";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { CarCard } from "@/components/car/CarCard";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FilterPanel } from "./FilterPanel";
import { activeFilterCount, applyFilters, DEFAULT_FILTERS, type FleetFilters, type SortKey } from "./filters";

/** Reads ?category= (needs Suspense under Cache Components) and pushes it into the explorer state. */
function CategoryParamSync({ categories, onCategory }: { categories: CarCategory[]; onCategory: (c: "All" | CarCategory) => void }) {
  const param = useSearchParams().get("category");
  useEffect(() => {
    const match = categories.find((c) => c.toLowerCase() === param?.toLowerCase());
    onCategory(match ?? "All");
  }, [param, categories, onCategory]);
  return null;
}

export function FleetExplorer({ cars, categories }: { cars: Car[]; categories: CarCategory[] }) {
  const [filters, setFilters] = useState<FleetFilters>(DEFAULT_FILTERS);
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hasPrices = cars.some((c) => typeof c.pricePerDay === "number");

  const set = useCallback((patch: Partial<FleetFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    if (patch.category !== undefined) {
      // Keep the URL shareable; Next syncs native history updates with useSearchParams.
      const url = new URL(window.location.href);
      if (patch.category === "All") url.searchParams.delete("category");
      else url.searchParams.set("category", patch.category);
      window.history.replaceState(window.history.state, "", url);
    }
  }, []);
  const onCategory = useCallback((c: "All" | CarCategory) => setFilters((f) => (f.category === c ? f : { ...f, category: c })), []);
  const clearAll = () => set({ ...DEFAULT_FILTERS, sort: filters.sort });

  const visible = useMemo(() => applyFilters(cars, filters), [cars, filters]);
  const active = activeFilterCount(filters);

  // Drawer: lock scroll, Escape closes; close when this page is hidden by Activity.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>("button, input")?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);
  useLayoutEffect(() => () => setDrawer(false), []);

  const chips: { label: string; clear: () => void }[] = [
    ...(filters.query.trim() ? [{ label: `“${filters.query.trim()}”`, clear: () => set({ query: "" }) }] : []),
    ...(filters.category !== "All" ? [{ label: CATEGORY_META[filters.category].label, clear: () => set({ category: "All" }) }] : []),
    ...(filters.transmission !== "Any" ? [{ label: filters.transmission, clear: () => set({ transmission: "Any" }) }] : []),
    ...filters.fuels.map((f) => ({ label: f, clear: () => set({ fuels: filters.fuels.filter((x) => x !== f) }) })),
    ...(filters.minSeats ? [{ label: `${filters.minSeats}+ seats`, clear: () => set({ minSeats: 0 }) }] : []),
    ...(filters.maxPrice !== null ? [{ label: "Price limit", clear: () => set({ maxPrice: null }) }] : []),
  ];

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "recommended", label: "Recommended" },
    { value: "name", label: "Name (A–Z)" },
    { value: "seats", label: "Most seats" },
    ...(hasPrices
      ? ([
          { value: "price-asc", label: "Price: low to high" },
          { value: "price-desc", label: "Price: high to low" },
        ] as const)
      : []),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[19rem_minmax(0,1fr)]">
      <Suspense fallback={null}>
        <CategoryParamSync categories={categories} onCategory={onCategory} />
      </Suspense>

      {/* desktop sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24 rounded-[var(--radius-panel)] border border-line bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 font-[family-name:var(--font-display)] font-bold text-ink">
              <SlidersHorizontal className="size-4 text-racing" aria-hidden />
              Filters
            </p>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-racing-deep hover:text-ink">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel cars={cars} categories={categories} filters={filters} set={set} idPrefix="side" />
        </div>
      </aside>

      <div className="min-w-0">
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-2 pl-4 shadow-[var(--shadow-soft)] sm:pl-5">
          <p className="text-sm text-ink-soft" aria-live="polite">
            Showing <span className="font-bold text-ink">{visible.length}</span> of {cars.length} cars
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-expanded={drawer}
              aria-controls="filter-drawer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink/25 lg:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
              {active > 0 && <span className="inline-flex size-5 items-center justify-center rounded-full bg-racing text-[11px] text-white">{active}</span>}
            </button>
            <label className="relative inline-flex items-center">
              <span className="sr-only">Sort by</span>
              <ArrowUpDown className="pointer-events-none absolute left-3.5 size-4 text-muted" aria-hidden />
              <select
                value={filters.sort}
                onChange={(e) => set({ sort: e.target.value as SortKey })}
                className="h-11 appearance-none rounded-full border border-field bg-white pl-10 pr-9 text-sm font-semibold text-ink outline-none transition-colors hover:border-ink/25 focus:border-racing"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-4 size-1.5 rotate-45 border-b-2 border-r-2 border-ink/60" />
            </label>
          </div>
        </div>

        {/* active filter chips */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <m.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex flex-wrap items-center gap-2 overflow-hidden pt-4"
              aria-label="Active filters"
            >
              {chips.map((c) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={c.clear}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-night pl-3 pr-2 text-xs font-semibold text-white transition-colors hover:bg-racing"
                  >
                    {c.label}
                    <X className="size-3.5" aria-label={`Remove ${c.label} filter`} />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearAll} className="h-8 px-2 text-xs font-semibold text-racing-deep hover:text-ink">
                  Clear filters
                </button>
              </li>
            </m.ul>
          )}
        </AnimatePresence>

        {/* results */}
        <m.ul layout className="mt-6 grid min-h-[24rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 2xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((car, i) => (
              <m.li
                key={car.id}
                layout
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: Math.min(i, 5) * 0.04 }}
              >
                <CarCard car={car} priority={i < 2} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>

        {visible.length === 0 && (
          <div className="-mt-[24rem] flex min-h-[24rem] flex-col items-center justify-center rounded-[var(--radius-panel)] border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-night text-white">
              <SearchX className="size-6" aria-hidden />
            </span>
            <p className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.02em] text-ink">No cars match these filters</p>
            <p className="mt-2 max-w-sm text-sm text-ink-soft/80">Try removing a filter — or tell us what you need and we&apos;ll recommend the right car.</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={clearAll} className="inline-flex h-11 items-center justify-center rounded-full bg-night px-5 text-sm font-semibold text-white transition-colors hover:bg-racing">
                Clear all filters
              </button>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-whatsapp hover:bg-whatsapp hover:text-white"
              >
                <WhatsAppIcon className="size-4" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <m.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <m.div
              ref={drawerRef}
              id="filter-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                  <SlidersHorizontal className="size-4 text-racing" aria-hidden />
                  Filters
                </p>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close filters"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink hover:bg-mist"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterPanel cars={cars} categories={categories} filters={filters} set={set} idPrefix="drawer" />
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={clearAll} className={cn("h-12 rounded-full border border-line px-5 text-sm font-semibold text-ink", active === 0 && "opacity-50")} disabled={active === 0}>
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="h-12 rounded-full bg-racing hover:bg-racing-deep text-sm font-semibold text-white shadow-[var(--shadow-btn)]"
                >
                  Show {visible.length} {visible.length === 1 ? "car" : "cars"}
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
