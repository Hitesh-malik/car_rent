---
name: automotive-ui
description: Visual design standards for the Roy Rentals car showroom (Next.js + Tailwind v4). Use when creating or changing any page, section, card, button, layout or responsive behaviour in this project, so new UI matches the premium Black + Racing-Red automotive design system instead of drifting toward a generic template.
---

# Automotive UI standards — Black + Red with warm neutrals

A calm, premium showroom: luxury black and charcoal stages, warm ivory content, warm grey and soft rose supporting surfaces, and one premium red used for meaning. The car photography is the hero. No other accent hues — no blue, cyan, purple, orange or green (WhatsApp actions use the brand's dark red).

## Proportions (guidance)

~45–50% ivory / white · ~20–25% black / charcoal · ~10% red · the rest warm grey, soft rose and neutral surfaces. Red = primary CTAs, active/selected states, prices, small lines/dots, and **one** highlighted phrase per page H1 (hero, explore, showroom, 404).

## Tokens (`src/app/globals.css` `@theme` — never hard-code hex values in components)

| Token | Value | Use |
| --- | --- | --- |
| `night` / `charcoal` / `charcoal-2` | #19191C / #252529 / #2E2E33 | dark stages, panels, raised surfaces |
| `racing` / `racing-deep` | #BD394A / #A93142 | CTA fill / hover, prices on light; `racing-deep` for red text on warm grey or rose |
| `soft-red` | #E08A96 | **any** red text or meaningful icon on dark (6.9:1) — `racing` on dark is for large headings only |
| `rose` (`red-tint`) | #F3E8E8 | icon chips, open FAQ row, chip hover |
| `mist` / `canvas` / `grey` / `surface` | #F7F5F1 / #FFF / #EAE8E4 / #EFEDE8 | ivory sections, cards, warm-grey feature band, frames |
| `ink` / `ink-soft` / `muted` / `muted-dark` | #252525 / #444 / #686868 / #D0D0D0 | text |
| `line` / `field` | #E6E3DE / #8F8A83 | decorative borders / **form-control borders** (3:1) |

Utilities: `stage-dark`, `seam-top`, `text-red-gradient` (muted, max one per page), `grid-lines`, `grain`, `skeleton` / `skeleton-dark`.
Shadows: `--shadow-soft`, `--shadow-lift` (neutral), `--shadow-btn` (primary buttons only). No red glows, red card shadows or pulsing light.

## Contrast rules (WCAG 2.2, verified)

White on `racing` 5.5:1 · `racing` on ivory 5.0:1 · `muted` on ivory 5.1:1 (4.55 on warm grey) · `soft-red` on night 6.9:1 · white text on dark ≥ `white/55` · inputs: `border-field` on light, `border-white/35` on dark.

## Section rhythm

Page tops are `stage-dark`; light sections after dark ones get `seam-top`. Home: hero (dark) → fleet (ivory) → showroom teaser (dark) → why-us (warm grey) → promo (ivory) → how it works (white) → FAQ (ivory) → footer (dark). Never stack two full dark sections.

## Typography

Manrope (`--font-display`, applied to h1–h4) + Inter (body). Only the home hero H1 is uppercase/extrabold; other H1s are bold, sentence case. H2 via `SectionHeading` (semibold, -0.035em); a second phrase may use a neutral tone (`text-muted` / `text-white/55`) instead of red. `Eyebrow` for all small-caps labels (red rule + dot). One `<h1>` per page.

## Components to reuse

`ButtonLink` / `buttonClasses` (primary = flat muted red; dark, outline, outlineDark, ghost, light, whatsapp — no sheen/glow effects), `SectionHeading` / `Eyebrow` (`tone="dark"` on dark), `Container`, `Reveal*`, `ImageWithFallback` (`tone`), `CarCard` (`tone`; its Book Now is dark/white and turns red only on hover), `TiltCard`, `Field` / `inputClasses`, `TripPlanner` (`variant="search" | "panel"`), `RentButton`, `CATEGORY_META`, `buildWhatsAppUrl` / `buildTripWhatsAppUrl`.

## Layout

`Container` (max 1320px). Sections `py-20 sm:py-28`. Floating panels overlap dark→light seams with negative margins — add `flow-root` to the parent so the margin doesn't collapse. Sticky columns need ancestors with `overflow-clip`, not `overflow-hidden`. Must work from 320px; touch targets ≥ 44px.

## Honesty rules

No fake ratings, testimonials, stats, discounts, availability or payments. Booking = WhatsApp enquiry; prices show "Price on inquiry" until `pricePerDay` is set (price filters/sorts appear automatically then).
