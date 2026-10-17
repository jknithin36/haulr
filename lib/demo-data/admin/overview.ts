/** Admin overview sample data: October 1–17, 2026 vs the same days in September. */

export type Kpi = {
  label: string;
  value: string;
  /** Small muted text after the value, e.g. "of shipments". */
  suffix?: string;
  change: string;
  direction: "up" | "down";
  goodWhen: "up" | "down";
};

export const overviewKpis: Kpi[] = [
  {
    label: "Booking value (GMV)",
    value: "$412,860",
    change: "14.2%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "Haulr revenue",
    value: "$38,250",
    change: "11.8%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "Bookings",
    value: "684",
    change: "9.6%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "New shipments posted",
    value: "1,906",
    change: "12.1%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "Offers sent",
    value: "14,382",
    change: "17.4%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "New users",
    value: "2,147",
    change: "8.3%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "Active drivers",
    value: "1,163",
    change: "6.9%",
    direction: "up",
    goodWhen: "up",
  },
  {
    label: "Booking rate",
    value: "35.9%",
    suffix: "of shipments",
    change: "1.4 pts",
    direction: "up",
    goodWhen: "up",
  },
];

export type DailyPoint = {
  /** Short axis label, e.g. "Oct 3". */
  day: string;
  /** Tooltip label, e.g. "Sat, Oct 3". */
  date: string;
  value: number;
};

const weekdays = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

/** October 1, 2026 is a Thursday. */
export function octoberDays(values: number[]): DailyPoint[] {
  return values.map((value, i) => ({
    day: `Oct ${i + 1}`,
    date: `${weekdays[i % 7]}, Oct ${i + 1}`,
    value,
  }));
}

/** Daily booking value. Sums to $412,860; weekends (3–4, 10–11, 17) dip. */
export const bookingValueByDay = octoberDays([
  19240, 20610, 19180, 18620, 22500, 23820, 24740, 25570, 26730, 23840, 22960,
  26980, 27520, 28160, 28740, 29310, 24340,
]);

export const bookingCategories = [
  { name: "Cars", share: 41 },
  { name: "Furniture", share: 33 },
  { name: "Freight", share: 17 },
  { name: "Heavy items", share: 9 },
];

export const totalBookings = 684;

export const needsAttention = [
  {
    label: "Open disputes",
    count: 6,
    note: "2 older than 48h",
    action: "Review disputes",
    href: "/admin/disputes",
  },
  {
    label: "Pending verifications",
    count: 23,
    action: "Review documents",
    href: "/admin/verification",
  },
  {
    label: "Flagged reports",
    count: 11,
    action: "Review reports",
    href: "/admin/reports",
  },
  {
    label: "Late deliveries",
    count: 4,
    action: "View jobs",
    href: "/admin/jobs",
  },
  {
    label: "Failed payouts",
    count: 2,
    action: "Fix payouts",
    href: "/admin/payments",
  },
] as const;

export type ActivityKind =
  | "offer"
  | "signup"
  | "booking"
  | "document"
  | "dispute"
  | "payout";

export type Activity = {
  id: string;
  time: string;
  kind: ActivityKind;
} & (
  | { text: string; route?: never }
  | {
      text?: never;
      route: {
        ref: string;
        item: string;
        from: string;
        to: string;
        price: string;
      };
    }
);

export const liveActivity: Activity[] = [
  {
    id: "a1",
    time: "11:18 AM",
    kind: "offer",
    text: "Luis Martinez sent a $395 offer on SHP-1057",
  },
  {
    id: "a2",
    time: "11:16 AM",
    kind: "signup",
    text: "New user: Grace Thompson (Phoenix, AZ)",
  },
  {
    id: "a3",
    time: "11:12 AM",
    kind: "booking",
    route: {
      ref: "SHP-1070",
      item: "2021 Jeep Wrangler",
      from: "Denver",
      to: "Seattle",
      price: "$1,140",
    },
  },
  {
    id: "a4",
    time: "11:09 AM",
    kind: "document",
    text: "Insurance uploaded by Kevin Shaw · pending review",
  },
  {
    id: "a5",
    time: "11:05 AM",
    kind: "dispute",
    text: "Dispute DSP-208 opened by Laura Chen",
  },
  {
    id: "a6",
    time: "11:02 AM",
    kind: "payout",
    text: "Payout of $1,178 sent to Sarah Miller",
  },
];

export const topRoutes = [
  {
    from: "Los Angeles, CA",
    to: "New York, NY",
    bookings: 38,
    avgPrice: 1160,
  },
  { from: "Dallas, TX", to: "Houston, TX", bookings: 34, avgPrice: 290 },
  { from: "Miami, FL", to: "New York, NY", bookings: 29, avgPrice: 890 },
  { from: "Chicago, IL", to: "Atlanta, GA", bookings: 22, avgPrice: 640 },
  {
    from: "Phoenix, AZ",
    to: "Los Angeles, CA",
    bookings: 21,
    avgPrice: 410,
  },
];

export const topDrivers = [
  { name: "Mike Reed", jobs: 18, earned: 14620, rating: 4.9 },
  { name: "Luis Martinez", jobs: 15, earned: 8940, rating: 4.9 },
  { name: "James Turner", jobs: 14, earned: 7310, rating: 4.8 },
  { name: "Sarah Miller", jobs: 6, earned: 2400, rating: 4.9 },
];
