export type CarCategory = "SUV" | "Sedan" | "Hatchback" | "MPV" | "Luxury";
export type Transmission = "Manual" | "Automatic" | "Manual / Automatic";
export type FuelType = "Petrol" | "Diesel" | "Petrol / Diesel" | "Hybrid" | "Electric";
export type ImageAngle = "front" | "side" | "rear" | "interior" | "dashboard" | "detail";

export interface CarImage {
  /** Path under /public, e.g. /cars/hyundai-creta/front.jpg */
  src: string;
  alt: string;
  angle: ImageAngle;
  width: number;
  height: number;
  /** Optional CSS object-position to keep the car centred when cropped, e.g. "50% 60%" */
  focus?: string;
}

export interface Car3DModel {
  /** Path under /public, e.g. /models/sample-car.glb */
  src: string;
  /** Uniform scale applied after auto-centering (default 1). */
  scale?: number;
  /** Initial camera position [x, y, z]. */
  cameraPosition?: [number, number, number];
  /** True when the model is a stand-in rather than this exact vehicle. Shows a disclosure note. */
  isRepresentative?: boolean;
  /** Attribution text shown in the viewer. */
  credit?: string;
}

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  category: CarCategory;
  /** Display label, e.g. "Premium SUV" */
  categoryLabel: string;
  shortDescription: string;
  longDescription: string[];
  /** Rental price per day in INR. Leave undefined to show "Price on inquiry". */
  pricePerDay?: number;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  luggage: string;
  airConditioning: string;
  features: string[];
  images: CarImage[];
  model3d?: Car3DModel;
  featured?: boolean;
}
