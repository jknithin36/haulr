import {
  Alert02Icon,
  Analytics01Icon,
  ChartIncreaseIcon,
  CheckmarkBadge01Icon,
  ClipboardIcon,
  DashboardSquare01Icon,
  Flag02Icon,
  News01Icon,
  PackageIcon,
  Route02Icon,
  Settings01Icon,
  StarIcon,
  TagsIcon,
  TaskDone01Icon,
  TruckIcon,
  UserMultipleIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof PackageIcon;
  /** Count of items needing attention, shown next to the label. */
  badge?: number;
};

export const adminNav: { label: string; items: AdminNavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon },
      { href: "/admin/analytics", label: "Analytics", icon: Analytics01Icon },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { href: "/admin/shipments", label: "Shipments", icon: PackageIcon },
      { href: "/admin/trips", label: "Trips", icon: Route02Icon },
      { href: "/admin/offers", label: "Offers", icon: TagsIcon },
      { href: "/admin/jobs", label: "Jobs", icon: TaskDone01Icon },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "Users", icon: UserMultipleIcon },
      {
        href: "/admin/verification",
        label: "Verification",
        icon: CheckmarkBadge01Icon,
        badge: 23,
      },
      { href: "/admin/vehicles", label: "Vehicles", icon: TruckIcon },
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/admin/payments", label: "Payments", icon: Wallet01Icon },
      { href: "/admin/revenue", label: "Revenue", icon: ChartIncreaseIcon },
    ],
  },
  {
    label: "Trust and safety",
    items: [
      {
        href: "/admin/disputes",
        label: "Disputes",
        icon: Alert02Icon,
        badge: 6,
      },
      { href: "/admin/reports", label: "Reports", icon: Flag02Icon, badge: 11 },
      { href: "/admin/reviews", label: "Reviews", icon: StarIcon },
    ],
  },
  {
    label: "Content",
    items: [{ href: "/admin/blog", label: "Blog", icon: News01Icon }],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings01Icon },
      { href: "/admin/activity", label: "Activity log", icon: ClipboardIcon },
    ],
  },
];

/** Quick-jump entries for the global search, alongside every nav page. */
export const adminSearchIndex: {
  group: "Users" | "Shipments" | "Jobs" | "Disputes";
  label: string;
  hint: string;
  href: string;
}[] = [
  {
    group: "Users",
    label: "Sarah Miller",
    hint: "sarah.miller@example.com",
    href: "/admin/users",
  },
  {
    group: "Users",
    label: "Mike Reed",
    hint: "mike.reed@example.com",
    href: "/admin/users",
  },
  {
    group: "Users",
    label: "Luis Martinez",
    hint: "luis.m@example.com",
    href: "/admin/users",
  },
  {
    group: "Users",
    label: "Laura Chen",
    hint: "laura.chen@example.com",
    href: "/admin/users",
  },
  {
    group: "Users",
    label: "Kevin Shaw",
    hint: "kevin.shaw@example.com",
    href: "/admin/users",
  },
  {
    group: "Shipments",
    label: "SHP-1042",
    hint: "2019 Honda Civic",
    href: "/admin/shipments",
  },
  {
    group: "Shipments",
    label: "SHP-1057",
    hint: "Dining table and 6 chairs",
    href: "/admin/shipments",
  },
  {
    group: "Shipments",
    label: "SHP-1070",
    hint: "2021 Jeep Wrangler",
    href: "/admin/shipments",
  },
  {
    group: "Shipments",
    label: "SHP-1038",
    hint: "Flagged: iPhone 17 bundle",
    href: "/admin/shipments",
  },
  {
    group: "Jobs",
    label: "JOB-521",
    hint: "Sectional sofa · late",
    href: "/admin/jobs",
  },
  {
    group: "Jobs",
    label: "JOB-530",
    hint: "2019 Honda Civic · in transit",
    href: "/admin/jobs",
  },
  {
    group: "Disputes",
    label: "DSP-208",
    hint: "Grand piano · damage",
    href: "/admin/disputes",
  },
  {
    group: "Disputes",
    label: "DSP-206",
    hint: "Sectional sofa · late delivery",
    href: "/admin/disputes",
  },
];

/** Recent alerts behind the bell. */
export const adminAlerts = [
  {
    text: "Dispute DSP-208 opened by Laura Chen",
    time: "11:05 AM",
    href: "/admin/disputes",
  },
  {
    text: "Insurance uploaded by Kevin Shaw, pending review",
    time: "11:09 AM",
    href: "/admin/verification",
  },
  {
    text: "Payout to Derek Ross failed: bank declined",
    time: "Oct 15",
    href: "/admin/payments",
  },
  {
    text: "SHP-1038 flagged as a likely scam",
    time: "Oct 14",
    href: "/admin/reports",
  },
  {
    text: "User #30544 suspended for spam offers",
    time: "Oct 16",
    href: "/admin/users",
  },
  { text: "JOB-521 is 2 days late", time: "Oct 17", href: "/admin/jobs" },
  { text: "JOB-519 is 1 day late", time: "Oct 17", href: "/admin/jobs" },
  {
    text: "Refund of $270 for Laura Chen needs approval",
    time: "Oct 16",
    href: "/admin/payments",
  },
];
