import type { Place } from "@/lib/demo-data/places";
import { formatNumber } from "@/lib/format";
import { routeMiles, type TripPricing } from "@/lib/wizard";

export const TRIP_DRAFT_KEY = "haulr:trip-draft";

export type VehicleKind = "carrier" | "truck" | "van" | "trailer";

export const vehicleKinds: { value: VehicleKind; label: string }[] = [
  { value: "carrier", label: "Car carrier" },
  { value: "truck", label: "Box truck" },
  { value: "van", label: "Cargo van" },
  { value: "trailer", label: "Trailer" },
];

export const kindLabel = (kind: VehicleKind) =>
  vehicleKinds.find((k) => k.value === kind)?.label ?? "";

export type Vehicle = {
  id: string;
  kind: VehicleKind;
  name: string;
  /** Spots for carriers, cubic feet for everything else. */
  capacity?: number;
  detail?: string;
};

/** Demo garage for the signed-in driver. */
const sampleVehicles: Vehicle[] = [
  {
    id: "carrier-7",
    kind: "carrier",
    name: "7-car open carrier",
    capacity: 7,
    detail: "Open car carrier · 7 spots",
  },
  {
    id: "box-26",
    kind: "truck",
    name: "26 ft box truck",
    capacity: 1700,
    detail: "Box truck · 1,700 cu ft",
  },
  {
    id: "cargo-van",
    kind: "van",
    name: "Cargo van",
    capacity: 280,
    detail: "Cargo van · 280 cu ft",
  },
];

export type Carry = "cars" | "furniture" | "heavy" | "pallets";
type TimeOfDay = "morning" | "afternoon" | "evening";

export const timesOfDay: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

/** A stop the driver is adding; place and timing are blank until filled in. */
type DraftStop = {
  id: string;
  place: Place | null;
  date: string;
  time: TimeOfDay | "";
};

export type TripDraft = {
  step: number;
  addedVehicles: Vehicle[];
  vehicleId: string;
  start: Place | null;
  end: Place | null;
  stops: DraftStop[];
  detour: "10" | "25" | "50";
  departure: string;
  arrival: string;
  spots: number;
  spaceUnit: "cuft" | "pallets";
  cuft: string;
  pallets: number;
  carries: Carry[];
  pricing: TripPricing;
  price: string;
  notes: string;
};

export const emptyTripDraft: TripDraft = {
  step: 1,
  addedVehicles: [],
  vehicleId: "",
  start: null,
  end: null,
  stops: [],
  detour: "25",
  departure: "",
  arrival: "",
  spots: 3,
  spaceUnit: "cuft",
  cuft: "",
  pallets: 4,
  carries: [],
  pricing: "spot",
  price: "",
  notes: "",
};

export function allVehicles(d: TripDraft) {
  return [...sampleVehicles, ...d.addedVehicles];
}

export function currentVehicle(d: TripDraft) {
  return allVehicles(d).find((v) => v.id === d.vehicleId) ?? null;
}

export const isCarrier = (d: TripDraft) =>
  currentVehicle(d)?.kind === "carrier";

/** Sensible space, cargo and pricing defaults for a newly chosen vehicle. */
export function vehicleDefaults(v: Vehicle, d: TripDraft): Partial<TripDraft> {
  if (d.vehicleId === v.id) return {};
  const next = defaultsFor(v);
  // A price only makes sense in the unit it was set in.
  return next.pricing === d.pricing ? next : { ...next, price: "" };
}

function defaultsFor(v: Vehicle): Partial<TripDraft> {
  return v.kind === "carrier"
    ? {
        vehicleId: v.id,
        spots: v.capacity ? Math.min(v.capacity, 3) : 2,
        carries: ["cars"],
        pricing: "spot",
      }
    : {
        vehicleId: v.id,
        spaceUnit: "cuft",
        cuft: v.capacity ? String(Math.round(v.capacity * 0.4)) : "",
        carries: ["furniture", "heavy", "pallets"],
        pricing: "cuft",
      };
}

export function tripPoints(d: TripDraft) {
  return [d.start, ...d.stops.map((s) => s.place), d.end].filter(
    (p): p is Place => !!p,
  );
}

export function tripMiles(d: TripDraft) {
  return d.start && d.end ? routeMiles(tripPoints(d)) : 0;
}

export function tripStepValid(d: TripDraft, step: number) {
  switch (step) {
    case 1:
      return !!currentVehicle(d);
    case 2:
      return !!(
        d.start &&
        d.end &&
        d.start.code !== d.end.code &&
        d.stops.every((s) => s.place)
      );
    case 3:
      return !!(
        d.departure &&
        d.arrival &&
        d.stops.every((s) => s.date && s.time)
      );
    case 4:
      if (!d.carries.length) return false;
      if (isCarrier(d)) return d.spots > 0;
      return d.spaceUnit === "cuft" ? Number(d.cuft) > 0 : d.pallets > 0;
    case 5:
      return Number(d.price) > 0;
    default:
      return true;
  }
}

/** Total spots on the carrier, never fewer than the open ones. */
export function carrierCapacity(d: TripDraft) {
  return Math.max(currentVehicle(d)?.capacity ?? d.spots, d.spots);
}

/** "3 of 7 spots left", "680 cu ft left", "4 pallets left". */
export function spaceLabel(d: TripDraft) {
  if (isCarrier(d)) return `${d.spots} of ${carrierCapacity(d)} spots left`;
  if (d.spaceUnit === "pallets")
    return `${d.pallets} ${d.pallets === 1 ? "pallet" : "pallets"} left`;
  return d.cuft
    ? `${formatNumber(Number(d.cuft))} cu ft left`
    : "Space to share";
}
