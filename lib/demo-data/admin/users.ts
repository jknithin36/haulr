import type { StatusTone } from "@/components/ui/data-display";
import { currentUser } from "@/lib/demo-data/dashboard/user";

export type UserType = "Both" | "Driver" | "Shipper" | "Business";

export type UserStatus =
  | "Verified"
  | "Verified · Pro"
  | "Active"
  | "Business plan"
  | "Pending verification"
  | "Suspended"
  | "Banned";

export type VerificationItem = {
  label: string;
  /** Extra detail, e.g. "Expires Aug 2029". */
  detail?: string;
  state: "verified" | "pending" | "missing";
};

export type UserNote = {
  id: string;
  author: string;
  date: string;
  text: string;
};

export type UserReport = {
  id: string;
  reason: string;
  reporter: string;
  date: string;
  detail: string;
};

export type ActivityItem = {
  id: string;
  text: string;
  date: string;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: UserType;
  shipments: number;
  jobs: number;
  rating: number | null;
  status: UserStatus;
  joined: string;
  memberSince: string;
  plan: string;
  earned: number;
  spent: number;
  disputes: number;
  cancellations: number;
  verification: VerificationItem[];
  activity: ActivityItem[];
  reports: UserReport[];
  notes: UserNote[];
};

export const userTotals = {
  total: "31,480",
  joinedThisMonth: "2,147",
};

export const users: AdminUserRow[] = [
  {
    id: "sarah-miller",
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    location: currentUser.location,
    type: "Both",
    shipments: 14,
    jobs: 38,
    rating: 4.9,
    status: "Verified",
    joined: "Mar 2024",
    memberSince: currentUser.memberSince,
    plan: currentUser.plan,
    earned: 18920,
    spent: 4210,
    disputes: 0,
    cancellations: 1,
    verification: [
      { label: "Email", detail: currentUser.email, state: "verified" },
      { label: "Phone", detail: currentUser.phone, state: "verified" },
      {
        label: "Driver’s license",
        detail: "Expires Aug 2029",
        state: "verified",
      },
      { label: "Insurance", detail: "Expires Mar 2027", state: "verified" },
    ],
    activity: [
      {
        id: "a1",
        text: "Signed in from Dallas, TX on iPhone",
        date: "Oct 17, 7:58 AM",
      },
      {
        id: "a2",
        text: "Sent a $290 offer on Washer and dryer (OFR-2041)",
        date: "Oct 16, 9:40 AM",
      },
      {
        id: "a3",
        text: "Uploaded documents for a 2022 Big Tex 70CH trailer",
        date: "Oct 13, 4:12 PM",
      },
      {
        id: "a4",
        text: "Completed trip TRP-298, Dallas to Houston",
        date: "Oct 12, 6:05 PM",
      },
      {
        id: "a5",
        text: "Posted shipment SHP-1057, Dining table and 6 chairs",
        date: "Oct 10, 8:22 PM",
      },
      {
        id: "a6",
        text: "Accepted Mike Reed’s $980 offer on SHP-1042",
        date: "Oct 8, 1:15 PM",
      },
    ],
    reports: [],
    notes: [
      {
        id: "n1",
        author: "Marcus Bell",
        date: "Sep 3",
        text: "Called about the SHP-0951 cancellation. Shipper rescheduled the piano move, not a driver issue.",
      },
    ],
  },
  {
    id: "mike-reed",
    name: "Mike Reed",
    email: "mike.reed@example.com",
    phone: "(602) 555-0143",
    location: "Phoenix, AZ",
    type: "Driver",
    shipments: 0,
    jobs: 412,
    rating: 4.9,
    status: "Verified · Pro",
    joined: "Jan 2023",
    memberSince: "January 2023",
    plan: "Pro Driver",
    earned: 286400,
    spent: 0,
    disputes: 2,
    cancellations: 3,
    verification: [
      { label: "Email", detail: "mike.reed@example.com", state: "verified" },
      { label: "Phone", detail: "(602) 555-0143", state: "verified" },
      {
        label: "Driver’s license",
        detail: "Expires Nov 2028",
        state: "verified",
      },
      { label: "Insurance", detail: "Expires Jun 2027", state: "verified" },
    ],
    activity: [
      {
        id: "a1",
        text: "Picked up SHP-1042, 2019 Honda Civic, in Los Angeles",
        date: "Oct 18, 8:30 AM",
      },
      {
        id: "a2",
        text: "Sent a $1,150 offer on 2021 Jeep Wrangler",
        date: "Oct 16, 2:04 PM",
      },
    ],
    reports: [],
    notes: [],
  },
  {
    id: "luis-martinez",
    name: "Luis Martinez",
    email: "luis.m@example.com",
    phone: "(713) 555-0172",
    location: "Houston, TX",
    type: "Driver",
    shipments: 2,
    jobs: 96,
    rating: 4.9,
    status: "Verified · Pro",
    joined: "Jun 2024",
    memberSince: "June 2024",
    plan: "Pro Driver",
    earned: 41250,
    spent: 610,
    disputes: 0,
    cancellations: 1,
    verification: [
      { label: "Email", detail: "luis.m@example.com", state: "verified" },
      { label: "Phone", detail: "(713) 555-0172", state: "verified" },
      {
        label: "Driver’s license",
        detail: "Expires Feb 2030",
        state: "verified",
      },
      { label: "Insurance", detail: "Expires Sep 2027", state: "verified" },
    ],
    activity: [
      {
        id: "a1",
        text: "Sent a $395 offer on SHP-1057, Dining table and 6 chairs",
        date: "Oct 17, 8:10 AM",
      },
    ],
    reports: [],
    notes: [],
  },
  {
    id: "laura-chen",
    name: "Laura Chen",
    email: "laura.chen@example.com",
    phone: "(617) 555-0129",
    location: "Boston, MA",
    type: "Shipper",
    shipments: 3,
    jobs: 0,
    rating: 4.7,
    status: "Active",
    joined: "Aug 2025",
    memberSince: "August 2025",
    plan: "Free",
    earned: 0,
    spent: 1870,
    disputes: 1,
    cancellations: 0,
    verification: [
      { label: "Email", detail: "laura.chen@example.com", state: "verified" },
      { label: "Phone", detail: "(617) 555-0129", state: "verified" },
    ],
    activity: [
      {
        id: "a1",
        text: "Opened dispute DSP-208 about a damaged grand piano",
        date: "Oct 17, 11:05 AM",
      },
      {
        id: "a2",
        text: "Requested a $270 refund",
        date: "Oct 16, 3:48 PM",
      },
    ],
    reports: [],
    notes: [],
  },
  {
    id: "lane-home-goods",
    name: "Lane Home Goods",
    email: "ops@lanehome.example.com",
    phone: "(832) 555-0110",
    location: "Houston, TX",
    type: "Business",
    shipments: 186,
    jobs: 0,
    rating: 4.8,
    status: "Business plan",
    joined: "Feb 2025",
    memberSince: "February 2025",
    plan: "Business",
    earned: 0,
    spent: 64380,
    disputes: 1,
    cancellations: 4,
    verification: [
      { label: "Email", detail: "ops@lanehome.example.com", state: "verified" },
      { label: "Phone", detail: "(832) 555-0110", state: "verified" },
      {
        label: "Business registration",
        detail: "Texas LLC",
        state: "verified",
      },
    ],
    activity: [
      {
        id: "a1",
        text: "Posted 4 shipments from Houston to Dallas",
        date: "Oct 17, 9:02 AM",
      },
    ],
    reports: [],
    notes: [],
  },
  {
    id: "kevin-shaw",
    name: "Kevin Shaw",
    email: "kevin.shaw@example.com",
    phone: "(806) 555-0197",
    location: "Amarillo, TX",
    type: "Driver",
    shipments: 0,
    jobs: 23,
    rating: 4.3,
    status: "Pending verification",
    joined: "Jul 2026",
    memberSince: "July 2026",
    plan: "Free",
    earned: 5120,
    spent: 0,
    disputes: 0,
    cancellations: 2,
    verification: [
      { label: "Email", detail: "kevin.shaw@example.com", state: "verified" },
      { label: "Phone", detail: "(806) 555-0197", state: "verified" },
      {
        label: "Driver’s license",
        detail: "Expires May 2031",
        state: "verified",
      },
      { label: "Insurance", detail: "Uploaded Oct 17", state: "pending" },
    ],
    activity: [
      {
        id: "a1",
        text: "Uploaded an insurance certificate",
        date: "Oct 17, 11:09 AM",
      },
      {
        id: "a2",
        text: "Added a 2018 Chevy Silverado 3500 flatbed",
        date: "Oct 17, 10:58 AM",
      },
    ],
    reports: [],
    notes: [],
  },
  {
    id: "user-30544",
    name: "User #30544",
    email: "quickhaul99@example.com",
    phone: "Not added",
    location: "Unknown",
    type: "Driver",
    shipments: 0,
    jobs: 0,
    rating: null,
    status: "Suspended",
    joined: "Oct 16",
    memberSince: "October 16, 2026",
    plan: "Free",
    earned: 0,
    spent: 0,
    disputes: 0,
    cancellations: 0,
    verification: [
      { label: "Email", detail: "quickhaul99@example.com", state: "verified" },
      { label: "Phone", state: "missing" },
      { label: "Driver’s license", state: "missing" },
    ],
    activity: [
      {
        id: "a1",
        text: "Suspended for spam offers by Nithin Kumar",
        date: "Oct 16, 5:40 PM",
      },
      {
        id: "a2",
        text: "Sent 46 offers in 20 minutes, each with an outside phone number",
        date: "Oct 16, 5:12 PM",
      },
      { id: "a3", text: "Created an account", date: "Oct 16, 4:51 PM" },
    ],
    reports: [
      {
        id: "r1",
        reason: "Spam",
        reporter: "Laura Chen",
        date: "Oct 16",
        detail: "Asked me to pay by Zelle outside Haulr.",
      },
      {
        id: "r2",
        reason: "Spam",
        reporter: "Daniel Kim",
        date: "Oct 16",
        detail: "Same copy-pasted offer on every listing with a phone number.",
      },
    ],
    notes: [
      {
        id: "n1",
        author: "Nithin Kumar",
        date: "Oct 16",
        text: "Suspended for 30 days. Offers removed from all open listings.",
      },
    ],
  },
];

export const userTabs = [
  { value: "all", label: "All" },
  { value: "shippers", label: "Shippers" },
  { value: "drivers", label: "Drivers" },
  { value: "both", label: "Both" },
  { value: "verified", label: "Verified" },
  { value: "suspended", label: "Suspended (42)" },
  { value: "banned", label: "Banned (17)" },
] as const;

export type UserTab = (typeof userTabs)[number]["value"];

export function inUserTab(u: AdminUserRow, tab: UserTab) {
  switch (tab) {
    case "all":
      return true;
    case "shippers":
      return u.type === "Shipper" || u.type === "Business" || u.type === "Both";
    case "drivers":
      return u.type === "Driver" || u.type === "Both";
    case "both":
      return u.type === "Both";
    case "verified":
      return u.status.startsWith("Verified");
    case "suspended":
      return u.status === "Suspended";
    case "banned":
      return u.status === "Banned";
  }
}

export const userStatusTone: Record<UserStatus, StatusTone> = {
  Verified: "success",
  "Verified · Pro": "success",
  Active: "neutral",
  "Business plan": "neutral",
  "Pending verification": "warning",
  Suspended: "danger",
  Banned: "danger",
};

export const adminRoles = [
  "Support",
  "Trust and safety",
  "Finance",
  "Content",
  "Super admin",
] as const;

export const plans = [
  { value: "Free", hint: "Pay per job · 8% booking fee" },
  { value: "Pro Driver", hint: "$29/month · 5% booking fee" },
  { value: "Business", hint: "$99/month · 3% booking fee" },
] as const;

export const suspendReasons = [
  "Spam",
  "Fraud",
  "Repeated cancellations",
  "Abuse",
  "Other",
] as const;

export const suspendDurations = ["7 days", "30 days", "Permanent"] as const;
