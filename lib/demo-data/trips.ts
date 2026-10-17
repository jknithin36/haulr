import { city, type Place, roadMiles } from "@/lib/demo-data/places";
import { formatNumber, formatUsd } from "@/lib/format";

/* ------------------------------ Options ----------------------------- */

export const vehicleTypes = [
  { value: "car-carrier", label: "Open car carrier" },
  { value: "enclosed", label: "Enclosed trailer" },
  { value: "box", label: "Box truck" },
  { value: "flatbed", label: "Flatbed" },
  { value: "van", label: "Cargo van" },
] as const;

export type VehicleType = (typeof vehicleTypes)[number]["value"];

export const cargoTypes = [
  { value: "cars", label: "Cars", item: "Car" },
  { value: "furniture", label: "Furniture", item: "Furniture" },
  { value: "heavy", label: "Heavy items", item: "Heavy item" },
  { value: "pallets", label: "Pallets", item: "Pallets" },
] as const;

export type CargoType = (typeof cargoTypes)[number]["value"];

/** How a trip sells its space: by car spot, by cubic foot, or by pallet. */
type SpaceUnit = "car" | "cuft" | "pallet";

/* ------------------------------- Types ------------------------------ */

export type TripStop = {
  place: Place;
  /** ISO date (yyyy-mm-dd). */
  date: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
};

export type Trip = {
  id: string;
  driver: string;
  /** For copy like “until he accepts”. */
  pronoun: "he" | "she";
  rating: number;
  verified: boolean;
  /** Trips the driver has completed on Haulr. */
  completedTrips: number;
  memberSince: number;
  repliesWithin: string;
  vehicle: VehicleType;
  carries: CargoType[];
  /** First stop is the departure, last is the arrival. */
  stops: TripStop[];
  miles: number;
  unit: SpaceUnit;
  capacity: number;
  left: number;
  /** Price per unit (per car, per cu ft, or per pallet) for the full route. */
  price: number;
  about: { headline: string; canCarry: string; insurance: string };
  notes: string;
  reviews: Review[];
};

/* ------------------------------ Places ------------------------------ */

// Stops along the way that aren't in the shared city list.
const stop = {
  stLouis: { code: "STL", label: "St. Louis, MO", lat: 38.627, lng: -90.1994 },
  sacramento: {
    code: "SAC",
    label: "Sacramento, CA",
    lat: 38.5816,
    lng: -121.4944,
  },
  kansasCity: {
    code: "KC",
    label: "Kansas City, MO",
    lat: 39.0997,
    lng: -94.5786,
  },
  sanAntonio: {
    code: "SAT",
    label: "San Antonio, TX",
    lat: 29.4241,
    lng: -98.4936,
  },
  elPaso: { code: "ELP", label: "El Paso, TX", lat: 31.7619, lng: -106.485 },
} satisfies Record<string, Place>;

/* ------------------------------- Data ------------------------------- */

export const trips: Trip[] = [
  {
    id: "mike",
    driver: "Mike R.",
    pronoun: "he",
    rating: 4.9,
    verified: true,
    completedTrips: 142,
    memberSince: 2023,
    repliesWithin: "2 hours",
    vehicle: "car-carrier",
    carries: ["cars"],
    stops: [
      { place: city.miami, date: "2026-10-22" },
      { place: city.atlanta, date: "2026-10-23" },
      { place: city.charlotte, date: "2026-10-24" },
      { place: city.boston, date: "2026-10-26" },
    ],
    miles: 1500,
    unit: "car",
    capacity: 7,
    left: 3,
    price: 780,
    about: {
      headline: "7-car open carrier · Max weight per car: 6,000 lb",
      canCarry: "sedans, SUVs, pickups",
      insurance: "up to $250,000 cargo coverage",
    },
    notes:
      "No vehicles that don’t run. Pickup within 20 miles of the route. I’ll call the day before.",
    reviews: [
      {
        id: "r1",
        author: "Elena G.",
        rating: 5,
        text: "Mike kept me updated the whole trip. Car arrived spotless.",
      },
      {
        id: "r2",
        author: "Tom B.",
        rating: 5,
        text: "Easy to book and right on time.",
      },
    ],
  },
  {
    id: "james",
    driver: "James T.",
    pronoun: "he",
    rating: 4.8,
    verified: true,
    completedTrips: 87,
    memberSince: 2022,
    repliesWithin: "3 hours",
    vehicle: "box",
    carries: ["furniture", "heavy", "pallets"],
    stops: [
      { place: city.dallas, date: "2026-10-20" },
      { place: stop.stLouis, date: "2026-10-21" },
      { place: city.chicago, date: "2026-10-22" },
    ],
    miles: 970,
    unit: "cuft",
    capacity: 1600,
    left: 400,
    price: 1.1,
    about: {
      headline: "26 ft box truck with liftgate · Max load: 8,000 lb",
      canCarry: "furniture, appliances, boxed items, pallets",
      insurance: "up to $100,000 cargo coverage",
    },
    notes:
      "Everything needs to be boxed or wrapped. I bring blankets and straps. Liftgate for the heavy stuff.",
    reviews: [
      {
        id: "r1",
        author: "Priya S.",
        rating: 5,
        text: "Wrapped every piece of furniture before loading. Nothing scratched.",
      },
      {
        id: "r2",
        author: "Dan K.",
        rating: 5,
        text: "Showed up when he said he would.",
      },
    ],
  },
  {
    id: "ana",
    driver: "Ana P.",
    pronoun: "she",
    rating: 5.0,
    verified: true,
    completedTrips: 34,
    memberSince: 2024,
    repliesWithin: "1 hour",
    vehicle: "van",
    carries: ["furniture"],
    stops: [
      { place: city.sanDiego, date: "2026-10-24" },
      { place: city.losAngeles, date: "2026-10-24" },
      { place: stop.sacramento, date: "2026-10-25" },
      { place: city.portland, date: "2026-10-26" },
    ],
    miles: 1090,
    unit: "cuft",
    capacity: 300,
    left: 120,
    price: 1.4,
    about: {
      headline: "High-roof cargo van · Max load: 3,500 lb",
      canCarry: "small furniture, boxes, bikes",
      insurance: "up to $25,000 cargo coverage",
    },
    notes:
      "Small loads only, nothing over 6 feet long. Ground-floor pickups are easiest.",
    reviews: [
      {
        id: "r1",
        author: "Marcus L.",
        rating: 5,
        text: "Friendly, careful, and sent photos at every stop.",
      },
    ],
  },
  {
    id: "chris",
    driver: "Chris W.",
    pronoun: "he",
    rating: 4.7,
    verified: false,
    completedTrips: 21,
    memberSince: 2025,
    repliesWithin: "4 hours",
    vehicle: "enclosed",
    carries: ["cars"],
    stops: [
      { place: city.atlanta, date: "2026-10-25" },
      { place: city.nashville, date: "2026-10-25" },
      { place: stop.kansasCity, date: "2026-10-27" },
      { place: city.denver, date: "2026-10-28" },
    ],
    miles: 1410,
    unit: "car",
    capacity: 2,
    left: 1,
    price: 1100,
    about: {
      headline: "2-car enclosed trailer · Max weight per car: 5,500 lb",
      canCarry: "classic cars, sports cars, sedans",
      insurance: "up to $500,000 cargo coverage",
    },
    notes:
      "Enclosed and soft-strapped, so it’s good for classics and low cars. Please share the ground clearance when you book.",
    reviews: [
      {
        id: "r1",
        author: "Rob H.",
        rating: 5,
        text: "My Mustang came off the trailer clean. Would book again.",
      },
    ],
  },
  {
    id: "luis",
    driver: "Luis M.",
    pronoun: "he",
    rating: 4.9,
    verified: true,
    completedTrips: 118,
    memberSince: 2023,
    repliesWithin: "2 hours",
    vehicle: "flatbed",
    carries: ["heavy", "pallets"],
    stops: [
      { place: city.houston, date: "2026-10-21" },
      { place: stop.sanAntonio, date: "2026-10-21" },
      { place: stop.elPaso, date: "2026-10-22" },
      { place: city.phoenix, date: "2026-10-23" },
    ],
    miles: 1180,
    unit: "pallet",
    capacity: 6,
    left: 2,
    price: 180,
    about: {
      headline: "48 ft flatbed · Max weight per pallet: 2,500 lb",
      canCarry: "pallets, machinery, building materials",
      insurance: "up to $100,000 cargo coverage",
    },
    notes:
      "Forklift needed at pickup and dropoff. I tarp everything, so tell me if it can’t get wet.",
    reviews: [
      {
        id: "r1",
        author: "Kelly N.",
        rating: 5,
        text: "Tarped and strapped our pallets properly. Delivered a day early.",
      },
    ],
  },
];

/* ------------------------------ Helpers ----------------------------- */

export function origin(trip: Trip) {
  return trip.stops[0];
}

export function destination(trip: Trip) {
  return trip.stops[trip.stops.length - 1];
}

/** The stops between departure and arrival. */
export function midStops(trip: Trip) {
  return trip.stops.slice(1, -1);
}

/** "Stops: Atlanta, Charlotte" or "Direct, no stops". */
export function stopsText(trip: Trip) {
  const stops = midStops(trip);
  return stops.length
    ? `Stops: ${stops.map((s) => cityName(s.place)).join(", ")}`
    : "Direct, no stops";
}

export function vehicleLabel(v: VehicleType) {
  return vehicleTypes.find((t) => t.value === v)?.label ?? v;
}

/** "Atlanta" from "Atlanta, GA". */
export function cityName(p: Place) {
  return p.label.split(",")[0];
}

export function parseDay(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDay(iso: string) {
  return shortDate.format(parseDay(iso));
}

/** "Departs Oct 22 · Arrives about Oct 26" */
export function formatSchedule(trip: Trip) {
  return `Departs ${formatDay(origin(trip).date)} · Arrives about ${formatDay(destination(trip).date)}`;
}

/** Whole dollars when the price is whole ("$780"), cents otherwise ("$1.10"). */
export function formatPrice(n: number) {
  return Number.isInteger(n) ? formatUsd(n) : formatUsd(n, 2);
}

const unitNames: Record<SpaceUnit, string> = {
  car: "car",
  cuft: "cu ft",
  pallet: "pallet",
};

export function unitName(u: SpaceUnit) {
  return unitNames[u];
}

/** "From $780 per car", "$1.10 per cu ft", "$180 per pallet" */
export function priceLabel(trip: Trip) {
  const base = `${formatPrice(trip.price)} per ${unitNames[trip.unit]}`;
  return trip.unit === "car" ? `From ${base}` : base;
}

/** Short price for map pins: "$780/car". */
export function pinPrice(trip: Trip) {
  return `${formatPrice(trip.price)}/${unitNames[trip.unit]}`;
}

/** "3 of 7 spots left", "400 cu ft left", "2 pallet spots left" */
export function spaceLabel(trip: Trip) {
  const { left } = trip;
  if (trip.unit === "car") return `${left} of ${trip.capacity} spots left`;
  if (trip.unit === "pallet")
    return `${left} pallet ${left === 1 ? "spot" : "spots"} left`;
  return `${formatNumber(left)} cu ft left`;
}

/** Shown as a badge in the booking panel when space is running out. */
export function scarcityLabel(trip: Trip) {
  const { left } = trip;
  if (left === 0) return null;
  if (trip.unit === "car" && left <= 3)
    return `Only ${left} ${left === 1 ? "spot" : "spots"} left`;
  if (trip.unit === "pallet" && left <= 2)
    return `Only ${left} pallet ${left === 1 ? "spot" : "spots"} left`;
  if (trip.unit === "cuft" && left <= 150) return `Only ${left} cu ft left`;
  return null;
}

/** Segments and how many are taken, for the space meter. */
export function meter(trip: Trip) {
  if (trip.unit === "cuft") {
    return {
      segments: 10,
      filled: Math.round(((trip.capacity - trip.left) / trip.capacity) * 10),
    };
  }
  return { segments: trip.capacity, filled: trip.capacity - trip.left };
}

/**
 * Typical price of one booking, used by the price filter and sort:
 * one car, one pallet, or 100 cu ft.
 */
export function typicalPrice(trip: Trip) {
  return trip.unit === "cuft" ? Math.round(trip.price * 100) : trip.price;
}

/** Share of the route's road miles between two stops (by index). */
function segmentShare(trip: Trip, from: number, to: number) {
  const legs = trip.stops
    .slice(1)
    .map((s, i) => roadMiles(trip.stops[i].place, s.place));
  const total = legs.reduce((sum, m) => sum + m, 0);
  const part = legs.slice(from, to).reduce((sum, m) => sum + m, 0);
  return total ? part / total : 1;
}

/** Live estimate for a booking from stop `from` to stop `to`. */
export function estimatePrice(
  trip: Trip,
  quantity: number,
  from: number,
  to: number,
) {
  const full = trip.price * quantity;
  if (from === 0 && to === trip.stops.length - 1) return Math.round(full);
  // Partial trips round to the nearest $5.
  return Math.max(5, Math.round((full * segmentShare(trip, from, to)) / 5) * 5);
}
