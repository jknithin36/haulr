/** Sarah's shipments, as the shipper. */

type ShipmentStatus =
  | "draft"
  | "open"
  | "booked"
  | "in-transit"
  | "delivered"
  | "cancelled";

export type ShipmentOffer = {
  id: string;
  driver: string;
  rating: number;
  jobs: number;
  vehicle: string;
  price: number;
  deliverBy: string;
  sent: string;
};

export type MyShipment = {
  id: string;
  item: string;
  from: string;
  to: string;
  status: ShipmentStatus;
  /** What the Price column shows, e.g. "$980" or "Budget $450". */
  price: string;
  /** What the Date column shows, e.g. "Arrives Oct 26". */
  date: string;
  /** Extra line under the status, e.g. "7 offers · closes in 1d 2h". */
  statusNote?: string;
  /** The driver once booked. */
  driver?: { name: string; rating: number; vehicle: string };
  /** Set once Sarah accepts one of the offers below. */
  acceptedOfferId?: string;
  /** Full listing details, only for shipments still taking offers. */
  listing?: {
    miles: number;
    pickup: string;
    deliverBy: string;
    budget: number;
    closesIn: string;
    lowest: number;
    average: number;
    offerCount: number;
    offers: ShipmentOffer[];
  };
};

export const myShipments: MyShipment[] = [
  {
    id: "SHP-1061",
    item: "Office desk",
    from: "Seattle, WA",
    to: "Portland, OR",
    status: "draft",
    price: "—",
    date: "Not posted",
  },
  {
    id: "SHP-1057",
    item: "Dining table and 6 chairs",
    from: "Austin, TX",
    to: "Denver, CO",
    status: "open",
    statusNote: "7 offers · closes in 1d 2h",
    price: "Budget $450",
    date: "Pickup Oct 24",
    listing: {
      miles: 920,
      pickup: "Oct 24 – 26",
      deliverBy: "Oct 31",
      budget: 450,
      closesIn: "1d 2h",
      lowest: 395,
      average: 438,
      offerCount: 7,
      offers: [
        {
          id: "o1",
          driver: "Luis Martinez",
          rating: 4.9,
          jobs: 96,
          vehicle: "Box truck",
          price: 395,
          deliverBy: "Oct 29",
          sent: "3h ago",
        },
        {
          id: "o2",
          driver: "Ana Patel",
          rating: 5.0,
          jobs: 41,
          vehicle: "Cargo van",
          price: 410,
          deliverBy: "Oct 28",
          sent: "5h ago",
        },
        {
          id: "o3",
          driver: "James Turner",
          rating: 4.8,
          jobs: 86,
          vehicle: "Box truck",
          price: 440,
          deliverBy: "Oct 30",
          sent: "8h ago",
        },
        {
          id: "o4",
          driver: "Chris Walker",
          rating: 4.7,
          jobs: 63,
          vehicle: "Cargo van",
          price: 460,
          deliverBy: "Oct 27",
          sent: "1d ago",
        },
      ],
    },
  },
  {
    id: "SHP-1042",
    item: "2019 Honda Civic",
    from: "Los Angeles, CA",
    to: "New York, NY",
    status: "in-transit",
    price: "$980",
    date: "Arrives Oct 26",
    driver: { name: "Mike Reed", rating: 4.9, vehicle: "Open car carrier" },
  },
  {
    id: "SHP-0988",
    item: "Queen bed and dresser",
    from: "Houston, TX",
    to: "Dallas, TX",
    status: "delivered",
    price: "$340",
    date: "Sep 28",
  },
  {
    id: "SHP-0951",
    item: "Upright piano",
    from: "Chicago, IL",
    to: "Atlanta, GA",
    status: "cancelled",
    price: "—",
    date: "Sep 12",
  },
];

export const shipmentTabs = [
  { value: "all", label: "All" },
  { value: "open", label: "Getting offers" },
  { value: "booked", label: "Booked" },
  { value: "delivered", label: "Delivered" },
  { value: "drafts", label: "Drafts" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export type ShipmentTab = (typeof shipmentTabs)[number]["value"];

export function inTab(s: MyShipment, tab: ShipmentTab) {
  switch (tab) {
    case "all":
      return true;
    case "open":
      return s.status === "open";
    case "booked":
      return s.status === "booked" || s.status === "in-transit";
    case "drafts":
      return s.status === "draft";
    default:
      return s.status === tab;
  }
}

/** Empty-state copy for each tab. */
export const emptyCopy: Record<
  ShipmentTab,
  { title: string; description?: string; action: string }
> = {
  all: {
    title: "You haven’t posted any shipments yet.",
    action: "Post your first shipment",
  },
  open: {
    title: "Nothing is getting offers right now.",
    description: "Post a shipment and drivers will start sending offers.",
    action: "Post a shipment",
  },
  booked: {
    title: "Nothing booked yet.",
    description: "When you accept an offer, the shipment shows up here.",
    action: "Post a shipment",
  },
  delivered: {
    title: "No deliveries yet.",
    description: "Finished shipments are kept here for your records.",
    action: "Post a shipment",
  },
  drafts: {
    title: "No drafts.",
    description: "Shipments you start but don’t post are saved here.",
    action: "Post a shipment",
  },
  cancelled: {
    title: "No cancelled shipments.",
    action: "Post a shipment",
  },
};

export const statusLabel: Record<ShipmentStatus, string> = {
  draft: "Draft",
  open: "Getting offers",
  booked: "Booked",
  "in-transit": "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const statusTone = {
  draft: "muted",
  open: "warning",
  booked: "info",
  "in-transit": "info",
  delivered: "success",
  cancelled: "muted",
} as const satisfies Record<ShipmentStatus, string>;

/** Deposit taken when an offer is accepted: 20% of the price. */
export function depositFor(price: number) {
  return Math.round(price * 0.2);
}
