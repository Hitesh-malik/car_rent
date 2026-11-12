import type { Car, CarImage } from "@/types/car";

export type ViewMode = "exterior" | "interior";

export interface StudioView {
  image: CarImage;
  /** Perspective label derived from the photo's angle + alt text, e.g. "Front ¾". */
  label: string;
  mode: ViewMode;
  /** Turntable order: front ¾ → front → side → rear ¾ → rear, then cabin views. */
  order: number;
}

/**
 * Builds the showroom perspectives from a car's real photographs.
 * Labels come from the recorded angle and alt text — nothing is assumed beyond what the photo shows.
 */
export function studioViews(car: Car): StudioView[] {
  const views = car.images.map((image): StudioView => {
    const alt = image.alt.toLowerCase();
    const threeQuarter = alt.includes("three-quarter");
    switch (image.angle) {
      case "front":
        return { image, mode: "exterior", label: threeQuarter ? "Front ¾" : "Front", order: threeQuarter ? 0 : 1 };
      case "side":
        return { image, mode: "exterior", label: "Side", order: 2 };
      case "rear":
        return { image, mode: "exterior", label: threeQuarter ? "Rear ¾" : "Rear", order: threeQuarter ? 3 : 4 };
      case "detail":
        return { image, mode: "exterior", label: "Detail", order: 5 };
      case "dashboard":
        return { image, mode: "interior", label: "Dashboard", order: 11 };
      case "interior":
      default:
        return { image, mode: "interior", label: "Cabin", order: 10 };
    }
  });
  views.sort((a, b) => a.order - b.order);

  // Disambiguate repeated labels (e.g. two front photos of different colours).
  const seen = new Map<string, number>();
  for (const v of views) {
    const n = (seen.get(v.label) ?? 0) + 1;
    seen.set(v.label, n);
    if (n > 1) v.label = `${v.label} · ${n}`;
  }
  return views;
}

/** Highlight copy for each perspective, built only from the car's own data. */
export function viewHighlight(view: StudioView, car: Car): { title: string; body: string } {
  switch (view.image.angle) {
    case "front":
      return view.label.startsWith("Front ¾")
        ? { title: "Exterior design", body: car.shortDescription }
        : { title: "Face & stance", body: `${car.brand} ${car.model} · ${car.categoryLabel}` };
    case "side":
      return { title: "Profile & proportions", body: `${car.categoryLabel} · ${car.seats} seats` };
    case "rear":
      return view.label.startsWith("Rear ¾")
        ? { title: "Rear & luggage", body: `Luggage space: ${car.luggage}` }
        : { title: "Rear view", body: `${car.brand} ${car.model} · ${car.categoryLabel}` };
    case "interior":
      return { title: "Cabin & comfort", body: `${car.seats} seats · ${car.airConditioning}` };
    case "dashboard":
      return { title: "Dashboard & tech", body: car.features.slice(0, 2).join(" · ") };
    default:
      return { title: view.label, body: view.image.alt };
  }
}
