"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EASE_OUT } from "@/lib/motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
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
        <div className="fixed inset-0 z-[60] md:hidden">
          <m.div
            className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
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
            className="absolute inset-x-2 top-2 flex flex-col rounded-[1.5rem] border border-line bg-white p-5 shadow-[var(--shadow-lift)]"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink hover:bg-mist"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <m.ul
              className="mt-6 flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
            >
              {siteConfig.nav.map((item) => (
                <m.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } } }}
                  className="border-b border-line last:border-0"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-14 items-center justify-between text-2xl font-semibold tracking-[-0.03em] text-ink"
                  >
                    {item.label}
                    <ArrowUpRight className="size-5 text-muted" aria-hidden />
                  </Link>
                </m.li>
              ))}
            </m.ul>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white transition-colors hover:bg-whatsapp"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </a>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
