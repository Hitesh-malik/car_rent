---
name: automotive-ui
description: Visual design standards for the Roy Rentals car showroom (Next.js + Tailwind v4). Use when creating or changing any page, section, card, button, layout or responsive behaviour in this project, so new UI matches the premium white automotive design system instead of drifting toward a generic template.
---

# Automotive UI standards

The site should feel like a calm, premium showroom: white canvas, charcoal type, silver-grey surfaces, one restrained blue accent. The car photography is the hero; the UI frames it.

## Tokens (defined in `src/app/globals.css` `@theme` — never hard-code hex values in components)

| Token | Use |
| --- | --- |
| `canvas` #FFFFFF | page background |
| `mist` #F7F8FA | alternating section background, footer |
| `surface` #F2F4F7 | image frames, skeleton base, card media |
| `ink` / `ink-soft` | primary text, dark buttons, CTA band |
| `muted` #737983 | secondary text, meta, inactive controls |
| `line` #E7E9ED | every border and divider |
| `accent` #2563EB | primary CTA, active indicators, focus ring — sparingly |
| `whatsapp` | hover state of WhatsApp buttons only |

Radii: `--radius-card` (cards), `--radius-panel` (galleries, large panels), `rounded-full` (buttons, pills, chips). Shadows: `--shadow-soft` (resting floating UI), `--shadow-lift` (hovered cards, menus). No other shadows.

## Typography (Manrope via `next/font`, variable `--font-manrope`)

- Display/H1: `font-semibold`, tracking `-0.045em`, leading `~1.0`. H2: `text-3xl → lg:text-[3.25rem]`, tracking `-0.035em`.
- Eyebrows: the `<Eyebrow>` component (12px uppercase, `tracking-[0.18em]`, accent rule). Do not invent other all-caps styles.
- Body: `text-muted`, `leading-relaxed`, `text-pretty`; headings `text-balance`.
- One `<h1>` per page. Sections use `<h2>` via `SectionHeading`; cards use `<h3>`.

## Layout

- Wrap content in `<Container>` (max 1320px, gutters `px-4 sm:px-8 lg:px-10`). Section rhythm: `py-20 sm:py-28`.
- Grids: fleet `1 → sm:2 → xl:3` columns; detail page `lg` 60/40 split with the showcase sticky.
- Must work from 320px wide: no fixed widths wider than the viewport, horizontal scrollers get `no-scrollbar` and negative-margin bleed, touch targets ≥ 44px (`size-11`, `h-11`).

## Components to reuse (don't re-implement)

- `ButtonLink` / `buttonClasses` (variants: primary, dark, outline, ghost, light, whatsapp) with `ArrowNudge`.
- `SectionHeading`, `Eyebrow`, `Container`, `Reveal` / `RevealGroup` / `RevealItem`.
- `ImageWithFallback` for any non-hero photo (skeleton + missing-image state).
- `CarCard` for every car listing (home grid, similar cars).
- `buildWhatsAppUrl(car)` from `src/lib/whatsapp.ts` for every enquiry link; config lives in `src/config/site.ts`.

## Imagery

- Car photos sit in `surface` frames with `object-cover` and a per-image `focus` (object-position) from `src/data/cars.ts` so the car is never cropped off.
- New photos go in `public/cars/<slug>/` and must be added to `src/data/image-credits.json` if they need attribution.

## Avoid

Gradients beyond a soft mist→white wash, glassmorphism outside small overlay chips, heavy shadows, decorative blobs, fake ratings/stats/testimonials, more than one accent colour.
