"use client";

import Image from "next/image";
import { ViewTransition, useCallback, useState } from "react";
import { AnimatePresence, m, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarImage } from "@/types/car";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

const ANGLE_LABEL: Record<CarImage["angle"], string> = {
  front: "Front",
  side: "Side",
  rear: "Rear",
  interior: "Interior",
  dashboard: "Dashboard",
  detail: "Detail",
};

export function CarGallery({ images, slug, name }: { images: CarImage[]; slug: string; name: string }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const count = images.length;

  const go = useCallback(
    (next: number, dir?: number) => {
      if (!count) return;
      const wrapped = (next + count) % count;
      setState(([cur]) => [wrapped, dir ?? (wrapped > cur ? 1 : -1)]);
    },
    [count],
  );

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) go(index + 1, 1);
    else if (swipe > 60) go(index - 1, -1);
  }

  if (!count) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-[var(--radius-panel)] bg-charcoal text-sm text-white/50">
        Photos coming soon
      </div>
    );
  }

  const current = images[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} photos`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1, 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1, -1);
        }
      }}
      className="rounded-[var(--radius-panel)] outline-none focus-visible:ring-2 focus-visible:ring-bright focus-visible:ring-offset-4 focus-visible:ring-offset-night"
    >
      <ViewTransition name={`car-${slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-charcoal ring-1 ring-white/[0.08] sm:aspect-[16/10]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <m.div
              key={current.src}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 1.02 }),
                center: { opacity: 1, x: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.99 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE_OUT }}
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={onDragEnd}
              className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            >
              <ImageWithFallback
                src={current.src}
                alt={current.alt}
                fill
                preload={index === 0}
                fetchPriority={index === 0 ? "high" : undefined}
                quality={85}
                draggable={false}
                sizes="(min-width: 1320px) 780px, (min-width: 1024px) 60vw, 100vw"
                className="pointer-events-none select-none object-cover"
                style={{ objectPosition: current.focus ?? "50% 55%" }}
              />
            </m.div>
          </AnimatePresence>

          {/* overlays */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-night/40 to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 sm:bottom-5 sm:left-5">
            <span className="rounded-full border border-white/10 bg-night/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur" aria-live="polite">
              {ANGLE_LABEL[current.angle]}
              <span className="ml-2 tabular-nums text-white/50">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </span>
          </div>
          {count > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
              <button
                type="button"
                onClick={() => go(index - 1, -1)}
                aria-label="Previous photo"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-night/70 text-white backdrop-blur transition-[background-color,border-color,transform] hover:border-racing hover:bg-racing active:scale-95"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1, 1)}
                aria-label="Next photo"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-night/70 text-white backdrop-blur transition-[background-color,border-color,transform] hover:border-racing hover:bg-racing active:scale-95"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </ViewTransition>

      {count > 1 && (
        <ul className="no-scrollbar -mx-1 mt-2 flex gap-2.5 overflow-x-auto p-1 pb-2 sm:mt-3 sm:gap-3" aria-label="Choose a photo">
          {images.map((img, i) => {
            const active = i === index;
            return (
              <li key={img.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show photo ${i + 1}: ${img.alt}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative block h-16 w-24 overflow-hidden rounded-xl bg-charcoal transition-[opacity,box-shadow] duration-200 sm:h-[4.5rem] sm:w-28",
                    active ? "opacity-100 ring-2 ring-racing ring-offset-2 ring-offset-night" : "opacity-45 hover:opacity-100",
                  )}
                >
                  <Image src={img.src} alt="" fill sizes="112px" className="object-cover" style={{ objectPosition: img.focus ?? "50% 55%" }} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
