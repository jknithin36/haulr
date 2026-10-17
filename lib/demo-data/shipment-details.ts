import type { Shipment } from "@/lib/demo-data/shipments";

export type Shipper = {
  id: string;
  name: string;
  rating: number;
  shipments: number;
  memberSince: number;
  verifiedPhone: boolean;
  verifiedEmail: boolean;
};

export type Offer = {
  id: string;
  driver: string;
  rating: number;
  jobs: number;
  vehicle: string;
  price: number;
  deliverBy: string;
  sentHoursAgo: number;
};

export type Question = {
  id: string;
  question: string;
  askedBy: string;
  answer?: string;
};

export type ShipmentDetail = {
  pickupZip: string;
  dropoffZip: string;
  deliverBy: string;
  views: number;
  fields: { label: string; value: string }[];
  notes?: string;
  shipper: Shipper;
  questions: Question[];
  /** Real listing photos. Empty until shippers upload them. */
  photos: { src: string; alt: string }[];
  status: "open" | "closed" | "booked";
};

const shippers = {
  sarah: {
    id: "sarah",
    name: "Sarah M.",
    rating: 4.9,
    shipments: 12,
    memberSince: 2024,
    verifiedPhone: true,
    verifiedEmail: true,
  },
  priya: {
    id: "priya",
    name: "Priya K.",
    rating: 4.8,
    shipments: 5,
    memberSince: 2025,
    verifiedPhone: true,
    verifiedEmail: true,
  },
  elena: {
    id: "elena",
    name: "Elena G.",
    rating: 5.0,
    shipments: 3,
    memberSince: 2025,
    verifiedPhone: false,
    verifiedEmail: true,
  },
  david: {
    id: "david",
    name: "David L.",
    rating: 4.9,
    shipments: 48,
    memberSince: 2023,
    verifiedPhone: true,
    verifiedEmail: true,
  },
} satisfies Record<string, Shipper>;

const details: Record<string, ShipmentDetail> = {
  civic: {
    pickupZip: "90015",
    dropoffZip: "10001",
    deliverBy: "Oct 29",
    views: 128,
    fields: [
      { label: "Year, make, model", value: "2019 Honda Civic LX" },
      { label: "Condition", value: "Runs and drives" },
      { label: "Trailer type", value: "Open trailer is fine" },
      { label: "Vehicle size", value: "Sedan" },
      { label: "Keys", value: "Will be provided at pickup" },
    ],
    notes:
      "The car is parked in a gated lot. Please call 30 minutes before pickup. Weekday mornings work best.",
    shipper: shippers.sarah,
    questions: [
      {
        id: "q1",
        question: "Can the car be picked up on Saturday?",
        askedBy: "James T.",
        answer: "Yes, Saturday morning works.",
      },
    ],
    photos: [],
    status: "open",
  },
  sofa: {
    pickupZip: "78701",
    dropoffZip: "80202",
    deliverBy: "Oct 25",
    views: 64,
    fields: [
      { label: "Items", value: "3-seat sectional sofa, 2 cushions" },
      { label: "Dimensions", value: "112 × 38 × 34 in" },
      { label: "Weight", value: "About 180 lb" },
      { label: "Pieces", value: "3" },
      { label: "Stairs or elevator", value: "Ground floor at both ends" },
      { label: "Packed", value: "Wrapped in moving blankets" },
    ],
    notes: "Two people needed to carry it. Street parking is easy.",
    shipper: shippers.priya,
    questions: [],
    photos: [],
    status: "open",
  },
  piano: {
    pickupZip: "60614",
    dropoffZip: "30309",
    deliverBy: "Nov 1",
    views: 41,
    fields: [
      { label: "Items", value: "Upright piano with bench" },
      { label: "Dimensions", value: "58 × 25 × 48 in" },
      { label: "Weight", value: "About 450 lb" },
      { label: "Pieces", value: "2" },
      {
        label: "Stairs or elevator",
        value: "4 steps at pickup, elevator at dropoff",
      },
      { label: "Packed", value: "Not packed" },
    ],
    notes: "Please bring a piano dolly and straps.",
    shipper: shippers.elena,
    questions: [],
    photos: [],
    status: "open",
  },
  pallets: {
    pickupZip: "98108",
    dropoffZip: "85034",
    deliverBy: "Oct 28",
    views: 97,
    fields: [
      { label: "Items", value: "2 shrink-wrapped pallets of boxes" },
      { label: "Dimensions", value: "48 × 40 × 60 in each" },
      { label: "Weight", value: "1,100 lb total" },
      { label: "Pieces", value: "2 pallets" },
      { label: "Loading", value: "Forklift and dock at both ends" },
      { label: "Packed", value: "Shrink-wrapped and strapped" },
    ],
    shipper: shippers.david,
    questions: [],
    photos: [],
    status: "open",
  },
};

const fallbackShipper = shippers.sarah;

/** Detail for a listing, with sensible defaults for the sample data. */
export function getShipmentDetail(shipment: Shipment): ShipmentDetail {
  return (
    details[shipment.id] ?? {
      pickupZip: "",
      dropoffZip: "",
      deliverBy: "",
      views: 20,
      fields: [],
      shipper: fallbackShipper,
      questions: [],
      photos: [],
      status: "open",
    }
  );
}

const civicOffers: Offer[] = [
  {
    id: "o1",
    driver: "Mike R.",
    rating: 4.9,
    jobs: 142,
    vehicle: "Open car carrier",
    price: 980,
    deliverBy: "Oct 27",
    sentHoursAgo: 2,
  },
  {
    id: "o2",
    driver: "James T.",
    rating: 4.8,
    jobs: 86,
    vehicle: "Enclosed trailer",
    price: 1150,
    deliverBy: "Oct 26",
    sentHoursAgo: 4,
  },
  {
    id: "o3",
    driver: "Ana P.",
    rating: 5.0,
    jobs: 64,
    vehicle: "Open car carrier",
    price: 1050,
    deliverBy: "Oct 28",
    sentHoursAgo: 6,
  },
  {
    id: "o4",
    driver: "Chris W.",
    rating: 4.7,
    jobs: 51,
    vehicle: "Enclosed trailer",
    price: 1100,
    deliverBy: "Oct 27",
    sentHoursAgo: 9,
  },
  {
    id: "o5",
    driver: "Luis H.",
    rating: 4.8,
    jobs: 120,
    vehicle: "Open car carrier",
    price: 1120,
    deliverBy: "Oct 28",
    sentHoursAgo: 12,
  },
  {
    id: "o6",
    driver: "Grace N.",
    rating: 4.9,
    jobs: 33,
    vehicle: "Flatbed",
    price: 1060,
    deliverBy: "Oct 29",
    sentHoursAgo: 15,
  },
  {
    id: "o7",
    driver: "Owen B.",
    rating: 4.6,
    jobs: 18,
    vehicle: "Open car carrier",
    price: 1170,
    deliverBy: "Oct 29",
    sentHoursAgo: 20,
  },
];

/** Offers on a listing. Non-Civic samples reuse the pool, priced from the lowest offer up. */
export function getOffers(shipment: Shipment): Offer[] {
  if (shipment.id === "civic") return civicOffers;
  return civicOffers.slice(0, shipment.offers).map((o, i) => ({
    ...o,
    id: `${shipment.id}-${o.id}`,
    price: (shipment.lowestOffer ?? shipment.budget) + i * 25,
  }));
}

export type Viewer = {
  id: string;
  name: string;
  vehicles: string[];
};

/** The signed-in person, for the sample data. Signed-in state comes from the session cookie. */
export const viewer: Viewer = {
  id: "jordan",
  name: "Jordan P.",
  vehicles: ["Ford F-350 + open trailer", "Enclosed car trailer"],
};
