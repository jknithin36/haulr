import { currentUser } from "@/lib/demo-data/dashboard/user";

export const profileDefaults = {
  name: currentUser.name,
  email: currentUser.email,
  phone: currentUser.phone,
  city: currentUser.location,
  about: currentUser.about,
};

export type Profile = typeof profileDefaults;

export type VerificationItem = {
  id: string;
  label: string;
  verified: boolean;
  detail?: string;
};

export const verificationItems: VerificationItem[] = [
  { id: "email", label: "Email", verified: true },
  { id: "phone", label: "Phone", verified: true },
  {
    id: "license",
    label: "Driver’s license",
    verified: true,
    detail: "Expires Aug 2029",
  },
  {
    id: "insurance",
    label: "Insurance",
    verified: true,
    detail: "Expires Mar 2027",
  },
  { id: "business", label: "Business info", verified: false },
];

export const notificationChannels = ["email", "push", "sms"] as const;
export type NotificationChannel = (typeof notificationChannels)[number];

export const channelLabels: Record<NotificationChannel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
};

export type NotificationPreference = {
  id: string;
  label: string;
  channels: Record<NotificationChannel, boolean>;
};

export const notificationDefaults: NotificationPreference[] = [
  {
    id: "offers",
    label: "New offers",
    channels: { email: true, push: true, sms: false },
  },
  {
    id: "outbid",
    label: "Outbid alerts",
    channels: { email: true, push: true, sms: false },
  },
  {
    id: "spot",
    label: "Spot requests",
    channels: { email: true, push: true, sms: true },
  },
  {
    id: "shipments",
    label: "Shipment updates",
    channels: { email: true, push: true, sms: true },
  },
  {
    id: "payments",
    label: "Payments",
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "messages",
    label: "Messages",
    channels: { email: false, push: true, sms: false },
  },
  {
    id: "news",
    label: "Tips and news",
    channels: { email: false, push: false, sms: false },
  },
];

export type Session = {
  id: string;
  device: string;
  location: string;
  current: boolean;
};

export const sessions: Session[] = [
  { id: "mac", device: "MacBook Pro", location: "Dallas, TX", current: true },
  { id: "iphone", device: "iPhone 15", location: "Dallas, TX", current: false },
];

export type CurrentPlan = {
  name: string;
  /** Monthly price in whole dollars. */
  price: number;
  renews: string;
  includes: string;
};

export const currentPlan: CurrentPlan = {
  name: "Pro Driver",
  price: 29,
  renews: "Nov 3, 2026",
  includes: "Includes unlimited offers, a 5% fee, and featured placement",
};

/** Same plans as the pricing section on the home page (monthly prices). */
export type PlanOption = { name: string; price: number; description: string };

export const plans: PlanOption[] = [
  {
    name: "Free",
    price: 0,
    description: "For people who ship or drive once in a while.",
  },
  {
    name: "Pro Driver",
    price: 29,
    description: "For drivers who want more jobs and lower fees.",
  },
  {
    name: "Business",
    price: 99,
    description: "For companies that ship every week.",
  },
];

export type BillingRecord = {
  id: string;
  date: string;
  amount: number;
  status: "Paid";
};

export const billingHistory: BillingRecord[] = [
  { id: "oct", date: "Oct 3", amount: 29, status: "Paid" },
  { id: "sep", date: "Sep 3", amount: 29, status: "Paid" },
  { id: "aug", date: "Aug 3", amount: 29, status: "Paid" },
];
