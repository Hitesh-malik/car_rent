# Roy Rentals — premium car rental showroom

Frontend-only Next.js 16 site in a Black + Racing-Red design system: cinematic 3D hero, an explore page with filters, a dark car showroom with photo gallery and interactive 3D viewer, and a trip planner that sends dates and locations as a WhatsApp enquiry. No backend, accounts, or payments.

Pages: `/` (home), `/cars` (explore + filters, supports `?category=SUV`), `/cars/[slug]` (car showroom), `/credits`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start   # production
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://royrentals.in`) in production so canonical URLs, the sitemap, and Open Graph tags use your domain.

## Where to change things

| What | File |
| --- | --- |
| Brand name, WhatsApp number, phone/email/address, nav | `src/config/site.ts` |
| Cars (specs, descriptions, prices, images, 3D model) | `src/data/cars.ts` |
| Hero car | `HERO_CAR_SLUG` in `src/data/cars.ts` |
| Colours, radii, shadows, animations | `src/app/globals.css` (`@theme`) |
| Category names / blurbs | `src/lib/categories.ts` |
| FAQ answers | `src/components/home/FaqSection.tsx` |
| Footer social links | `social` in `src/config/site.ts` |
| Photo credits | `src/data/image-credits.json` (shown at `/credits`) |

- **Prices:** leave `pricePerDay` undefined to show "Price on inquiry", or set a number (₹/day). Once any car has a price, the explore page adds price sorting and a max-price slider, and the car page trip planner shows an estimated total.
- **Photos:** put files in `public/cars/<slug>/` and list them in the car's `images` (first image = card and hero image).
- **3D models:** see `.claude/skills/car-3d-viewer/SKILL.md`. Optimise GLBs with `gltf-transform` and add `model3d` to the car. Cars without a model show a "3D preview not yet available" state.

## Stack

Next.js 16 (App Router, Cache Components, static generation) · TypeScript · Tailwind CSS v4 · Motion (`motion/react`, lazy-loaded) · React View Transitions · React Three Fiber + drei (loaded only when a 3D view is opened) · lucide-react · Manrope + Inter via `next/font`.

## Placeholder content

The seven cars, their specs, and the contact details are placeholders. Vehicle photos come from Wikimedia Commons under CC licences (see `/credits`). The 3D model is Khronos's CC BY 4.0 "Car Concept" sample, shown on the C-Class page and labelled as a representative sample model.
