---
name: car-3d-viewer
description: How the Roy Rentals interactive 3D car viewer works (React Three Fiber + drei, GLB models, studio lighting, camera controls, lazy loading, fallbacks) and how to add a new car model. Use when touching src/components/car/CarViewer3D.tsx, the Photos/3D toggle, or adding/optimising GLB/GLTF files in public/models.
---

# Car 3D viewer

## Architecture

- **No car currently has a 3D model.** The generic "Car Concept" sample was removed because it misrepresented the C-Class.
- The `/showroom` page (`StudioViewer`) uses real photography. It shows a **3D** mode only for a car whose `model3d` is accurate (`isRepresentative` not set) and mounts `CarViewer3D` only when the visitor picks it.
- Never attach a stand-in/generic model to a real vehicle record — a real photo is better than an inaccurate model.
- `CarViewer3D` is loaded with `next/dynamic(..., { ssr: false })` **from a client component**, so `three`, `@react-three/fiber` and `@react-three/drei` are only downloaded after the visitor picks 3D View. Never import them statically from a server component or the home page — always via `next/dynamic` behind a user action.
- Load failures are caught by an error boundary inside the viewer, which offers "Back to photos".

## Rendering setup (keep it)

- `<Canvas frameloop="demand" dpr={[1, 2]} shadows camera={{ fov: 32 }}>` — demand rendering keeps idle GPU at zero.
- Lighting: drei `<Environment resolution={256}>` built from `<Lightformer>` panels (local, no HDRI download) including red `#ff334f` rim strips, plus one key light and a red point light. Dark night-studio look: CSS radial gradient behind a transparent canvas with a red floor glow.
- Grounding: `<ContactShadows>` at y = 0, model centred on X/Z with `<Center disableY>` (models must have wheels at y = 0).
- Controls: drei `<CameraControls>` — no truck/pan, clamped `minDistance`/`maxDistance`, polar angle limited so the camera never goes under the floor. Reset uses `controls.reset(true)` (animated).
- Mobile: the canvas has `touch-action: pan-y` so vertical swipes scroll the page; horizontal drag rotates; pinch zooms.

## Adding a model for a car

1. Get a GLB with a licence that allows commercial use (CC0 / CC-BY). Record the credit.
2. Optimise it — target < 3 MB:
   ```bash
   npx @gltf-transform/cli optimize in.glb public/models/<slug>.glb --compress meshopt --texture-compress webp --texture-size 1024
   ```
   (meshopt is decoded locally by drei; avoid Draco, which pulls a decoder from a CDN.)
3. Make sure the car faces +Z or set a rotation, wheels touch y = 0, and real-world scale is ~metres.
4. Add to the car in `src/data/cars.ts`:
   ```ts
   model3d: { src: "/models/<slug>.glb", cameraPosition: [5, 1.6, 6], credit: "Model by … (CC BY 4.0)" }
   ```
   Set `isRepresentative: true` if the model is not this exact vehicle — the viewer then shows a disclosure label. Never present a stand-in model as the real car.
5. Check: loads, rotates, zoom limits feel right, reset works, no console errors, the home page network tab shows no three.js chunk.
