import { type Place, roadMiles } from "@/lib/demo-data/places";

/*
 * Rough pricing model for the /estimate calculator.
 *
 * This is a hand-tuned curve, not real data: replace it with prices from
 * recent accepted offers in the marketplace once we have enough of them.
 * It is calibrated so a standard sedan on an open trailer with flexible
 * dates from Los Angeles to New York (~2,800 mi) lands around $950 – $1,250
 * and 5 – 7 days.
 */

export type EstimateCategory = "car" | "furniture" | "heavy" | "freight";
export type Timing = "exact" | "week" | "flexible";

export type VehicleSize = "sedan" | "suv" | "pickup";
export type Trailer = "open" | "enclosed";
export type FurnitureLoad = "items" | "room" | "rooms" | "home";
export type Stairs = "none" | "one" | "more";
export type HeavyType = "motorcycle" | "piano" | "boat" | "machinery" | "other";
export type HeavyWeight = "under500" | "under1000" | "under5000" | "over5000";
export type Pallets = "1" | "2-3" | "4-6" | "7-12" | "full";
export type FreightWeight =
  | "under1000"
  | "under5000"
  | "under10000"
  | "over10000";

export type ItemDetails =
  | { category: "car"; size: VehicleSize; trailer: Trailer; runs: boolean }
  | { category: "furniture"; load: FurnitureLoad; stairs: Stairs }
  | { category: "heavy"; type: HeavyType; weight: HeavyWeight }
  | { category: "freight"; pallets: Pallets; weight: FreightWeight };

export type EstimateInput = {
  item: ItemDetails;
  from: Place;
  to: Place;
  timing: Timing;
};

export type Factor = { label: string; value: string };

export type Estimate = {
  low: number;
  high: number;
  transitDays: [number, number];
  miles: number;
  factors: Factor[];
  /** Typical number of offers a post like this gets. */
  offers: [number, number];
  /** Drivers with space on this route soon. */
  tripsSoon: number;
};

type Option<T extends string> = { value: T; label: string; factor: number };

export const vehicleSizes: Option<VehicleSize>[] = [
  { value: "sedan", label: "Sedan", factor: 1 },
  { value: "suv", label: "SUV", factor: 1.15 },
  { value: "pickup", label: "Pickup", factor: 1.25 },
];

export const trailers: Option<Trailer>[] = [
  { value: "open", label: "Open", factor: 1 },
  { value: "enclosed", label: "Enclosed", factor: 1.4 },
];

export const furnitureLoads: Option<FurnitureLoad>[] = [
  { value: "items", label: "1 – 3 items", factor: 0.8 },
  { value: "room", label: "One room", factor: 1.3 },
  { value: "rooms", label: "2 – 3 rooms", factor: 2 },
  { value: "home", label: "Whole home (4+ rooms)", factor: 3 },
];

export const stairOptions: Option<Stairs>[] = [
  { value: "none", label: "None", factor: 1 },
  { value: "one", label: "1 flight", factor: 1.05 },
  { value: "more", label: "2+ flights", factor: 1.1 },
];

export const heavyTypes: Option<HeavyType>[] = [
  { value: "motorcycle", label: "Motorcycle", factor: 0.75 },
  { value: "piano", label: "Piano", factor: 1.1 },
  { value: "boat", label: "Boat", factor: 1.5 },
  { value: "machinery", label: "Machinery or equipment", factor: 1.4 },
  { value: "other", label: "Something else", factor: 1 },
];

export const heavyWeights: Option<HeavyWeight>[] = [
  { value: "under500", label: "Under 500 lb", factor: 0.9 },
  { value: "under1000", label: "500 – 1,000 lb", factor: 1 },
  { value: "under5000", label: "1,000 – 5,000 lb", factor: 1.3 },
  { value: "over5000", label: "Over 5,000 lb", factor: 1.8 },
];

export const palletOptions: Option<Pallets>[] = [
  { value: "1", label: "1 pallet", factor: 0.9 },
  { value: "2-3", label: "2 – 3 pallets", factor: 1.3 },
  { value: "4-6", label: "4 – 6 pallets", factor: 1.9 },
  { value: "7-12", label: "7 – 12 pallets", factor: 2.8 },
  { value: "full", label: "Full truckload", factor: 4.2 },
];

export const freightWeights: Option<FreightWeight>[] = [
  { value: "under1000", label: "Under 1,000 lb", factor: 1 },
  { value: "under5000", label: "1,000 – 5,000 lb", factor: 1.15 },
  { value: "under10000", label: "5,000 – 10,000 lb", factor: 1.35 },
  { value: "over10000", label: "Over 10,000 lb", factor: 1.6 },
];

const timingFactor: Record<Timing, number> = {
  flexible: 1,
  week: 1.07,
  exact: 1.15,
};

const offerRange: Record<EstimateCategory, [number, number]> = {
  car: [8, 12],
  furniture: [6, 10],
  heavy: [4, 8],
  freight: [5, 9],
};

const NOT_RUNNING = 1.15;

function pick<T extends string>(options: Option<T>[], value: T) {
  const option = options.find((o) => o.value === value);
  if (!option) throw new Error(`Unknown option: ${value}`);
  return option;
}

/**
 * Midpoint price for a standard sedan, open trailer, flexible dates.
 * The exponent below 1 makes the per-mile rate taper with distance:
 * ~$1.20/mi at 300 mi, ~$0.40/mi coast to coast.
 */
function basePrice(miles: number) {
  return 200 + 2.34 * miles ** 0.75;
}

function roundPrice(n: number) {
  const step = n < 500 ? 10 : 50;
  return Math.round(n / step) * step;
}

function distanceLabel(miles: number) {
  if (miles < 500) return "short route";
  if (miles < 1500) return "medium route";
  return "long route";
}

function timingLabel(timing: Timing) {
  if (timing === "flexible") return "flexible (can save up to 15%)";
  if (timing === "week") return "within a week (flexible can save more)";
  return "exact date (flexible can save up to 15%)";
}

/** Small stable number from the route, so the same route reads the same. */
function routeSeed(from: Place, to: Place) {
  let h = 0;
  for (const ch of `${from.code}-${to.code}`)
    h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function itemFactors(item: ItemDetails): {
  multiplier: number;
  rows: Factor[];
} {
  switch (item.category) {
    case "car": {
      const size = pick(vehicleSizes, item.size);
      const trailer = pick(trailers, item.trailer);
      const sizeLabel =
        item.size === "sedan"
          ? "standard sedan"
          : item.size === "suv"
            ? "SUV (about 15% more)"
            : "pickup (about 25% more)";
      return {
        multiplier:
          size.factor * trailer.factor * (item.runs ? 1 : NOT_RUNNING),
        rows: [
          { label: "Vehicle size", value: sizeLabel },
          {
            label: "Trailer",
            value:
              item.trailer === "open"
                ? "open (enclosed costs about 40% more)"
                : "enclosed (about 40% more than open)",
          },
          {
            label: "Condition",
            value: item.runs
              ? "runs and drives"
              : "doesn’t run (needs a winch, about 15% more)",
          },
        ],
      };
    }
    case "furniture": {
      const load = pick(furnitureLoads, item.load);
      const stairs = pick(stairOptions, item.stairs);
      return {
        multiplier: load.factor * stairs.factor,
        rows: [
          { label: "Load", value: load.label.toLowerCase() },
          {
            label: "Stairs",
            value:
              item.stairs === "none"
                ? "none"
                : `${stairs.label} (adds a little for carrying)`,
          },
        ],
      };
    }
    case "heavy": {
      const type = pick(heavyTypes, item.type);
      const weight = pick(heavyWeights, item.weight);
      return {
        multiplier: type.factor * weight.factor,
        rows: [
          { label: "Item", value: type.label.toLowerCase() },
          { label: "Weight", value: weight.label.toLowerCase() },
        ],
      };
    }
    case "freight": {
      const pallets = pick(palletOptions, item.pallets);
      const weight = pick(freightWeights, item.weight);
      return {
        multiplier: pallets.factor * weight.factor,
        rows: [
          { label: "Size", value: pallets.label.toLowerCase() },
          { label: "Weight", value: weight.label.toLowerCase() },
        ],
      };
    }
  }
}

export function estimatePrice({
  item,
  from,
  to,
  timing,
}: EstimateInput): Estimate {
  const miles = roadMiles(from, to);
  const { multiplier, rows } = itemFactors(item);
  const mid = basePrice(miles) * multiplier * timingFactor[timing];

  const low = Math.max(150, roundPrice(mid * 0.87));
  const high = Math.max(low + 50, roundPrice(mid * 1.13));

  const days = miles / 450 + 1;
  const fastest = Math.max(1, Math.round(days * 0.75));
  const slowest = Math.max(fastest + 1, Math.round(days));

  return {
    low,
    high,
    transitDays: [fastest, slowest],
    miles,
    factors: [
      { label: "Distance", value: distanceLabel(miles) },
      ...rows,
      { label: "Dates", value: timingLabel(timing) },
    ],
    offers: offerRange[item.category],
    tripsSoon: 3 + (routeSeed(from, to) % 4),
  };
}
