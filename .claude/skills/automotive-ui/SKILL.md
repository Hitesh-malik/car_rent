---
name: automotive-ui
description: Visual design standards for the Roy Rentals car showroom (Next.js + Tailwind v4). Use when creating or changing any page, section, card, button, layout or responsive behaviour in this project, so new UI matches the premium Black + Racing-Red automotive design system instead of drifting toward a generic template.
---

# Automotive UI standards — Black + Racing Red

A night showroom: black stages lit with racing-red light, alternating with bright white "gallery" sections. Red is light and accent, never a flat background. The car photography is the hero.

## Tokens (`src/app/globals.css` `@theme` — never hard-code hex values in components except inside gradients)

| Token | Use |
| --- | --- |
| `night` #0B0B0D | hero, showroom, car detail top, similar cars, footer |
| `night-2` #141419 / `charcoal` #202027 | raised dark surfaces, dark cards (`CarCard tone="dark"`), panels |
| `racing` #E63946 | primary accent, icons, active states |
| `bright` #FF334F / `soft-red` #FF6678 | interactive highlights, glows, icons on dark |
| `canvas` #FFF / `mist` #F7F7F8 | light sections (alternate them) |
| `line` #E5E5E7, `muted` #777780, `ink-soft` | borders, meta, body text on light |

Utilities: `text-red-gradient` (one phrase per heading, max), `grid-lines`, `grain`, `glow-pulse`, `skeleton` / `skeleton-dark`, `race-line`.
Primary CTA gradient: `linear-gradient(135deg,#ff334f,#e63946 42%,#b81d30)` + `--shadow-btn` (use `buttonClasses({ variant: "primary" })`).

## Section rhythm

Every page starts dark so it meets the sticky dark header, then light content, dark accent sections, dark footer. Never stack more than two dark sections and never make a whole page dark. Red lighting = blurred radial gradients (`bg-racing/20 blur-[100px]`) and 1px red hairlines, not red fills.

## Typography

Manrope (`--font-display`, applied to h1–h4) + Inter (body). Hero/page H1: extrabold, uppercase, tracking ≈ -0.05em, leading ≈ 0.9. H2 via `SectionHeading` (bold, -0.04em). `Eyebrow` for all small-caps labels (red rule + dot). One `<h1>` per page.

## Components to reuse

`ButtonLink` / `buttonClasses` (primary, dark, outline, outlineDark, ghost, light, whatsapp), `SectionHeading` / `Eyebrow` (`tone="dark"` on dark), `Container`, `Reveal*`, `ImageWithFallback` (`tone`), `CarCard` (`tone`), `TiltCard`, `Field` / `inputClasses`, `TripPlanner` (`variant="search" | "panel"`), `RentButton`, `CATEGORY_META`, `buildWhatsAppUrl` / `buildTripWhatsAppUrl`.

## Layout

`Container` (max 1320px). Sections `py-20 sm:py-28`. Floating panels overlap dark→light seams with negative margins — add `flow-root` to the parent so the margin doesn't collapse. Sticky columns need ancestors with `overflow-clip`, not `overflow-hidden`. Must work from 320px; touch targets ≥ 44px.

## Honesty rules

No fake ratings, testimonials, stats, discounts, availability or payments. Booking = WhatsApp enquiry; prices show "Price on inquiry" until `pricePerDay` is set (price filters/sorts appear automatically then).
