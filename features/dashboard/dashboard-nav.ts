import {
  FavouriteIcon,
  Location01Icon,
  Message01Icon,
  Notification01Icon,
  PackageIcon,
  Route02Icon,
  Settings01Icon,
  StarIcon,
  TagsIcon,
  TaskDone01Icon,
  TruckIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

type DashboardNavItem = {
  href: string;
  label: string;
  icon: typeof PackageIcon;
  /** Small count shown next to the label, e.g. unread messages. */
  badge?: number;
};

export const dashboardNav: { label: string; items: DashboardNavItem[] }[] = [
  {
    label: "Shipping",
    items: [
      {
        href: "/dashboard/shipments",
        label: "My shipments",
        icon: PackageIcon,
      },
      { href: "/dashboard/tracking", label: "Tracking", icon: Location01Icon },
    ],
  },
  {
    label: "Driving",
    items: [
      { href: "/dashboard/offers", label: "My offers", icon: TagsIcon },
      { href: "/dashboard/trips", label: "My trips", icon: Route02Icon },
      { href: "/dashboard/jobs", label: "Jobs", icon: TaskDone01Icon },
      { href: "/dashboard/vehicles", label: "Vehicles", icon: TruckIcon },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/dashboard/messages",
        label: "Messages",
        icon: Message01Icon,
        badge: 2,
      },
      { href: "/dashboard/payments", label: "Payments", icon: Wallet01Icon },
      { href: "/dashboard/reviews", label: "Reviews", icon: StarIcon },
      { href: "/dashboard/saved", label: "Saved", icon: FavouriteIcon },
      {
        href: "/dashboard/notifications",
        label: "Notifications",
        icon: Notification01Icon,
        badge: 3,
      },
      { href: "/dashboard/settings", label: "Settings", icon: Settings01Icon },
    ],
  },
];
