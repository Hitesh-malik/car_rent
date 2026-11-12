---
name: automotive-ui
description: Visual design standards for the Roy Rentals car showroom (Next.js + Tailwind v4). Use when creating or changing any page, section, card, button, layout or responsive behaviour in this project, so new UI matches the premium Black + Racing-Red automotive design system instead of drifting toward a generic template.
---

# Automotive UI standards — refined Black + Red + White

A calm, premium showroom: soft black and charcoal stages, warm-white content sections, and one muted racing red used sparingly. The car photography is the hero. **Refine, never re-theme** — no other accent colours.

## Proportions

~55–60% warm white / white · ~25–30% soft black / charcoal · ≤10% red. Red is for primary CTAs, active/selected states, small lines and dots, and **one** highlighted phrase per page H1 (hero, explore, showroom, 404). Everything else stays neutral.

## Tokens (`src/app/globals.css` `@theme` — never hard-code hex values in components)

| Token | Value | Use |
| --- | --- | --- |
| `night` / `charcoal` / `charcoal-2` | #151619 / #202126 / #28292D | dark stages, panels on dark, raised surfaces |
| `racing` / `racing-deep` | #D83A4E / #C93649 | CTA fill / hover; `racing-deep` for **small red text on light** (4.7:1) |
| `soft-red` | #E8798A | small red text/icons on dark (6.5:1) |
| `red-tint` | #FBEAEC | subtle red backgrounds (active FAQ toggle) |
| `canvas` / `mist` / `surface` / `grey` | #FFF / #F6F5F2 / #EFEEEA / #E8E7E4 | light sections, frames |
| `ink` / `ink-soft` / `muted` / `muted-dark` | #242428 / #46464C / #68686F / #B8B8BD | text |
| `line` | #E5E4E1 | borders |

Utilities: `stage-dark` (soft charcoal page-top stage), `seam-top` (soft transition after a dark section), `text-red-gradient` (muted — max one per page), `grid-lines`, `grain`, `skeleton` / `skeleton-dark`.
Shadows: `--shadow-soft`, `--shadow-lift` (neutral), `--shadow-btn` (primary buttons only). **No red glows, red card shadows or pulsing light.** Red light pools behind cars stay ≤ 10% opacity.

## Contrast rules (WCAG 2.2, verified)

White on `racing` 4.5:1 · `muted` on mist 5.1:1 · white text on dark ≥ `white/55` (6:1) — never `/35–/45` for text.

## Section rhythm

Page tops are `stage-dark`; light sections that follow dark ones get `seam-top`. Alternate `mist` and `white`; never stack more than two dark sections; the footer is the closing dark band.

## Typography

Manrope (`--font-display`, applied to h1–h4) + Inter (body). Only the home hero H1 is uppercase/extrabold; other H1s are bold, sentence case. H2 via `SectionHeading` (semibold, -0.035em); a second phrase may use a neutral tone (`text-muted` / `text-white/55`) instead of red. `Eyebrow` for all small-caps labels (red rule + dot). One `<h1>` per page.

## Components to reuse

`ButtonLink` / `buttonClasses` (primary = flat muted red; dark, outline, outlineDark, ghost, light, whatsapp — no sheen/glow effects), `SectionHeading` / `Eyebrow` (`tone="dark"` on dark), `Container`, `Reveal*`, `ImageWithFallback` (`tone`), `CarCard` (`tone`; its Book Now is dark/white and turns red only on hover), `TiltCard`, `Field` / `inputClasses`, `TripPlanner` (`variant="search" | "panel"`), `RentButton`, `CATEGORY_META`, `buildWhatsAppUrl` / `buildTripWhatsAppUrl`.

## Layout

`Container` (max 1320px). Sections `py-20 sm:py-28`. Floating panels overlap dark→light seams with negative margins — add `flow-root` to the parent so the margin doesn't collapse. Sticky columns need ancestors with `overflow-clip`, not `overflow-hidden`. Must work from 320px; touch targets ≥ 44px.

## Honesty rules

No fake ratings, testimonials, stats, discounts, availability or payments. Booking = WhatsApp enquiry; prices show "Price on inquiry" until `pricePerDay` is set (price filters/sorts appear automatically then).
