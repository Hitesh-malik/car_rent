"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  CameraControlsImpl,
  Center,
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Images, Info, RotateCcw } from "lucide-react";
import type { Car3DModel } from "@/types/car";
import { Viewer3DSkeleton } from "./Viewer3DSkeleton";

const { ACTION } = CameraControlsImpl;
const DEFAULT_CAMERA: [number, number, number] = [5.2, 1.7, 6.2];
const TARGET: [number, number, number] = [0, 0.55, 0];

/* ───────────── scene pieces ───────────── */

function CarModel({ src, scale = 1 }: { src: string; scale?: number }) {
  // meshopt-compressed GLBs decode locally; Draco is disabled to avoid fetching a decoder from a CDN.
  const { scene } = useGLTF(src, false, true);
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean };
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);
  return (
    <Center disableY>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}

/** Studio lighting built from local light panels — no HDRI download. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 8, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={2} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4 - 10]} scale={[4, 1, 1]} />
          ))}
          <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
    </>
  );
}

/* ───────────── error boundary ───────────── */

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D model failed to load", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function LoadOverlay() {
  const { active, progress } = useProgress();
  const done = !active && progress === 100;
  return (
    <div
      aria-hidden={done}
      className={`absolute inset-0 z-10 transition-opacity duration-500 ${done ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <Viewer3DSkeleton progress={progress} />
    </div>
  );
}

/* ───────────── viewer ───────────── */

export default function CarViewer3D({ model, name, onExit }: { model: Car3DModel; name: string; onExit: () => void }) {
  const controls = useRef<CameraControlsImpl>(null);
  const [coarse, setCoarse] = useState(false);
  const camera = model.cameraPosition ?? DEFAULT_CAMERA;

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function configure(c: CameraControlsImpl | null) {
    controls.current = c;
    if (!c) return;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.middle = ACTION.NONE;
    c.mouseButtons.wheel = ACTION.DOLLY;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
    c.dollyToCursor = false;
    c.smoothTime = 0.35;
    c.draggingSmoothTime = 0.12;
    c.setLookAt(...camera, ...TARGET, false);
    c.saveState();
  }

  const failed = (
    <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-[var(--radius-panel)] border border-line bg-mist px-6 text-center sm:aspect-[16/10]">
      <p className="font-semibold text-ink">We couldn&apos;t load the 3D model</p>
      <p className="mt-1 text-sm text-muted">Please check your connection, or explore the photos instead.</p>
      <button
        type="button"
        onClick={onExit}
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink-soft"
      >
        <Images className="size-4" aria-hidden />
        Back to photos
      </button>
    </div>
  );

  return (
    <ModelErrorBoundary fallback={failed}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-gradient-to-b from-white via-[#f8f9fb] to-surface sm:aspect-[16/10]"
        role="img"
        aria-label={`Interactive 3D model${model.isRepresentative ? " (representative sample)" : ""} for the ${name}. Drag to rotate, scroll or pinch to zoom.`}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          shadows="percentage"
          camera={{ fov: 32, position: camera, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          // Vertical swipes keep scrolling the page on touch devices; horizontal drags rotate the car.
          style={{ touchAction: "pan-y" }}
          className="!absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <StudioLights />
            <CarModel src={model.src} scale={model.scale} />
            <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={12} blur={2.4} far={4} resolution={512} frames={1} />
          </Suspense>
          <CameraControls
            ref={configure}
            makeDefault
            minDistance={4.2}
            maxDistance={11}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2 - 0.04}
            truckSpeed={0}
          />
        </Canvas>

        <LoadOverlay />

        {/* top-left disclosure */}
        {(model.isRepresentative || model.credit) && (
          <div className="pointer-events-none absolute left-3 top-3 max-w-[75%] sm:left-4 sm:top-4">
            {model.isRepresentative && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-[var(--shadow-soft)] backdrop-blur">
                <Info className="size-3.5 text-accent" aria-hidden />
                Representative sample model
              </span>
            )}
            {model.credit && <p className="mt-1.5 pl-1 text-[10px] leading-tight text-muted">{model.credit}</p>}
          </div>
        )}

        {/* bottom controls */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-4 sm:bottom-4">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
            {coarse ? "Drag to rotate • Pinch to zoom" : "Drag to explore • Scroll to zoom"}
          </span>
          <button
            type="button"
            onClick={() => controls.current?.reset(true)}
            className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-white"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span className="hidden sm:inline">Reset view</span>
            <span className="sr-only sm:hidden">Reset view</span>
          </button>
        </div>
      </div>
    </ModelErrorBoundary>
  );
}
