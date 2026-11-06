"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import type { Car } from "@/types/car";
import { formatPrice } from "@/lib/cars";
import { carDisplayName } from "@/lib/whatsapp";
import { EASE_OUT } from "@/lib/motion";
import { RentButton } from "./RentButton";

/**
 * Mobile/tablet only. Appears once the main Rent Now button has scrolled above the viewport,
 * and hides again when the footer is reached so it never covers footer content.
 */
export function StickyRentBar({ car, targetId }: { car: Car; targetId: string }) {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  // Position-based (not IntersectionObserver): a fast fling or anchor jump can skip straight past the CTA
  // without its intersection state ever changing, which would leave the bar hidden.
  const update = useCallback(() => {
    const cta = document.getElementById(targetId);
    const footer = document.getElementById("contact");
    if (!cta) return;
    const passed = cta.getBoundingClientRect().bottom < 0;
    const footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    setShow(passed && !footerInView);
  }, [targetId]);

  useMotionValueEvent(scrollY, "change", update);
  // Hide when the page is hidden by Activity (client navigation away).
  useLayoutEffect(() => () => setShow(false), []);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{carDisplayName(car)}</p>
              <p className="truncate text-xs text-muted">{formatPrice(car.pricePerDay)}</p>
            </div>
            <RentButton car={car} compact className="shrink-0" />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
