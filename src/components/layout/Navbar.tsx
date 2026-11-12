"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Menu } from "lucide-react";
import { siteConfig, type NavItem } from "@/config/site";
import { getAllCars, getCategories } from "@/lib/cars";
import { CATEGORY_META } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { buttonClasses, ArrowNudge } from "@/components/ui/Button";

const SECTION_IDS = ["showroom", "how-it-works", "faq", "contact"] as const;

/** Tracks which home-page section is in view so the matching nav link can be highlighted. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best && best[1] > 0 ? best[0] : null);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5] },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

function isActive(item: NavItem, pathname: string, section: string | null) {
  const [path, hash] = item.href.split("#");
  if (item.href === "/cars") return pathname === "/cars" || pathname.startsWith("/cars/");
  if (pathname !== (path || "/")) return false;
  return hash ? section === hash : false;
}

const cars = getAllCars();
const categories = getCategories(cars);

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const enter = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div ref={ref} className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && enter()} onPointerLeave={(e) => e.pointerType === "mouse" && leave()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="nav-categories"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-white/65 transition-colors duration-200 hover:text-white"
      >
        Categories
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            id="nav-categories"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-2/95 p-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl">
              <ul>
                {categories.map((c) => {
                  const meta = CATEGORY_META[c];
                  const count = cars.filter((car) => car.category === c).length;
                  return (
                    <li key={c}>
                      <Link
                        href={`/cars?category=${encodeURIComponent(c)}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between gap-4 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">{meta.label}</span>
                          <span className="block truncate text-xs text-white/45">{meta.blurb}</span>
                        </span>
                        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] tabular-nums text-white/60 transition-colors group-hover:border-racing/60 group-hover:text-white">
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/cars"
                onClick={() => setOpen(false)}
                className="group/btn mt-1 flex items-center justify-between rounded-xl bg-white/[0.04] px-3.5 py-3 text-sm font-semibold text-white transition-colors hover:bg-racing"
              >
                View all {cars.length} cars
                <ArrowNudge />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  const section = useActiveSection(pathname === "/");
  // On a car page, jump to its booking panel; elsewhere, pick a car first.
  const bookHref = pathname.startsWith("/cars/") ? "#plan" : "/cars";

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-white/[0.07] bg-night/[0.93] backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-night",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-[4.5rem] w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
          <Logo tone="light" />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {siteConfig.nav.map((item, i) => {
              const active = isActive(item, pathname, section);
              return (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                      active ? "text-white" : "text-white/65 hover:text-white",
                    )}
                  >
                    {active && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    {item.label}
                  </Link>
                  {i === 0 && <CategoriesMenu />}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Link href={bookHref} className={buttonClasses({ variant: "primary", size: "md" })}>
                Book Now
                <ArrowNudge />
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </nav>
      </div>
      <MobileMenu open={open} onClose={closeMenu} pathname={pathname} bookHref={bookHref} />
    </header>
  );
}
