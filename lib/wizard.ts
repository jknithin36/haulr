import { type Place, roadMiles } from "@/lib/demo-data/places";
import type { ShipmentCategory } from "@/lib/demo-data/shipments";
import { formatShortDay } from "@/lib/format";

/** Stand-in for a city that hasn't been chosen yet. */
export function placeholderPlace(label: string): Place {
  return { code: "—", label, lat: 0, lng: 0 };
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

/**
 * Rough price range for a shipment. Tuned so a running car on an open trailer
 * from LA to New York (2,790 mi) lands at $950 – $1,250.
 */
export function estimateShipment({
  category,
  miles,
  enclosed = false,
  inoperable = false,
  pallets = 1,
}: {
  category: ShipmentCategory;
  miles: number;
  enclosed?: boolean;
  inoperable?: boolean;
  pallets?: number;
}) {
  const rates: Record<ShipmentCategory, { base: number; perMile: number }> = {
    car: { base: 150, perMile: 0.34 },
    furniture: { base: 120, perMile: 0.28 },
    heavy: { base: 250, perMile: 0.4 },
    freight: { base: 120, perMile: 0.18 },
  };
  const { base, perMile } = rates[category];
  let mid = base + perMile * miles;
  if (category === "car" && enclosed) mid *= 1.35;
  if (category === "car" && inoperable) mid += 150;
  if (category === "freight") mid *= 1 + Math.max(0, pallets - 1) * 0.55;
  return {
    low: roundTo(mid * 0.87, 50),
    high: roundTo(mid * 1.13, 50),
    mid: roundTo(mid, 50),
  };
}

export type TripPricing = "spot" | "cuft" | "pallet";

export const pricingUnits: Record<
  TripPricing,
  { label: string; per: string; short: string }
> = {
  spot: { label: "Per car spot", per: "per car", short: "car" },
  cuft: { label: "Per cubic foot", per: "per cu ft", short: "cu ft" },
  pallet: { label: "Per pallet", per: "per pallet", short: "pallet" },
};

/** What similar trips charge, in the chosen pricing unit. */
export function estimateTrip(pricing: TripPricing, miles: number) {
  const d = miles || 1500;
  if (pricing === "spot") {
    const mid = 250 + 0.33 * d;
    return {
      low: roundTo(mid * 0.88, 50),
      high: roundTo(mid * 1.12, 50),
      decimals: 0,
    };
  }
  if (pricing === "cuft") {
    const mid = 0.4 + 0.0003 * d;
    return {
      low: Math.round((mid - 0.2) * 20) / 20,
      high: Math.round((mid + 0.2) * 20) / 20,
      decimals: 2,
    };
  }
  const mid = 60 + 0.05 * d;
  return {
    low: roundTo(mid * 0.85, 10),
    high: roundTo(mid * 1.15, 10),
    decimals: 0,
  };
}

/** Total road miles through every point, in order. */
export function routeMiles(points: Place[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += roadMiles(points[i - 1], points[i]);
  }
  return total;
}

/** yyyy-mm-dd for a local Date. */
export function toIso(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local-midnight Date for a yyyy-mm-dd string. */
export function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number) {
  const date = fromIso(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export function formatDay(iso: string) {
  return iso ? formatShortDay(fromIso(iso)) : "";
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the flow still works without it.
  }
}

export function clearDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore blocked storage.
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
