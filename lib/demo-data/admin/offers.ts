import type { StatusTone } from "@/components/ui/data-display";

/** Every offer drivers send on shipments. */

export type AdminOfferStatus =
  | "Active"
  | "Accepted"
  | "Withdrawn"
  | "Expired"
  | "Flagged"
  | "Removed";

export type AdminOffer = {
  id: string;
  driver: string;
  /** Driver's account id, so actions on one offer reach all of theirs. */
  userId: string;
  shipmentId: string;
  shipment: string;
  amount: number;
  budget: number;
  status: AdminOfferStatus;
  sent: string;
  message: string;
  flags?: string[];
};

export const offerTone: Record<AdminOfferStatus, StatusTone> = {
  Active: "info",
  Accepted: "success",
  Withdrawn: "muted",
  Expired: "muted",
  Flagged: "danger",
  Removed: "muted",
};

export const offerStats = [
  { label: "Offers this month", value: "14,382" },
  { label: "Per shipment", value: "7.5" },
  { label: "Accepted", value: "9.4%" },
  { label: "Flagged", value: "38" },
];

export const offerTabs = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Accepted", label: "Accepted" },
  { value: "Withdrawn", label: "Withdrawn" },
  { value: "Expired", label: "Expired" },
  { value: "Flagged", label: "Flagged", count: 38 },
] as const;

export type OfferTab = (typeof offerTabs)[number]["value"];

const spamFlags = [
  "Unusually low price",
  "Same user sent offers on 50+ shipments in 1 hour",
  "Phone number in the message",
];

export const adminOffers: AdminOffer[] = [
  {
    id: "OFF-88421",
    driver: "Luis Martinez",
    userId: "U-11842",
    shipmentId: "SHP-1057",
    shipment: "Dining table",
    amount: 395,
    budget: 450,
    status: "Active",
    sent: "3h ago",
    message:
      "I’m driving Austin to Denver on the 27th with room in the box truck. Blankets and straps included.",
  },
  {
    id: "OFF-88415",
    driver: "Ana Patel",
    userId: "U-20417",
    shipmentId: "SHP-1057",
    shipment: "Dining table",
    amount: 410,
    budget: 450,
    status: "Active",
    sent: "5h ago",
    message:
      "Can pick up Oct 24 in the morning. I’ll wrap the table top and chairs separately.",
  },
  {
    id: "OFF-88302",
    driver: "Mike Reed",
    userId: "U-09315",
    shipmentId: "SHP-1042",
    shipment: "Honda Civic",
    amount: 980,
    budget: 1200,
    status: "Accepted",
    sent: "Oct 17",
    message:
      "Open carrier leaving LA on Oct 20, delivery to NYC by Oct 26. Fully insured.",
  },
  {
    id: "OFF-88290",
    driver: "User #30544",
    userId: "U-30544",
    shipmentId: "SHP-1066",
    shipment: "Pallets of tiles",
    amount: 1,
    budget: 1100,
    status: "Flagged",
    sent: "Oct 16",
    message: "Best price guaranteed!! Text me at 305-555-0191 to book direct.",
    flags: spamFlags,
  },
  {
    id: "OFF-88288",
    driver: "User #30544",
    userId: "U-30544",
    shipmentId: "SHP-1057",
    shipment: "Dining table",
    amount: 1,
    budget: 450,
    status: "Flagged",
    sent: "Oct 16",
    message: "Best price guaranteed!! Text me at 305-555-0191 to book direct.",
    flags: spamFlags,
  },
];
