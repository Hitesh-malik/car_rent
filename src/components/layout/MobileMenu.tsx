"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAllCars, getCategories } from "@/lib/cars";
import { CATEGORY_META } from "@/lib/categories";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EASE_OUT } from "@/lib/motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonClasses, ArrowNudge } from "@/components/ui/Button";
import { Logo } from "./Logo";

const categories = getCategories(getAllCars());

export function MobileMenu({
  open,
  onClose,
  pathname,
  bookHref,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  bookHref: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close whenever the route changes, and when this tree is hidden by Activity.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useLayoutEffect(() => () => onClose(), [onClose]);

  // Escape to close, lock body scroll, keep focus inside the panel.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <m.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-night p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          >
            {/* red ambient light */}
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-racing/10 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <Logo tone="light" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <m.ul
              className="relative mt-8 flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}
            >
              {[{ label: "Home", href: "/" }, ...siteConfig.nav].map((item) => (
                <m.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } } }}
                  className="border-b border-white/[0.07]"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex min-h-14 items-center justify-between font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.03em] text-white"
                  >
                    {item.label}
                    <ArrowUpRight className="size-5 text-white/55 transition-colors group-hover:text-bright" aria-hidden />
                  </Link>
                </m.li>
              ))}
            </m.ul>

            <div className="relative mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c}
                    href={`/cars?category=${encodeURIComponent(c)}`}
                    onClick={onClose}
                    className="inline-flex h-10 items-center rounded-full border border-white/10 px-4 text-sm font-medium text-white/80 transition-colors hover:border-racing hover:text-white"
                  >
                    {CATEGORY_META[c].label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative mt-auto grid gap-2.5 pt-8">
              <Link href={bookHref} onClick={onClose} className={buttonClasses({ variant: "primary", size: "lg", className: "w-full" })}>
                Book Now
                <ArrowNudge />
              </Link>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "outlineDark", size: "lg", className: "w-full hover:!bg-whatsapp hover:!border-whatsapp" })}
              >
                <WhatsAppIcon className="size-5" />
                Chat on WhatsApp
              </a>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
