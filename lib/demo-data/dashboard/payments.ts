import type { StatusTone } from "@/components/ui/data-display";

/** "$1,240" for whole dollars, "$199.50" only when there are cents. */
export function formatMoney(amount: number) {
  const hasCents = !Number.isInteger(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type EarningsSummary = {
  available: number;
  pending: number;
  thisMonth: number;
  allTime: number;
};

export const earningsSummary: EarningsSummary = {
  available: 1550,
  pending: 675,
  thisMonth: 2400,
  allTime: 18920,
};

export type MonthlyEarning = { month: string; amount: number };

export const monthlyEarnings: MonthlyEarning[] = [
  { month: "May", amount: 1180 },
  { month: "Jun", amount: 1640 },
  { month: "Jul", amount: 2050 },
  { month: "Aug", amount: 1870 },
  { month: "Sep", amount: 2210 },
  { month: "Oct", amount: 2400 },
];

type EarningStatus = "Paid" | "Pending";

export type Earning = {
  id: string;
  date: string;
  job: { ref: string; title?: string; route?: [string, string] };
  amount: number;
  fee: number;
  net: number;
  status: EarningStatus;
};

/** Newest first. */
export const earnings: Earning[] = [
  {
    id: "e6",
    date: "Oct 22",
    job: { ref: "JOB-509", title: "Trip TRP-310" },
    amount: 495,
    fee: 24.75,
    net: 470.25,
    status: "Pending",
  },
  {
    id: "e5",
    date: "Oct 19",
    job: { ref: "JOB-512", title: "Treadmill" },
    amount: 180,
    fee: 9,
    net: 171,
    status: "Pending",
  },
  {
    id: "e1",
    date: "Oct 14",
    job: { ref: "TRP-298", route: ["Dallas", "Houston"] },
    amount: 1240,
    fee: 62,
    net: 1178,
    status: "Paid",
  },
  {
    id: "e2",
    date: "Oct 14",
    job: { ref: "JOB-487", title: "2 pallets" },
    amount: 210,
    fee: 10.5,
    net: 199.5,
    status: "Paid",
  },
  {
    id: "e3",
    date: "Oct 7",
    job: { ref: "JOB-476", title: "Bookshelf and boxes" },
    amount: 310,
    fee: 15.5,
    net: 294.5,
    status: "Paid",
  },
  {
    id: "e4",
    date: "Oct 3",
    job: { ref: "JOB-461", title: "Furniture set" },
    amount: 640,
    fee: 32,
    net: 608,
    status: "Paid",
  },
];

type PaymentStatus = "Paid" | "Due after delivery";

export type PaymentMade = {
  id: string;
  date: string | null;
  shipment: { ref: string; title: string };
  amount: number;
  type: "Deposit" | "Balance" | "Full payment";
  status: PaymentStatus;
};

export const paymentsMade: PaymentMade[] = [
  {
    id: "p1",
    date: "Oct 18",
    shipment: { ref: "SHP-1042", title: "Honda Civic" },
    amount: 196,
    type: "Deposit",
    status: "Paid",
  },
  {
    id: "p2",
    date: null,
    shipment: { ref: "SHP-1042", title: "Honda Civic" },
    amount: 784,
    type: "Balance",
    status: "Due after delivery",
  },
  {
    id: "p3",
    date: "Sep 28",
    shipment: { ref: "SHP-0988", title: "Bed and dresser" },
    amount: 340,
    type: "Full payment",
    status: "Paid",
  },
];

export const statusTone: Record<EarningStatus | PaymentStatus, StatusTone> = {
  Paid: "success",
  Pending: "warning",
  "Due after delivery": "muted",
};

export type PayoutSettingsData = {
  bankLast4: string;
  schedule: string;
  taxInfo: string;
};

export const payoutSettings: PayoutSettingsData = {
  bankLast4: "4821",
  schedule: "Automatic, every Friday",
  taxInfo: "W-9 submitted",
};
