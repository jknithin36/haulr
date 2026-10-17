import type { StatusTone } from "@/components/ui/data-display";

type OfferStatus = "Pending" | "Winning" | "Won" | "Outbid" | "Expired";

export type Offer = {
  id: string;
  shipment: string;
  from: string;
  to: string;
  /** Sarah’s offer, in dollars. */
  amount: number;
  /** Lowest offer on the shipment; null once bidding has closed. */
  lowest: number | null;
  status: OfferStatus;
  closes: string;
  /** Best offer from other drivers, used when Sarah changes her price. */
  rivalLowest?: number;
};

export const offers: Offer[] = [
  {
    id: "OFR-2041",
    shipment: "Washer and dryer",
    from: "Plano, TX",
    to: "Tulsa, OK",
    amount: 290,
    lowest: 290,
    status: "Winning",
    closes: "14h",
    rivalLowest: 305,
  },
  {
    id: "OFR-2038",
    shipment: "2 pallets of boxes",
    from: "Dallas, TX",
    to: "Houston, TX",
    amount: 260,
    lowest: 255,
    status: "Outbid",
    closes: "1d 6h",
    rivalLowest: 255,
  },
  {
    id: "OFR-2035",
    shipment: "King bed",
    from: "Fort Worth, TX",
    to: "Oklahoma City, OK",
    amount: 310,
    lowest: 310,
    status: "Pending",
    closes: "2d",
    rivalLowest: 325,
  },
  {
    id: "OFR-2019",
    shipment: "Treadmill",
    from: "Dallas, TX",
    to: "Austin, TX",
    amount: 180,
    lowest: null,
    status: "Won",
    closes: "Closed",
  },
  {
    id: "OFR-2007",
    shipment: "Antique cabinet",
    from: "Dallas, TX",
    to: "Memphis, TN",
    amount: 420,
    lowest: null,
    status: "Expired",
    closes: "Closed",
  },
];

export const offerTabs = [
  "All",
  "Pending",
  "Winning",
  "Won",
  "Outbid",
  "Expired",
] as const;

export type OfferTab = (typeof offerTabs)[number];

export const offerTone: Record<OfferStatus, StatusTone> = {
  Pending: "neutral",
  Winning: "info",
  Won: "success",
  Outbid: "warning",
  Expired: "muted",
};

/** Offers on shipments that are still taking bids can be changed or withdrawn. */
export function isOpen(o: Offer) {
  return (
    o.status === "Pending" || o.status === "Winning" || o.status === "Outbid"
  );
}
