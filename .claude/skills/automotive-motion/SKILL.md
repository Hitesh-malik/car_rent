---
name: automotive-motion
description: Animation and interaction standards for the Roy Rentals site — Motion (motion/react) via LazyMotion, React ViewTransition route transitions, CSS hero entrances and reduced-motion rules. Use when adding or changing any animation, hover effect, scroll reveal, page transition, gallery transition or micro-interaction in this project.
---

# Automotive motion standards

Motion should feel engineered and quiet — like a premium car door closing, not a fairground. It must never delay content or fight scrolling.

## Libraries and how they're wired

- **Motion** (`motion/react`) inside `<MotionProvider>` = `LazyMotion strict` + async `domMax` + `MotionConfig reducedMotion="user"`.
  - Always use `m.div`, `m.li`, … — **never `motion.div`** (strict mode throws).
- **Route transitions** use React's `<ViewTransition>` (Next 16 / React 19.3), not template.tsx:
  - Page content is wrapped in `<ViewTransition enter="page" exit="page" default="none">`-style wrappers in each `page.tsx`.
  - The car image morphs card → detail via a shared `name={`car-${slug}`}` with `share="morph" default="none"`. Names must be unique on a page.
  - Links into a car use `transitionTypes={["nav-forward"]}`, links back use `["nav-back"]`.
  - The header is anchored with `viewTransitionName: "site-header"`.
- **Above-the-fold hero** uses CSS utilities `hero-line`, `hero-fade`, `hero-car`, `hero-sweep`, `hero-rule` with a `--d` delay — no JS on the LCP path. `HeroStage` adds pointer-driven 3D tilt (rotateX/Y ≤ 9°) with layered depth (wordmark behind, glow, HUD chips with `translateZ`).
  - Never put a CSS animation class and a Motion `style={{x,y}}` on the **same** element (CSS `fill-mode: both` wins over transforms). Wrap instead.

## Timing

| Kind | Duration | Easing |
| --- | --- | --- |
| Hover / press / toggles | 150–300ms | `--ease-out-expo` / `EASE_OUT` |
| Gallery slide, filter, menu | 300–450ms | `EASE_OUT` or spring `stiffness≈420, damping≈34` |
| Section reveals, route morph | 350–600ms | `EASE_OUT` |

Shared constants live in `src/lib/motion.ts` (`EASE_OUT`, `DURATION`, `fadeUp`).

## Patterns

- Scroll reveals: `<Reveal>` or `<RevealGroup>`/`<RevealItem>`; `viewport once`, ~80px bottom margin, y offset ≤ 24px.
- Active indicators (nav, filter pills, Photos|3D toggle) use a shared `layoutId` pill.
- Filtering: `m.ul layout` + `AnimatePresence mode="popLayout"`, keep a `min-h` on the grid to avoid page jumps.
- Hover on cards: `TiltCard` mouse tilt (≤ 7°, CSS variables, no re-renders, mouse only, off under reduced motion) + glare, image `scale-[1.06]` over 700ms, a red light line draws under the image, red-tinted shadow.
- Step/feature reveals may use a perspective entrance (`rotateX` ≤ 28° → 0) inside a `[perspective:1200px]` parent.
- Parallax only on `pointerType === "mouse"` and only with springs; scroll drift ≤ 60px.

## Rules

- Animate only `opacity` and `transform` (and `filter: blur` ≤ 3px in view transitions).
- Respect reduced motion: `MotionConfig reducedMotion="user"` + the global CSS `prefers-reduced-motion` block. Check new CSS keyframes are covered.
- Pages stay mounted (hidden) under Cache Components' Activity — reset transient state (menus, 3D mode) in a `useLayoutEffect` cleanup.
- Never auto-rotate or loop the hero car. Infinite animations are limited to `glow-pulse` (opacity), loaders (`race-line`) and the showroom turntable ring; all stop under reduced motion.
