"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { Menu } from "lucide-react";
import { siteConfig, type NavItem } from "@/config/site";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { buttonClasses, ArrowNudge } from "@/components/ui/Button";

const SECTION_IDS = ["fleet", "how-it-works", "contact"] as const;

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
  if (pathname.startsWith("/cars/")) return hash === "fleet";
  if (pathname !== (path || "/")) return false;
  return hash ? section === hash : section === null;
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  const section = useActiveSection(pathname === "/");

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-line/80 bg-white/90 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-white/0",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-[4.5rem] w-full max-w-[1320px] items-center justify-between px-4 sm:px-8 lg:px-10">
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => {
              const active = isActive(item, pathname, section);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {active && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-surface"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Link href="/#fleet" className={buttonClasses({ variant: "dark" })}>
                Explore Fleet
                <ArrowNudge />
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-mist md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </nav>
      </div>
      <MobileMenu open={open} onClose={closeMenu} pathname={pathname} />
    </header>
  );
}
