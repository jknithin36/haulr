/** Admin analytics sample data: month to date, October 1–17, 2026. */

import { octoberDays } from "@/lib/demo-data/admin/overview";

export const analyticsFilters = {
  category: ["All categories", "Cars", "Furniture", "Freight", "Heavy items"],
  state: [
    "All states",
    "California",
    "Texas",
    "Florida",
    "New York",
    "Illinois",
  ],
  userType: ["All users", "Shippers", "Drivers", "Both"],
} as const;

export type FunnelStep = {
  label: string;
  count: number;
  /** Share of the step above, as shown ("11.5%"). Empty for the first step. */
  conversion?: string;
  note?: string;
};

export const funnel: FunnelStep[] = [
  { label: "Visitors", count: 186420 },
  { label: "Estimates calculated", count: 21380, conversion: "11.5%" },
  { label: "Shipments started", count: 3214, conversion: "15.0%" },
  { label: "Shipments posted", count: 1906, conversion: "59.3%" },
  { label: "Received at least 1 offer", count: 1742, conversion: "91.4%" },
  { label: "Booked", count: 684, conversion: "39.3%" },
  {
    label: "Delivered",
    count: 571,
    conversion: "83.5%",
    note: "rest still in transit",
  },
];

export const marketplaceHealth = [
  { label: "Avg offers per shipment", value: "7.5" },
  { label: "Avg time to first offer", value: "47 min" },
  { label: "Avg time to booking", value: "21 hours" },
  { label: "Avg trip space filled", value: "72%" },
  { label: "On-time delivery rate", value: "94.3%" },
  { label: "Cancellation rate", value: "4.1%" },
  { label: "Dispute rate", value: "0.9%", hint: "of bookings" },
  { label: "Repeat shippers", value: "28%" },
];

/** New signups per day. Sums to 2,147; weekends run a little higher. */
export const signupsByDay = octoberDays([
  104, 118, 141, 136, 112, 109, 117, 121, 126, 152, 147, 119, 124, 128, 131,
  129, 133,
]);

/** Weekly active users, last 8 weeks (weeks start Monday). */
export const activeUsersByWeek = [
  { label: "Aug 24", title: "Week of Aug 24", value: 9640 },
  { label: "Aug 31", title: "Week of Aug 31", value: 9910 },
  { label: "Sep 7", title: "Week of Sep 7", value: 10180 },
  { label: "Sep 14", title: "Week of Sep 14", value: 10420 },
  { label: "Sep 21", title: "Week of Sep 21", value: 10860 },
  { label: "Sep 28", title: "Week of Sep 28", value: 11240 },
  { label: "Oct 5", title: "Week of Oct 5", value: 11730 },
  { label: "Oct 12", title: "Week of Oct 12 (so far)", value: 12180 },
];

/** Ordered shipper → driver so the gray steps read as a scale. */
export const userSplit = {
  total: 31480,
  segments: [
    { label: "Ship only", count: 22915 },
    { label: "Do both", count: 4759 },
    { label: "Drive only", count: 3806 },
  ],
};

export const topStates = [
  { state: "California", bookings: 142, share: 20.8 },
  { state: "Texas", bookings: 118, share: 17.3 },
  { state: "Florida", bookings: 87, share: 12.7 },
  { state: "New York", bookings: 64, share: 9.4 },
  { state: "Illinois", bookings: 41, share: 6.0 },
];

export const trafficSources = [
  { source: "Google search", visitors: 92310, signups: 1084 },
  { source: "Direct", visitors: 38770, signups: 512 },
  { source: "Blog", visitors: 24160, signups: 301 },
  { source: "Social", visitors: 18450, signups: 167 },
  { source: "Referrals", visitors: 12730, signups: 83 },
];
