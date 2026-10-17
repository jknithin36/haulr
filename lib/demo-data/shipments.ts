import { city, type Place } from "@/lib/demo-data/places";

export const shipmentCategories = [
  { value: "car", label: "Cars", badge: "Car" },
  { value: "furniture", label: "Furniture", badge: "Furniture" },
  { value: "heavy", label: "Heavy items", badge: "Heavy item" },
  { value: "freight", label: "Freight", badge: "Freight" },
] as const;

export type ShipmentCategory = (typeof shipmentCategories)[number]["value"];

export type Shipment = {
  id: string;
  category: ShipmentCategory;
  item: string;
  from: Place;
  to: Place;
  miles: number;
  /** Pickup window as ISO dates (yyyy-mm-dd). */
  pickupFrom: string;
  pickupTo: string;
  budget: number;
  offers: number;
  lowestOffer?: number;
  closesInMs: number;
  postedHoursAgo: number;
  verifiedShipper: boolean;
};

const HOUR = 60 * 60 * 1000;

export const shipments: Shipment[] = [
  {
    id: "civic",
    category: "car",
    item: "2019 Honda Civic",
    from: city.losAngeles,
    to: city.newYork,
    miles: 2790,
    pickupFrom: "2026-10-20",
    pickupTo: "2026-10-22",
    budget: 1200,
    offers: 7,
    lowestOffer: 980,
    closesInMs: 28 * HOUR,
    postedHoursAgo: 3,
    verifiedShipper: true,
  },
  {
    id: "sofa",
    category: "furniture",
    item: "3-seat sectional sofa",
    from: city.austin,
    to: city.denver,
    miles: 920,
    pickupFrom: "2026-10-19",
    pickupTo: "2026-10-20",
    budget: 450,
    offers: 4,
    lowestOffer: 380,
    closesInMs: 6 * HOUR,
    postedHoursAgo: 42,
    verifiedShipper: true,
  },
  {
    id: "piano",
    category: "heavy",
    item: "Upright piano",
    from: city.chicago,
    to: city.atlanta,
    miles: 715,
    pickupFrom: "2026-10-23",
    pickupTo: "2026-10-25",
    budget: 900,
    offers: 3,
    lowestOffer: 820,
    closesInMs: 48 * HOUR,
    postedHoursAgo: 6,
    verifiedShipper: false,
  },
  {
    id: "pallets",
    category: "freight",
    item: "2 pallets of boxes",
    from: city.seattle,
    to: city.phoenix,
    miles: 1420,
    pickupFrom: "2026-10-21",
    pickupTo: "2026-10-22",
    budget: 600,
    offers: 9,
    lowestOffer: 540,
    closesInMs: 18 * HOUR,
    postedHoursAgo: 30,
    verifiedShipper: true,
  },
  {
    id: "model-y",
    category: "car",
    item: "2022 Tesla Model Y",
    from: city.sanFrancisco,
    to: city.austin,
    miles: 1770,
    pickupFrom: "2026-10-24",
    pickupTo: "2026-10-27",
    budget: 1050,
    offers: 11,
    lowestOffer: 890,
    closesInMs: 72 * HOUR,
    postedHoursAgo: 3,
    verifiedShipper: true,
  },
  {
    id: "bed",
    category: "furniture",
    item: "King bed and dresser",
    from: city.miami,
    to: city.charlotte,
    miles: 730,
    pickupFrom: "2026-10-18",
    pickupTo: "2026-10-19",
    budget: 520,
    offers: 2,
    lowestOffer: 470,
    closesInMs: 24 * HOUR,
    postedHoursAgo: 12,
    verifiedShipper: false,
  },
  {
    id: "pool-table",
    category: "heavy",
    item: "Pool table",
    from: city.denver,
    to: city.saltLakeCity,
    miles: 520,
    pickupFrom: "2026-10-28",
    pickupTo: "2026-10-30",
    budget: 700,
    offers: 0,
    closesInMs: 96 * HOUR,
    postedHoursAgo: 1,
    verifiedShipper: true,
  },
  {
    id: "sportster",
    category: "car",
    item: "Harley-Davidson Sportster",
    from: city.nashville,
    to: city.phoenix,
    miles: 1690,
    pickupFrom: "2026-10-19",
    pickupTo: "2026-10-21",
    budget: 650,
    offers: 5,
    lowestOffer: 590,
    closesInMs: 12 * HOUR,
    postedHoursAgo: 26,
    verifiedShipper: false,
  },
];

export function categoryBadge(category: ShipmentCategory) {
  return shipmentCategories.find((c) => c.value === category)?.badge ?? "";
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function parseDay(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

/** "Oct 20 – Oct 22", or a single date when the window is one day. */
export function formatPickup(s: Pick<Shipment, "pickupFrom" | "pickupTo">) {
  const from = shortDate.format(parseDay(s.pickupFrom));
  const to = shortDate.format(parseDay(s.pickupTo));
  return from === to ? from : `${from} – ${to}`;
}
