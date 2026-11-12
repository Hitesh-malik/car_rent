"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import type { Car } from "@/types/car";
import { carDisplayName } from "@/lib/whatsapp";
import { EASE_OUT } from "@/lib/motion";
import { CarGallery } from "./CarGallery";
import { ViewToggle, type ShowcaseMode } from "./ViewToggle";
import { Viewer3DUnavailable } from "./Viewer3DUnavailable";
import { Viewer3DSkeleton } from "./Viewer3DSkeleton";

// three.js + R3F are only downloaded when a visitor actually opens the 3D view.
const CarViewer3D = dynamic(() => import("./CarViewer3D"), { ssr: false, loading: () => <Viewer3DSkeleton /> });

export function CarShowcase({ car }: { car: Car }) {
  const [mode, setMode] = useState<ShowcaseMode>("photos");
  const name = carDisplayName(car);

  // When the page is hidden by Activity (client navigation), return to photos so no WebGL context lingers.
  useLayoutEffect(() => () => setMode("photos"), []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <ViewToggle value={mode} onChange={setMode} has3D={Boolean(car.model3d)} />
        <p className="hidden text-xs font-medium uppercase tracking-[0.16em] text-white/45 sm:block">
          {mode === "photos" ? `${car.images.length} photos` : car.model3d ? "Interactive 3D" : "3D preview"}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {mode === "photos" ? (
            <CarGallery images={car.images} slug={car.slug} name={name} />
          ) : car.model3d ? (
            <CarViewer3D model={car.model3d} name={name} onExit={() => setMode("photos")} />
          ) : (
            <Viewer3DUnavailable name={name} onBack={() => setMode("photos")} />
          )}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
