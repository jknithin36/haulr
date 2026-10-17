type NotificationCategory =
  | "offers"
  | "trips"
  | "payments"
  | "messages"
  | "shipments"
  | "account";

export type NotificationKind =
  | "offer"
  | "booking"
  | "update"
  | "outbid"
  | "payout"
  | "vehicle"
  | "review";

export type DashboardNotification = {
  id: string;
  kind: NotificationKind;
  category: NotificationCategory;
  /** Plain text, used for the accessible label. */
  text: string;
  /** Optional route that replaces "{route}" in the text with icon arrows. */
  route?: { from: string; to: string };
  time: string;
  read: boolean;
  href: string;
};

export const notificationTabs = [
  { value: "all", label: "All" },
  { value: "offers", label: "Offers" },
  { value: "trips", label: "Trips" },
  { value: "payments", label: "Payments" },
  { value: "messages", label: "Messages" },
] as const;

export const notifications: DashboardNotification[] = [
  {
    id: "n1",
    kind: "offer",
    category: "offers",
    text: "Luis Martinez sent a $395 offer on your Dining table and 6 chairs.",
    time: "3h ago",
    read: false,
    href: "/dashboard/shipments",
  },
  {
    id: "n2",
    kind: "booking",
    category: "trips",
    text: "Daniel Kim wants to book 120 cu ft on your {route} trip.",
    route: { from: "Dallas", to: "Chicago" },
    time: "5h ago",
    read: false,
    href: "/dashboard/trips",
  },
  {
    id: "n3",
    kind: "update",
    category: "shipments",
    text: "Mike Reed updated your Honda Civic: near Oklahoma City.",
    time: "6h ago",
    read: false,
    href: "/dashboard/tracking",
  },
  {
    id: "n4",
    kind: "outbid",
    category: "offers",
    text: "You were outbid on 2 pallets of boxes.",
    time: "1d ago",
    read: true,
    href: "/dashboard/offers",
  },
  {
    id: "n5",
    kind: "payout",
    category: "payments",
    text: "$1,178 was paid to your bank account.",
    time: "3d ago",
    read: true,
    href: "/dashboard/payments",
  },
  {
    id: "n6",
    kind: "vehicle",
    category: "account",
    text: "Your 2-car open trailer is pending review.",
    time: "4d ago",
    read: true,
    href: "/dashboard/vehicles",
  },
  {
    id: "n7",
    kind: "review",
    category: "account",
    text: "Ryan Brooks left you a 5-star review.",
    time: "4d ago",
    read: true,
    href: "/dashboard/reviews",
  },
];
