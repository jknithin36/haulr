export const generalDefaults = {
  platformName: "Haulr",
  supportEmail: "support@haulr.com",
  timeZone: "central",
};

export const timeZones = [
  { value: "eastern", label: "Eastern Time" },
  { value: "central", label: "Central Time" },
  { value: "mountain", label: "Mountain Time" },
  { value: "pacific", label: "Pacific Time" },
  { value: "alaska", label: "Alaska Time" },
  { value: "hawaii", label: "Hawaii Time" },
];

export type FeePlan = {
  id: string;
  name: string;
  /** Monthly price in dollars. */
  price: number;
  /** Booking fee as a percent of the booking price. */
  fee: number;
};

export const feePlans: FeePlan[] = [
  { id: "free", name: "Free", price: 0, fee: 8 },
  { id: "pro", name: "Pro Driver", price: 29, fee: 5 },
  { id: "business", name: "Business", price: 99, fee: 3 },
];

export const paymentDefaults = {
  depositPercent: 20,
  payoutDays: "2",
  refundApprovalAbove: 500,
};

export const payoutOptions = [
  { value: "1", label: "Within 1 business day after delivery" },
  { value: "2", label: "Within 2 business days after delivery" },
  { value: "3", label: "Within 3 business days after delivery" },
  { value: "5", label: "Within 5 business days after delivery" },
];

export const offerWindows = [
  { value: "24h", label: "24h" },
  { value: "48h", label: "48h" },
  { value: "3d", label: "3 days" },
  { value: "5d", label: "5 days" },
];

export const marketplaceDefaults = {
  offerWindows: ["24h", "48h", "3d", "5d"],
  minimumOfferPercent: 30,
  maxOffersPerHour: 20,
  freeCancellationHours: 48,
  lateCancellationPercent: 10,
  minimumInsurance: 50000,
  autoFlagContactInfo: true,
};

export type Category = {
  id: string;
  name: string;
  subtypes: string[];
  active: boolean;
  /** Prohibited items can never be posted, so they have no switch. */
  blocked?: boolean;
};

export const categories: Category[] = [
  {
    id: "cars",
    name: "Cars",
    subtypes: ["Sedan", "SUV", "Pickup", "Motorcycle", "Boat"],
    active: true,
  },
  {
    id: "furniture",
    name: "Furniture",
    subtypes: ["Sofa", "Bed", "Table", "Dresser", "Full home"],
    active: true,
  },
  {
    id: "heavy",
    name: "Heavy items",
    subtypes: ["Piano", "Pool table", "Safe", "Equipment"],
    active: true,
  },
  {
    id: "freight",
    name: "Freight",
    subtypes: ["Pallets", "Crates", "LTL"],
    active: true,
  },
  {
    id: "prohibited",
    name: "Prohibited",
    subtypes: ["Live animals", "Hazardous materials", "Weapons"],
    active: false,
    blocked: true,
  },
];

export const teamRoles = [
  "Super admin",
  "Support",
  "Trust and safety",
  "Finance",
  "Content",
] as const;

export type TeamRole = (typeof teamRoles)[number];

export type TeamMember = {
  name: string;
  email: string;
  role: TeamRole;
  lastActive: string;
  invited?: boolean;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Nithin Kumar",
    email: "nithin@haulr.com",
    role: "Super admin",
    lastActive: "Now",
  },
  {
    name: "Marcus Bell",
    email: "marcus@haulr.com",
    role: "Support",
    lastActive: "12 min ago",
  },
  {
    name: "Priya Shah",
    email: "priya@haulr.com",
    role: "Trust and safety",
    lastActive: "1h ago",
  },
  {
    name: "Daniel Ortiz",
    email: "daniel@haulr.com",
    role: "Finance",
    lastActive: "3h ago",
  },
  {
    name: "Jenna Cole",
    email: "jenna@haulr.com",
    role: "Content",
    lastActive: "Yesterday",
  },
];

export const adminAlertChannels = ["email", "push", "slack"] as const;
export type AdminAlertChannel = (typeof adminAlertChannels)[number];

export const adminAlertChannelLabels: Record<AdminAlertChannel, string> = {
  email: "Email",
  push: "Push",
  slack: "Slack",
};

export const adminAlertDefaults: {
  id: string;
  label: string;
  channels: Record<AdminAlertChannel, boolean>;
}[] = [
  {
    id: "new-disputes",
    label: "New disputes",
    channels: { email: true, push: true, slack: true },
  },
  {
    id: "stale-disputes",
    label: "Disputes over 48h",
    channels: { email: true, push: true, slack: true },
  },
  {
    id: "failed-payouts",
    label: "Failed payouts",
    channels: { email: true, push: true, slack: false },
  },
  {
    id: "refund-approvals",
    label: "Refunds needing approval",
    channels: { email: true, push: true, slack: false },
  },
  {
    id: "flagged-reports",
    label: "Flagged reports",
    channels: { email: false, push: true, slack: true },
  },
  {
    id: "verification-queue",
    label: "Verification queue over 20",
    channels: { email: false, push: false, slack: true },
  },
  {
    id: "daily-summary",
    label: "Daily summary",
    channels: { email: true, push: false, slack: false },
  },
];
