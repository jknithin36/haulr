import { type Place, roadMiles } from "@/lib/demo-data/places";
import type { ShipmentCategory } from "@/lib/demo-data/shipments";
import { estimateShipment } from "@/lib/wizard";

export const SHIPMENT_DRAFT_KEY = "haulr:shipment-draft";

export type LocationType = "house" | "apartment" | "business" | "storage";
export type Access = "ground" | "stairs" | "elevator";
export type Flexibility = "exact" | "few-days" | "flexible";
export type CloseWindow = "24" | "48" | "72" | "120";
export type Dims = { l: string; w: string; h: string };

export type FurnitureItem = {
  id: string;
  name: string;
  qty: number;
  size: "S" | "M" | "L" | "custom";
  dims: Dims;
};

export type ShipmentDraft = {
  step: number;
  category: ShipmentCategory | null;
  car: {
    year: string;
    make: string;
    model: string;
    vehicleType: string;
    runs: "yes" | "no" | "";
    trailer: "open" | "enclosed" | "";
  };
  furniture: { items: FurnitureItem[]; packed: "yes" | "no" | "" };
  heavy: { itemType: string; weight: string; dims: Dims; handling: string[] };
  freight: {
    pallets: number;
    weightPerPallet: string;
    dims: Dims;
    stackable: "yes" | "no" | "";
  };
  title: string;
  titleEdited: boolean;
  pickup: Place | null;
  pickupType: LocationType | "";
  pickupAccess: Access | "";
  dropoff: Place | null;
  dropoffType: LocationType | "";
  dropoffAccess: Access | "";
  pickupFrom: string;
  pickupTo: string;
  deliverBy: string;
  flexibility: Flexibility | "";
  budget: string;
  closesIn: CloseWindow;
  visibility: "everyone" | "me";
  notes: string;
};

const emptyDims: Dims = { l: "", w: "", h: "" };

export const emptyShipmentDraft: ShipmentDraft = {
  step: 1,
  category: null,
  car: {
    year: "",
    make: "",
    model: "",
    vehicleType: "",
    runs: "",
    trailer: "",
  },
  furniture: {
    items: [{ id: "item-1", name: "", qty: 1, size: "M", dims: emptyDims }],
    packed: "",
  },
  heavy: { itemType: "", weight: "", dims: emptyDims, handling: [] },
  freight: { pallets: 1, weightPerPallet: "", dims: emptyDims, stackable: "" },
  title: "",
  titleEdited: false,
  pickup: null,
  pickupType: "",
  pickupAccess: "",
  dropoff: null,
  dropoffType: "",
  dropoffAccess: "",
  pickupFrom: "",
  pickupTo: "",
  deliverBy: "",
  flexibility: "",
  budget: "",
  closesIn: "48",
  visibility: "everyone",
  notes: "",
};

/** Title built from the item details, e.g. "2019 Honda Civic". */
export function autoTitle(d: ShipmentDraft) {
  switch (d.category) {
    case "car":
      return [d.car.year, d.car.make.trim(), d.car.model.trim()]
        .filter(Boolean)
        .join(" ");
    case "furniture": {
      const named = d.furniture.items.filter((i) => i.name.trim());
      if (!named.length) return "";
      const first = named[0];
      const lead =
        first.qty > 1
          ? `${first.qty} × ${first.name.trim()}`
          : first.name.trim();
      return named.length > 1 ? `${lead} and ${named.length - 1} more` : lead;
    }
    case "heavy":
      return d.heavy.itemType;
    case "freight":
      return `${d.freight.pallets} ${d.freight.pallets === 1 ? "pallet" : "pallets"} of freight`;
    default:
      return "";
  }
}

export function draftTitle(d: ShipmentDraft) {
  return d.titleEdited ? d.title : autoTitle(d);
}

export function draftMiles(d: ShipmentDraft) {
  return d.pickup && d.dropoff ? roadMiles(d.pickup, d.dropoff) : 0;
}

export function draftEstimate(d: ShipmentDraft) {
  const miles = draftMiles(d);
  if (!d.category || !miles) return null;
  return estimateShipment({
    category: d.category,
    miles,
    enclosed: d.car.trailer === "enclosed",
    inoperable: d.car.runs === "no",
    pallets: d.freight.pallets,
  });
}

export const needsAccess = (d: ShipmentDraft) =>
  d.category === "furniture" || d.category === "heavy";

/** Oldest vehicle year accepted, and the newest (this year). */
export const MIN_CAR_YEAR = 1960;
export const MAX_CAR_YEAR = new Date().getFullYear();

export function isValidCarYear(year: string) {
  if (!/^\d{4}$/.test(year)) return false;
  const n = Number(year);
  return n >= MIN_CAR_YEAR && n <= MAX_CAR_YEAR;
}

/** Whether the given step has everything it needs to continue. */
export function shipmentStepValid(d: ShipmentDraft, step: number) {
  switch (step) {
    case 1:
      return !!d.category;
    case 2: {
      if (!draftTitle(d).trim()) return false;
      if (d.category === "car") {
        const c = d.car;
        return !!(
          isValidCarYear(c.year) &&
          c.make.trim() &&
          c.model.trim() &&
          c.vehicleType &&
          c.runs &&
          c.trailer
        );
      }
      if (d.category === "furniture") {
        return (
          d.furniture.items.some((i) => i.name.trim()) && !!d.furniture.packed
        );
      }
      if (d.category === "heavy") {
        return !!(d.heavy.itemType && d.heavy.weight);
      }
      if (d.category === "freight") {
        return !!(
          d.freight.pallets > 0 &&
          d.freight.weightPerPallet &&
          d.freight.stackable
        );
      }
      return false;
    }
    case 3:
      return !!(
        d.pickup &&
        d.dropoff &&
        d.pickup.code !== d.dropoff.code &&
        d.pickupType &&
        d.dropoffType &&
        (!needsAccess(d) || (d.pickupAccess && d.dropoffAccess))
      );
    case 4:
      return !!(d.pickupFrom && d.pickupTo && d.deliverBy && d.flexibility);
    default:
      return true;
  }
}
