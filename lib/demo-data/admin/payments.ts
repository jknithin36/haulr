import type { StatusTone } from "@/components/ui/data-display";

export type TransactionType =
  | "Payout"
  | "Deposit"
  | "Balance"
  | "Refund"
  | "Subscription";

export type TransactionStatus =
  | "Paid"
  | "Sent"
  | "Sent · pending"
  | "Held"
  | "On hold"
  | "Pending approval"
  | "Refunded"
  | "Failed";

export type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  user: string;
  /** Job, shipment, trip, or plan the money belongs to. */
  job: string;
  amount: number;
  status: TransactionStatus;
  /** Extra detail shown after the status, like why a payout failed. */
  reason?: string;
};

export const transactions: Transaction[] = [
  {
    id: "TXN-60214",
    date: "Oct 17",
    type: "Payout",
    user: "Sarah Miller",
    job: "TRP-298",
    amount: 1178,
    status: "Sent",
  },
  {
    id: "TXN-60209",
    date: "Oct 17",
    type: "Deposit",
    user: "Tom Becker",
    job: "SHP-1070",
    amount: 228,
    status: "Paid",
  },
  {
    id: "TXN-60197",
    date: "Oct 16",
    type: "Balance",
    user: "Maria Lopez",
    job: "JOB-521",
    amount: 612,
    status: "Held",
  },
  {
    id: "TXN-60188",
    date: "Oct 16",
    type: "Refund",
    user: "Laura Chen",
    job: "JOB-527",
    amount: 270,
    status: "Pending approval",
  },
  {
    id: "TXN-60152",
    date: "Oct 15",
    type: "Payout",
    user: "Derek Ross",
    job: "JOB-498",
    amount: 840,
    status: "Failed",
    reason: "bank declined",
  },
  {
    id: "TXN-60140",
    date: "Oct 15",
    type: "Subscription",
    user: "Mike Reed",
    job: "Pro plan",
    amount: 29,
    status: "Paid",
  },
  {
    id: "TXN-60126",
    date: "Oct 14",
    type: "Payout",
    user: "Ella Ward",
    job: "JOB-509",
    amount: 620,
    status: "Failed",
    reason: "account closed",
  },
];

export const paymentSummary = [
  { label: "Collected", value: "$398,140" },
  { label: "Held (in transit)", value: "$86,520" },
  { label: "Paid out to drivers", value: "$351,710" },
  { label: "Refunds", value: "$9,830" },
];

export const payoutSchedule = {
  cadence: "Every Friday",
  nextRun: "Oct 23",
  drivers: 412,
  queued: "$96,380",
};

/** Refunds above this need a second admin before money moves. */
export const refundApprovalLimit = 500;

export const transactionTone: Record<TransactionStatus, StatusTone> = {
  Paid: "success",
  Sent: "success",
  Refunded: "success",
  "Sent · pending": "info",
  Held: "warning",
  "On hold": "warning",
  "Pending approval": "warning",
  Failed: "danger",
};

export function statusLabel(t: Transaction) {
  return t.reason ? `${t.status} · ${t.reason}` : t.status;
}

const usdCentsFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** Ledger amounts show cents: 1250 → "$1,250.00". */
export function formatUsdCents(amount: number) {
  return usdCentsFormat.format(amount);
}

/** Money paid in by a shipper, which is what a refund can come back from. */
export function isRefundable(t: Transaction) {
  return (
    (t.type === "Deposit" ||
      t.type === "Balance" ||
      t.type === "Subscription") &&
    t.status !== "Refunded"
  );
}
