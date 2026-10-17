import type { StatusTone } from "@/components/ui/data-display";
import { formatUsd } from "@/lib/format";

/** Every shipment on the platform, as the admin sees it. */

export type AdminShipmentStatus =
  | "Draft"
  | "Getting offers"
  | "Booked"
  | "In transit"
  | "Delivered"
  | "Cancelled"
  | "Disputed"
  | "Flagged";

export type ShipmentCategory =
  | "Vehicles"
  | "Furniture"
  | "Freight"
  | "Pianos"
  | "Electronics";

export type AdminShipment = {
  id: string;
  item: string;
  category: ShipmentCategory;
  shipper: string;
  from: string;
  to: string;
  status: AdminShipmentStatus;
  /** Offer count; null while still a draft. */
  offers: number | null;
  /** Agreed price, or the shipper's budget while still taking offers. */
  amount: number | null;
  priceKind: "price" | "budget";
  posted: string;
  /** Day of the year the shipment was posted, for the date filter. */
  postedDay: number;
};

export const shipmentTone: Record<AdminShipmentStatus, StatusTone> = {
  Draft: "muted",
  "Getting offers": "info",
  Booked: "neutral",
  "In transit": "neutral",
  Delivered: "success",
  Cancelled: "muted",
  Disputed: "danger",
  Flagged: "danger",
};

// Oct 17, 2026 is day 290. Kept as numbers so nothing reads the clock.
export const TODAY = 290;

export const adminShipments: AdminShipment[] = [
  {
    id: "SHP-1070",
    item: "2021 Jeep Wrangler",
    category: "Vehicles",
    shipper: "Tom Becker",
    from: "Denver, CO",
    to: "Seattle, WA",
    status: "Booked",
    offers: 9,
    amount: 1140,
    priceKind: "price",
    posted: "Oct 15",
    postedDay: 288,
  },
  {
    id: "SHP-1066",
    item: "4 pallets of tiles",
    category: "Freight",
    shipper: "Lane Home Goods",
    from: "Houston, TX",
    to: "Atlanta, GA",
    status: "Getting offers",
    offers: 12,
    amount: 1100,
    priceKind: "budget",
    posted: "Oct 16",
    postedDay: 289,
  },
  {
    id: "SHP-1061",
    item: "Office desk",
    category: "Furniture",
    shipper: "Sarah Miller",
    from: "Seattle, WA",
    to: "Portland, OR",
    status: "Draft",
    offers: null,
    amount: null,
    priceKind: "price",
    posted: "Oct 16",
    postedDay: 289,
  },
  {
    id: "SHP-1057",
    item: "Dining table and 6 chairs",
    category: "Furniture",
    shipper: "Sarah Miller",
    from: "Austin, TX",
    to: "Denver, CO",
    status: "Getting offers",
    offers: 7,
    amount: 450,
    priceKind: "budget",
    posted: "Oct 15",
    postedDay: 288,
  },
  {
    id: "SHP-1049",
    item: "Grand piano",
    category: "Pianos",
    shipper: "Laura Chen",
    from: "Boston, MA",
    to: "Philadelphia, PA",
    status: "Disputed",
    offers: null,
    amount: 1350,
    priceKind: "price",
    posted: "Oct 9",
    postedDay: 282,
  },
  {
    id: "SHP-1042",
    item: "2019 Honda Civic",
    category: "Vehicles",
    shipper: "Sarah Miller",
    from: "Los Angeles, CA",
    to: "New York, NY",
    status: "In transit",
    offers: 5,
    amount: 980,
    priceKind: "price",
    posted: "Oct 15",
    postedDay: 288,
  },
  {
    id: "SHP-1038",
    item: "“iPhone 17 bundle, 50 units”",
    category: "Electronics",
    shipper: "User #30981",
    from: "Miami, FL",
    to: "Newark, NJ",
    status: "Flagged",
    offers: 0,
    amount: 90,
    priceKind: "budget",
    posted: "Oct 14",
    postedDay: 287,
  },
  {
    id: "SHP-0988",
    item: "Queen bed and dresser",
    category: "Furniture",
    shipper: "Sarah Miller",
    from: "Houston, TX",
    to: "Dallas, TX",
    status: "Delivered",
    offers: 6,
    amount: 340,
    priceKind: "price",
    posted: "Sep 22",
    postedDay: 265,
  },
];

/** Status tabs. Counts are platform totals, not the sample rows below. */
export const shipmentTabs = [
  { value: "all", label: "All", count: 24318 },
  { value: "Getting offers", label: "Getting offers", count: 1248 },
  { value: "Booked", label: "Booked", count: 213 },
  { value: "In transit", label: "In transit", count: 147 },
  { value: "Delivered", label: "Delivered", count: 21604 },
  { value: "Cancelled", label: "Cancelled", count: 1006 },
  { value: "Flagged", label: "Flagged", count: 5 },
] as const;

export type ShipmentTab = (typeof shipmentTabs)[number]["value"];

export const shipmentCategories: ShipmentCategory[] = [
  "Vehicles",
  "Furniture",
  "Freight",
  "Pianos",
  "Electronics",
];

export function priceLabel(s: AdminShipment) {
  if (s.amount === null) return "—";
  const price = formatUsd(s.amount);
  return s.priceKind === "budget" ? `Budget ${price}` : price;
}

/* ---------------------------------------------------------------- Detail */

export type Contact = {
  name: string;
  email: string;
  phone: string;
  /** Short line under the name, e.g. "Shipper since 2024 · 14 shipments". */
  note: string;
};

export type DetailOffer = {
  id: string;
  driver: string;
  rating: number;
  vehicle: string;
  amount: number;
  sent: string;
  status: "Accepted" | "Not chosen" | "Withdrawn" | "Active";
};

export type ActivityEntry = {
  label: string;
  time: string;
  by: string;
  note?: string;
};

export type ChatMessage = {
  from: string;
  time: string;
  text: string;
};

export type InternalNote = {
  text: string;
  by: string;
  time: string;
};

export type ShipmentDetail = {
  description: string;
  miles?: number;
  pickupWindow?: string;
  deliverBy?: string;
  shipper: Contact;
  driver?: Contact & { vehicle: string; plate?: string };
  pickupAddress: string;
  dropoffAddress: string;
  offers: DetailOffer[];
  payment?: {
    total: number;
    lines: { label: string; amount: number; status: string; when: string }[];
  };
  messages: ChatMessage[];
  activity: ActivityEntry[];
  notes: InternalNote[];
  /** Why our checks flagged it, if they did. */
  flags?: string[];
};

const sarah: Contact = {
  name: "Sarah Miller",
  email: "sarah.miller@example.com",
  phone: "(214) 555-0186",
  note: "Shipper and driver · joined Mar 2024",
};

const shipmentDetails: Record<string, ShipmentDetail> = {
  "SHP-1042": {
    description: "Sedan, runs and drives. Keys with the owner.",
    miles: 2790,
    pickupWindow: "Oct 20",
    deliverBy: "Oct 26",
    shipper: sarah,
    driver: {
      name: "Mike Reed",
      email: "mike.reed@example.com",
      phone: "(214) 555-0142",
      note: "Driver · 4.9 rating · 212 jobs",
      vehicle: "Open car carrier",
      plate: "TX 7KP-2210",
    },
    pickupAddress: "1840 S Figueroa St, Los Angeles, CA 90015",
    dropoffAddress: "525 W 52nd St, New York, NY 10019",
    offers: [
      {
        id: "OFF-88302",
        driver: "Mike Reed",
        rating: 4.9,
        vehicle: "Open car carrier",
        amount: 980,
        sent: "Oct 17",
        status: "Accepted",
      },
      {
        id: "OFF-88297",
        driver: "Derek Ross",
        rating: 4.6,
        vehicle: "Open car carrier",
        amount: 1040,
        sent: "Oct 16",
        status: "Not chosen",
      },
      {
        id: "OFF-88281",
        driver: "Victor Hale",
        rating: 4.7,
        vehicle: "Enclosed car carrier",
        amount: 1120,
        sent: "Oct 16",
        status: "Withdrawn",
      },
      {
        id: "OFF-88254",
        driver: "Carlos Diaz",
        rating: 4.8,
        vehicle: "Open car carrier",
        amount: 1150,
        sent: "Oct 15",
        status: "Not chosen",
      },
      {
        id: "OFF-88249",
        driver: "Ben Foster",
        rating: 4.5,
        vehicle: "Flatbed",
        amount: 1190,
        sent: "Oct 15",
        status: "Withdrawn",
      },
    ],
    payment: {
      total: 980,
      lines: [
        { label: "Deposit", amount: 196, status: "Paid", when: "Oct 18" },
        {
          label: "Balance",
          amount: 784,
          status: "Held",
          when: "Released after delivery",
        },
      ],
    },
    messages: [
      {
        from: "Mike Reed",
        time: "Oct 20, 9:42 AM",
        text: "Picked up your car. Photos are uploaded.",
      },
      {
        from: "Sarah Miller",
        time: "Oct 20, 9:50 AM",
        text: "Thank you! Looks great.",
      },
      {
        from: "Mike Reed",
        time: "Oct 22, 8:31 AM",
        text: "Passing Oklahoma City now, all good. Still on track for Oct 26.",
      },
    ],
    activity: [
      { label: "Posted", time: "Oct 15, 10:12 AM", by: "Sarah Miller" },
      {
        label: "Getting offers",
        time: "Oct 15 – 17",
        by: "5 drivers",
        note: "5 offers, 2 later withdrawn",
      },
      {
        label: "Booked",
        time: "Oct 18, 2:15 PM",
        by: "Sarah Miller",
        note: "Accepted Mike Reed’s $980 offer. Deposit of $196 paid.",
      },
      {
        label: "Driver assigned",
        time: "Oct 18, 2:16 PM",
        by: "Haulr",
        note: "Mike Reed",
      },
      {
        label: "Picked up",
        time: "Oct 20, 9:40 AM",
        by: "Mike Reed",
        note: "6 pickup photos added",
      },
      {
        label: "In transit",
        time: "Oct 21, 6:05 PM",
        by: "Mike Reed",
        note: "Passed Amarillo, TX",
      },
    ],
    notes: [
      {
        text: "Shipper asked for weekend delivery. Driver confirmed.",
        by: "Nithin",
        time: "Oct 19",
      },
    ],
  },
};

const shipperContacts: Record<string, Contact> = {
  "Sarah Miller": sarah,
  "Tom Becker": {
    name: "Tom Becker",
    email: "tom.becker@example.com",
    phone: "(303) 555-0119",
    note: "Shipper · joined Aug 2025",
  },
  "Lane Home Goods": {
    name: "Lane Home Goods",
    email: "orders@lanehomegoods.com",
    phone: "(713) 555-0164",
    note: "Business shipper · 38 shipments",
  },
  "Laura Chen": {
    name: "Laura Chen",
    email: "laura.chen@example.com",
    phone: "(617) 555-0127",
    note: "Shipper · joined Jan 2026",
  },
  "User #30981": {
    name: "User #30981",
    email: "deals4u.wholesale@example.net",
    phone: "Not verified",
    note: "Joined Oct 14 · no ID check",
  },
};

const simpleAddresses: Record<string, [string, string]> = {
  "SHP-1070": [
    "2200 Larimer St, Denver, CO 80205",
    "1501 4th Ave, Seattle, WA 98101",
  ],
  "SHP-1066": [
    "8800 Kempwood Dr, Houston, TX 77080",
    "1100 Howell Mill Rd, Atlanta, GA 30318",
  ],
  "SHP-1061": [
    "400 Pine St, Seattle, WA 98101",
    "920 SW 6th Ave, Portland, OR 97204",
  ],
  "SHP-1057": [
    "2400 E Cesar Chavez St, Austin, TX 78702",
    "1550 Platte St, Denver, CO 80202",
  ],
  "SHP-1049": [
    "180 Beacon St, Boston, MA 02116",
    "2100 Spruce St, Philadelphia, PA 19103",
  ],
  "SHP-1038": ["Not provided (Miami, FL)", "Not provided (Newark, NJ)"],
  "SHP-0988": [
    "3400 Montrose Blvd, Houston, TX 77006",
    "2808 Thomas Ave, Dallas, TX 75204",
  ],
};

const descriptions: Record<string, string> = {
  "SHP-1070": "SUV, runs and drives. Soft top.",
  "SHP-1066": "Porcelain floor tiles, about 2,400 lb per pallet. Dock to dock.",
  "SHP-1061": "Standing desk, taken apart. Not posted yet.",
  "SHP-1057": "Solid oak table with 6 chairs. Ground floor pickup.",
  "SHP-1049": "Steinway Model B. Needs a piano board and three movers.",
  "SHP-1038": "“Brand new, sealed. Pay the deposit to my account first.”",
  "SHP-0988": "Queen bed frame, mattress, and a 6-drawer dresser.",
};

const flagReasons: Record<string, string[]> = {
  "SHP-1038": [
    "Budget far below item value",
    "New account, no ID check",
    "Asked drivers to pay upfront",
  ],
};

/** Full detail for SHP-1042; a lighter version built from the row for the rest. */
export function getShipmentDetail(s: AdminShipment): ShipmentDetail {
  const full = shipmentDetails[s.id];
  if (full) return full;
  const [pickupAddress, dropoffAddress] = simpleAddresses[s.id] ?? ["—", "—"];
  const activity: ActivityEntry[] =
    s.status === "Draft"
      ? [{ label: "Draft saved", time: s.posted, by: s.shipper }]
      : [{ label: "Posted", time: s.posted, by: s.shipper }];
  if (s.status === "Flagged")
    activity.push({
      label: "Flagged",
      time: "Oct 14",
      by: "Haulr checks",
      note: "Hidden from drivers until reviewed",
    });
  if (s.status === "Disputed")
    activity.push(
      { label: "Delivered", time: "Oct 14", by: "Victor Hale" },
      {
        label: "Dispute opened",
        time: "Oct 17, 11:05 AM",
        by: "Laura Chen",
        note: "DSP-208 · damage on arrival",
      },
    );
  if (s.status === "Delivered")
    activity.push({ label: "Delivered", time: "Sep 28", by: "Driver" });
  return {
    description: descriptions[s.id] ?? "",
    shipper: shipperContacts[s.shipper] ?? {
      name: s.shipper,
      email: "—",
      phone: "—",
      note: "Shipper",
    },
    pickupAddress,
    dropoffAddress,
    offers: [],
    messages: [],
    activity,
    notes: [],
    flags: flagReasons[s.id],
  };
}
