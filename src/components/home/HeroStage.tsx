"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ScanEye } from "lucide-react";
import type { Car } from "@/types/car";
import { carDisplayName } from "@/lib/whatsapp";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * Cinematic hero stage: the hero car photo on a perspective plane that tilts with the pointer,
 * with layered depth (wordmark behind, HUD chips in front), a red light pool, a one-off light sweep
 * and a glowing floor line. Pure CSS handles the entrance so the LCP image never waits on JS.
 */
export function HeroStage({ car, wordmark }: { car: Car; wordmark: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const image = car.images[0];

  // Pointer → normalized −0.5…0.5, smoothed with springs.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.7 });
  const rotateY = useTransform(sx, (v) => v * 9);
  const rotateX = useTransform(sy, (v) => v * -6);
  const carX = useTransform(sx, (v) => v * -18);
  const carY = useTransform(sy, (v) => v * -10);
  const wordX = useTransform(sx, (v) => v * -40);
  const glowX = useTransform(sx, (v) => v * 60);
  const glowY = useTransform(sy, (v) => v * 40);

  // Scroll: the car drifts and grows a touch as the hero leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

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
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="relative [perspective:1400px]">
      {/* layer 0 — outlined wordmark far behind */}
      <m.span
        aria-hidden
        style={{ x: wordX }}
        className="pointer-events-none absolute -top-6 left-[6%] z-0 hidden select-none font-[family-name:var(--font-display)] text-[11rem] font-extrabold leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.07)] lg:block xl:text-[14rem]"
      >
        {wordmark}
      </m.span>

      {/* layer 1 — red light pool that follows the pointer */}
      <m.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute left-[18%] top-[30%] z-0 h-[60%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(216_58_78/0.18),transparent)] blur-3xl"
      />

      {/* layer 2 — the car plane (tilts in 3D) */}
      <m.div style={{ rotateX, rotateY, y: scrollY, scale: scrollScale }} className="relative z-10 [transform-style:preserve-3d]">
        <div className="hero-car relative" style={d(120)}>
          <div className="relative aspect-[4/3.2] overflow-hidden [mask-image:radial-gradient(ellipse_53%_56%_at_55%_52%,black_52%,transparent_100%)] sm:aspect-[16/11.5]">
            <m.div style={{ x: carX, y: carY }} className="absolute -inset-6">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                fetchPriority="high"
                quality={85}
                sizes="(min-width: 1320px) 900px, (min-width: 1024px) 62vw, 100vw"
                className="object-cover [filter:brightness(0.92)_contrast(1.12)_saturate(1.12)]"
                style={{ objectPosition: image.focus ?? "50% 55%" }}
              />
            </m.div>
            {/* cinematic grade: crush the showroom background into the night, keep the car lit */}
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_55%_58%,transparent_35%,rgb(21_22_25/0.82)_100%)]" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-night/80 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night via-night/50 to-transparent" />
            {/* one-off light sweep across the bodywork */}
            <div aria-hidden className="hero-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={d(900)} />
          </div>

          {/* glowing floor line + reflection */}
          <div aria-hidden className="absolute inset-x-[12%] bottom-[9%] h-px bg-gradient-to-r from-transparent via-racing/60 to-transparent" />
          <div aria-hidden className="absolute inset-x-[20%] bottom-[8%] h-6 rounded-[50%] bg-bright/30 blur-xl" />
        </div>

        {/* layer 3 — HUD chips floating in front (translateZ) */}
        <div className="hero-fade absolute left-[8%] top-[10%] z-20 hidden md:block" style={d(1000)}>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-night/70 p-2.5 pr-4 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md [transform:translateZ(70px)]">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-racing/15 text-soft-red ring-1 ring-inset ring-racing/30">
              <ScanEye className="size-[18px]" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">Digital showroom</span>
              <span className="block text-xs text-white/50">Every angle, every detail</span>
            </span>
          </div>
        </div>

        <div className="hero-fade absolute bottom-[6%] left-[4%] z-20 sm:bottom-[10%] sm:left-[14%]" style={d(1100)}>
          <Link
            href={`/cars/${car.slug}`}
            transitionTypes={["nav-forward"]}
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-night/75 p-2 pl-4 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md transition-colors hover:border-racing/50 [transform:translateZ(90px)]"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-soft-red">
                <span className="size-1 rounded-full bg-bright" />
                Featured · {car.categoryLabel}
              </span>
              <span className="mt-0.5 block truncate font-[family-name:var(--font-display)] text-base font-bold tracking-[-0.02em] text-white sm:text-lg">
                {carDisplayName(car)}
              </span>
            </span>
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-ink transition-colors duration-300 group-hover:bg-racing group-hover:text-white">
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              <span className="sr-only">View {carDisplayName(car)}</span>
            </span>
          </Link>
        </div>
      </m.div>
    </div>
  );
}
