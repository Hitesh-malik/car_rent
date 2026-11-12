"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { animate, m, useMotionValue, useReducedMotion, type Transition } from "motion/react";
import { Box, ChevronLeft, ChevronRight, Expand, Minimize, Minus, Plus, RotateCcw } from "lucide-react";
import type { Car } from "@/types/car";
import type { StudioView, ViewMode } from "@/lib/views";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Viewer3DSkeleton } from "@/components/car/Viewer3DSkeleton";

// three.js only downloads if a car has an accurate 3D model AND the visitor opens it.
const CarViewer3D = dynamic(() => import("@/components/car/CarViewer3D"), { ssr: false, loading: () => <Viewer3DSkeleton fill /> });

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const noop = () => () => {};
function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useCoarsePointer = () => useSyncExternalStore(subscribeCoarse, () => window.matchMedia("(pointer: coarse)").matches, () => false);
const useCanFullscreen = () => useSyncExternalStore(noop, () => Boolean(document.fullscreenEnabled), () => false);

const iconBtn =
  "pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-night/70 text-white backdrop-blur-md transition-[background-color,border-color,opacity] duration-200 hover:border-white/25 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35";

/**
 * Studio viewer built on the car's real photographs: perspectives, drag/swipe to turn between angles,
 * pinch / Ctrl+scroll / double-click zoom with panning, fullscreen and keyboard control.
 */
export function StudioViewer({
  car,
  views,
  index,
  onIndex,
}: {
  car: Car;
  views: StudioView[];
  index: number;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const canFullscreen = useCanFullscreen();
  const has3D = Boolean(car.model3d && !car.model3d.isRepresentative);
  const [show3D, setShow3D] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const current = views[index] ?? views[0];
  const mode: ViewMode = current?.mode ?? "exterior";
  const hasInterior = views.some((v) => v.mode === "interior");
  const modeViews = views.map((v, i) => ({ v, i })).filter((x) => x.v.mode === mode);
  const modePos = modeViews.findIndex((x) => x.i === index);

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const dragX = useMotionValue(0);

  const spring = useMemo<Transition>(() => (reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }), [reduce]);

  /* ───────── zoom & pan ───────── */
  const clampPan = useCallback((s: number, x: number, y: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    const mx = ((s - 1) * (r?.width ?? 0)) / 2;
    const my = ((s - 1) * (r?.height ?? 0)) / 2;
    return [clamp(x, -mx, mx), clamp(y, -my, my)] as const;
  }, []);

  const setZoom = useCallback(
    (s: number, x: number, y: number, animated = true) => {
      const next = clamp(s, MIN_ZOOM, MAX_ZOOM);
      const [cx, cy] = clampPan(next, x, y);
      if (animated) {
        animate(scale, next, spring);
        animate(tx, cx, spring);
        animate(ty, cy, spring);
      } else {
        scale.set(next);
        tx.set(cx);
        ty.set(cy);
      }
      setZoomed(next > 1.01);
    },
    [clampPan, scale, tx, ty, spring],
  );
  const resetZoom = useCallback(() => setZoom(1, 0, 0), [setZoom]);

  /** Zoom in on a screen point (or back out if already zoomed). */
  const zoomAt = (clientX: number, clientY: number) => {
    if (scale.get() > 1.01) return resetZoom();
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    const s = 2.2;
    const px = clientX - r.left - r.width / 2;
    const py = clientY - r.top - r.height / 2;
    setZoom(s, -px * (s - 1), -py * (s - 1));
  };
  const zoomBy = (factor: number) => {
    const s0 = scale.get();
    const s1 = clamp(s0 * factor, MIN_ZOOM, MAX_ZOOM);
    setZoom(s1, tx.get() * (s1 / s0), ty.get() * (s1 / s0));
  };

  /* ───────── navigation ───────── */
  const goTo = (i: number) => {
    if (i === index) return;
    resetZoom();
    onIndex(i);
  };
  const step = (d: 1 | -1) => {
    if (modeViews.length < 2) return;
    goTo(modeViews[(modePos + d + modeViews.length) % modeViews.length].i);
  };
  const setMode = (next: ViewMode | "3d") => {
    if (next === "3d") return setShow3D(true);
    setShow3D(false);
    if (next !== mode) {
      const first = views.findIndex((v) => v.mode === next);
      if (first >= 0) goTo(first);
    }
  };

  /* ───────── Ctrl/⌘ + wheel (and trackpad pinch) zoom; plain wheel zooms only in fullscreen ───────── */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey || document.fullscreenElement)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left - r.width / 2;
      const py = e.clientY - r.top - r.height / 2;
      const s0 = scale.get();
      const s1 = clamp(s0 * Math.exp(-e.deltaY * 0.0025), MIN_ZOOM, MAX_ZOOM);
      const k = s1 / s0;
      setZoom(s1, px - (px - tx.get()) * k, py - (py - ty.get()) * k, false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scale, tx, ty, setZoom, show3D]);

  /* ───────── fullscreen ───────── */
  useEffect(() => {
    const onChange = () => {
      setIsFs(document.fullscreenElement === frameRef.current);
      setZoom(1, 0, 0, false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [setZoom]);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.().catch(() => {});
  };

  /* ───────── pointer gestures: drag/swipe to turn, pinch to zoom, drag to pan ───────── */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ x: number; y: number; tx: number; ty: number; scale: number; dist: number; moved: boolean; pinched: boolean } | null>(null);
  const lastTap = useRef(0);
  const lastPointerType = useRef("mouse");

  const startGesture = () => {
    const pts = [...pointers.current.values()];
    const prev = gesture.current;
    gesture.current = {
      x: pts[0].x,
      y: pts[0].y,
      tx: tx.get(),
      ty: ty.get(),
      scale: scale.get(),
      dist: pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
      moved: prev?.moved ?? false,
      pinched: (prev?.pinched ?? false) || pts.length > 1,
    };
  };

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    lastPointerType.current = e.pointerType;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    startGesture();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2 && g.dist) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setZoom(g.scale * (d / g.dist), g.tx, g.ty, false);
      g.moved = true;
      return;
    }
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) g.moved = true;
    if (scale.get() > 1.01) {
      const [x, y] = clampPan(scale.get(), g.tx + dx, g.ty + dy);
      tx.set(x);
      ty.set(y);
    } else if (!g.pinched && (e.pointerType === "mouse" || Math.abs(dx) > Math.abs(dy))) {
      dragX.set(dx * 0.3); // resistance — the photo leans toward the next angle
    }
  }

  function endPointer(e: React.PointerEvent<HTMLDivElement>, cancelled = false) {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) return startGesture(); // keep panning with the remaining finger
    gesture.current = null;
    animate(dragX, 0, spring);
    if (!g || cancelled || g.pinched) return;
    const dx = e.clientX - g.x;
    if (scale.get() <= 1.01 && Math.abs(dx) > 50) return step(dx < 0 ? 1 : -1);
    if (!g.moved && e.pointerType !== "mouse") {
      const now = Date.now();
      if (now - lastTap.current < 320) {
        zoomAt(e.clientX, e.clientY);
        lastTap.current = 0;
      } else lastTap.current = now;
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "+" || e.key === "=") zoomBy(1.4);
    else if (e.key === "-") zoomBy(1 / 1.4);
    else if (e.key === "0") resetZoom();
    else return;
    e.preventDefault();
  }

  const modeOptions: { value: ViewMode | "3d"; label: string }[] = [
    { value: "exterior", label: "Exterior" },
    ...(hasInterior ? [{ value: "interior" as const, label: "Interior" }] : []),
    ...(has3D ? [{ value: "3d" as const, label: "3D" }] : []),
  ];
  const activeMode = show3D ? "3d" : mode;

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative overflow-hidden border-white/[0.08] bg-night",
        isFs ? "flex h-full w-full flex-col" : "-mx-4 border-y sm:mx-0 sm:rounded-[1.75rem] sm:border",
      )}
    >
      {/* ───────── stage ───────── */}
      <div className={cn("relative isolate", isFs ? "min-h-0 flex-1" : "aspect-[4/3.3] sm:aspect-[16/9.6]")}>
        {/* studio: deep black, charcoal floor, soft red ambient behind the car */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,#27272c_0%,#19191c_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-transparent to-charcoal" />
          <div className="absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(189_57_74/0.1),transparent)] blur-2xl" />
          <div className="absolute inset-x-[8%] top-[74%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {show3D && car.model3d ? (
          <CarViewer3D model={car.model3d} name={`${car.brand} ${car.model}`} onExit={() => setShow3D(false)} className="absolute inset-0 h-full w-full rounded-none border-0" />
        ) : (
          <div
            ref={stageRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${car.brand} ${car.model} — ${current?.label} view. Use left and right arrow keys to change the view, plus and minus to zoom.`}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endPointer(e)}
            onPointerCancel={(e) => endPointer(e, true)}
            onDoubleClick={(e) => lastPointerType.current === "mouse" && zoomAt(e.clientX, e.clientY)}
            style={{ touchAction: zoomed ? "none" : "pan-y" }}
            className={cn(
              "absolute inset-0 select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bright",
              zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-ew-resize",
            )}
          >
            <m.div style={{ x: dragX }} className="absolute inset-0">
              <m.div style={{ scale, x: tx, y: ty }} className="absolute inset-0 will-change-transform">
                {views.map((v, i) => {
                  const active = i === index;
                  return (
                    <m.div
                      key={v.image.src}
                      aria-hidden={!active}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, x: active ? 0 : i < index ? -36 : 36, scale: active ? 1 : 1.015 }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="absolute inset-0"
                    >
                      {/* the photo sits centred at its own aspect ratio; its edges feather into the studio */}
                      <div
                        className={cn(
                          "absolute left-1/2 top-1/2 h-full max-w-full -translate-x-1/2 -translate-y-1/2 [-webkit-mask-composite:source-in] [mask-composite:intersect]",
                          v.mode === "exterior"
                            ? "[mask-image:linear-gradient(to_right,transparent,black_24%,black_76%,transparent),linear-gradient(to_bottom,transparent,black_14%,black_82%,transparent)]"
                            : "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent),linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]",
                        )}
                        style={{ aspectRatio: `${v.image.width} / ${v.image.height}` }}
                      >
                        <ImageWithFallback
                          src={v.image.src}
                          alt={active ? v.image.alt : ""}
                          fill
                          draggable={false}
                          preload={i === index}
                          quality={85}
                          sizes={isFs ? "100vw" : "(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"}
                          className="pointer-events-none object-cover"
                          style={{ objectPosition: v.image.focus ?? "50% 55%" }}
                        />
                      </div>
                    </m.div>
                  );
                })}
              </m.div>
            </m.div>
          </div>
        )}

        {/* floor light under the car */}
        {!show3D && mode === "exterior" && !isFs && (
          <div aria-hidden className="pointer-events-none absolute inset-x-[22%] bottom-[7%] h-px bg-gradient-to-r from-transparent via-bright/70 to-transparent" />
        )}

        {/* ───────── overlay controls ───────── */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          {modeOptions.length > 1 ? (
            <div role="radiogroup" aria-label="View" className="pointer-events-auto inline-flex rounded-full border border-white/10 bg-night/70 p-1 backdrop-blur-md">
              {modeOptions.map((o) => {
                const active = o.value === activeMode;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMode(o.value)}
                    className={cn("relative inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors sm:px-4", active ? "text-white" : "text-white/55 hover:text-white")}
                  >
                    {active && (
                      <m.span layoutId="studio-mode" className="absolute inset-0 rounded-full bg-racing" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    {o.value === "3d" && <Box className="relative size-3.5" aria-hidden />}
                    <span className="relative">{o.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <span />
          )}

          {!show3D && (
            <div className="flex gap-1.5">
              <button type="button" onClick={() => zoomBy(1 / 1.4)} disabled={!zoomed} aria-label="Zoom out" title="Zoom out" className={iconBtn}>
                <Minus className="size-4" aria-hidden />
              </button>
              <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in" title="Zoom in" className={iconBtn}>
                <Plus className="size-4" aria-hidden />
              </button>
              <button type="button" onClick={resetZoom} disabled={!zoomed} aria-label="Reset view" title="Reset view" className={iconBtn}>
                <RotateCcw className="size-4" aria-hidden />
              </button>
              {canFullscreen && (
                <button type="button" onClick={toggleFullscreen} aria-label={isFs ? "Exit fullscreen" : "Fullscreen"} title={isFs ? "Exit fullscreen" : "Fullscreen"} className={iconBtn}>
                  {isFs ? <Minimize className="size-4" aria-hidden /> : <Expand className="size-4" aria-hidden />}
                </button>
              )}
            </div>
          )}
        </div>

        {!show3D && modeViews.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous view" className={cn(iconBtn, "absolute left-3 top-1/2 size-11 -translate-y-1/2 sm:left-4")}>
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next view" className={cn(iconBtn, "absolute right-3 top-1/2 size-11 -translate-y-1/2 sm:right-4")}>
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}

        {!show3D && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
            <span className="rounded-full border border-white/10 bg-night/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md" aria-live="polite">
              {current?.label}
              <span className="ml-2 tabular-nums text-white/55">
                {String(modePos + 1).padStart(2, "0")} / {String(modeViews.length).padStart(2, "0")}
              </span>
            </span>
            <span className="hidden rounded-full bg-night/60 px-3 py-1.5 text-[11px] font-medium text-white/55 backdrop-blur-md md:inline">
              {coarse ? "Swipe to turn · Pinch to zoom" : zoomed ? "Drag to pan · Double-click to reset" : "Drag to turn · Double-click or Ctrl + scroll to zoom"}
            </span>
          </div>
        )}
      </div>

      {/* ───────── perspective bar ───────── */}
      {!show3D && (
        <div className="border-t border-white/[0.06] bg-charcoal">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto px-2 py-2 sm:px-3" aria-label={`${mode === "exterior" ? "Exterior" : "Interior"} perspectives`}>
            {modeViews.map(({ v, i }) => {
              const active = i === index;
              return (
                <li key={v.image.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl p-1.5 pr-3.5 text-left transition-colors duration-200",
                      active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <span className={cn("relative h-10 w-16 overflow-hidden rounded-lg ring-1 transition-[box-shadow]", active ? "ring-2 ring-racing" : "ring-white/10")}>
                      <ImageWithFallback src={v.image.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: v.image.focus ?? "50% 55%" }} />
                    </span>
                    <span className={cn("text-[13px] font-semibold", active ? "text-white" : "text-white/55 group-hover:text-white/85")}>{v.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
