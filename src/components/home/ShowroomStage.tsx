"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Box, Move3d, X } from "lucide-react";
import type { Car3DModel } from "@/types/car";
import { EASE_OUT } from "@/lib/motion";
import { Viewer3DSkeleton, CarSilhouette } from "@/components/car/Viewer3DSkeleton";

// three.js + R3F download only after the visitor launches the showroom.
const CarViewer3D = dynamic(() => import("@/components/car/CarViewer3D"), {
  ssr: false,
  loading: () => <Viewer3DSkeleton fill />,
});

const FRAME = "aspect-[4/3.4] sm:aspect-[16/10]";

/** CSS-3D turntable poster that swaps to the real WebGL viewer on demand. */
export function ShowroomStage({ model, name }: { model: Car3DModel; name: string }) {
  const [live, setLive] = useState(false);
  // Pages stay mounted (hidden) under Activity — drop the WebGL context when navigating away.
  useLayoutEffect(() => () => setLive(false), []);

  return (
    <div className={`relative ${FRAME}`}>
      <AnimatePresence mode="wait" initial={false}>
        {live ? (
          <m.div
            key="live"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="absolute inset-0"
          >
            <CarViewer3D model={model} name={name} onExit={() => setLive(false)} className="h-full w-full" />
            <button
              type="button"
              onClick={() => setLive(false)}
              aria-label="Close 3D view"
              className="absolute right-3 top-3 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-night/70 text-white backdrop-blur transition-colors hover:bg-racing sm:right-4 sm:top-4"
            >
              <X className="size-4" aria-hidden />
            </button>
          </m.div>
        ) : (
          <m.div key="poster" exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.3 }} className="absolute inset-0">
            <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-[radial-gradient(ellipse_70%_60%_at_50%_70%,#2a1418_0%,#141419_45%,#0b0b0d_100%)] [perspective:900px]">
              {/* perspective floor grid */}
              <div
                aria-hidden
                className="grid-lines absolute -inset-x-1/2 bottom-[-30%] h-[80%] origin-bottom [transform:rotateX(72deg)] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
              />
              {/* turntable rings */}
              <div aria-hidden className="absolute left-[16%] right-[16%] top-[74%] aspect-square -translate-y-1/2 [transform-style:preserve-3d]">
                <div className="relative h-full w-full [transform:rotateX(78deg)]">
                  <div className="absolute inset-0 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-white/20 motion-reduce:animate-none" />
                  <div className="absolute inset-[10%] rounded-full border-2 border-racing/60 shadow-[0_0_50px_rgb(230_57_70/0.7),inset_0_0_50px_rgb(230_57_70/0.4)]" />
                  <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]" />
                </div>
              </div>
              <div aria-hidden className="glow-pulse absolute inset-x-[20%] bottom-[18%] h-[26%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_51_79/0.4),transparent)] blur-xl" />

              <CarSilhouette className="absolute bottom-[24%] left-1/2 w-[58%] -translate-x-1/2 text-white/30" />

              <div className="absolute inset-x-0 top-[16%] flex flex-col items-center px-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  <Move3d className="size-3.5 text-soft-red" aria-hidden />
                  360° · Drag · Zoom
                </span>
                <button
                  type="button"
                  onClick={() => setLive(true)}
                  className="group/btn relative isolate mt-5 inline-flex h-13 items-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(135deg,#ff334f_0%,#e63946_42%,#b81d30_100%)] px-7 text-[15px] font-semibold text-white shadow-[var(--shadow-btn)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-12px_rgb(255_51_79/0.85)] active:scale-[0.97]"
                >
                  <Box className="size-[18px]" aria-hidden />
                  Launch 3D showroom
                </button>
                <p className="mt-3 text-xs text-white/40">Loads an interactive WebGL model (~1.7 MB)</p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
