"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Car } from "@/types/car";
import { carDisplayName } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function HeroVisual({ car, wordmark }: { car: Car; wordmark: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const image = car.images[0];

  // Pointer parallax (desktop, fine pointers only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.6 });
  const carX = useTransform(sx, (v) => v * 14);
  const carY = useTransform(sy, (v) => v * 8);
  const typeX = useTransform(sx, (v) => v * -22);
  const chipX = useTransform(sx, (v) => v * 26);
  const chipY = useTransform(sy, (v) => v * 18);

  // Restrained scroll drift
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="relative">
      {/* Oversized wordmark behind the frame */}
      <m.span
        aria-hidden
        style={{ x: typeX }}
        className="pointer-events-none absolute -top-[7.5rem] right-2 z-0 hidden select-none text-[10rem] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_#dfe3e9] lg:block xl:-top-[9rem] xl:text-[12rem]"
      >
        {wordmark}
      </m.span>

      <div className="relative z-10 overflow-hidden rounded-[var(--radius-panel)] bg-surface sm:rounded-[2rem]">
        <m.div style={{ y: scrollY }} className="relative aspect-[4/3.1] sm:aspect-[16/11]">
          <div className="hero-car absolute inset-0">
          <m.div style={{ x: carX, y: carY }} className="absolute -inset-4">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              fetchPriority="high"
              quality={85}
              sizes="(min-width: 1320px) 760px, (min-width: 1024px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: image.focus ?? "50% 55%" }}
            />
          </m.div>
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        </m.div>

        {/* Caption bar */}
        <Link
          href={`/cars/${car.slug}`}
          transitionTypes={["nav-forward"]}
          className="group absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 pl-4 backdrop-blur-md transition-colors hover:bg-white sm:inset-x-5 sm:bottom-5 sm:p-4 sm:pl-5"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{car.categoryLabel}</span>
            <span className="block truncate text-base font-semibold tracking-[-0.02em] text-ink sm:text-lg">
              {carDisplayName(car)}
            </span>
          </span>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-accent sm:size-11">
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            <span className="sr-only">View {carDisplayName(car)}</span>
          </span>
        </Link>
      </div>

      {/* Floating info chips */}
      <div className="hero-fade absolute -left-3 top-8 z-20 hidden sm:block lg:-left-8" style={{ "--d": "700ms" } as React.CSSProperties}>
      <m.div
        style={{ x: chipX, y: chipY }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 pr-4 shadow-[var(--shadow-soft)] backdrop-blur"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <ShieldCheck className="size-[18px]" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">Premium Fleet</span>
          <span className="block text-xs text-muted">Clean, well-maintained cars</span>
        </span>
      </m.div>
      </div>
      <div className="hero-fade absolute -right-2 top-1/2 z-20 hidden md:block lg:-right-5" style={{ "--d": "820ms" } as React.CSSProperties}>
      <m.div
        style={{ x: chipX }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 pr-4 shadow-[var(--shadow-soft)] backdrop-blur"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#e8f7ee] text-whatsapp">
          <WhatsAppIcon className="size-[18px]" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">Drive Your Way</span>
          <span className="block text-xs text-muted">Enquire in one message</span>
        </span>
      </m.div>
      </div>
    </div>
  );
}
