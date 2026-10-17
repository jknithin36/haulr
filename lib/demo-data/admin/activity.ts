export type ActivityType =
  | "disputes"
  | "users"
  | "payouts"
  | "verification"
  | "content"
  | "settings";

export const activityTypes: { value: ActivityType; label: string }[] = [
  { value: "disputes", label: "Disputes" },
  { value: "users", label: "Users" },
  { value: "payouts", label: "Payouts" },
  { value: "verification", label: "Verification" },
  { value: "content", label: "Content" },
  { value: "settings", label: "Settings" },
];

export type ActivityEntry = {
  id: string;
  /** Day key, used for grouping and the date filter. */
  day: string;
  time: string;
  admin: string;
  action: string;
  type: ActivityType;
  target: string;
};

/** Days in the log, newest first. Labels are relative to the data period (Oct 17). */
export const activityDays = [
  { value: "2026-10-17", label: "Today", date: "Oct 17" },
  { value: "2026-10-16", label: "Yesterday", date: "Oct 16" },
];

export const activityLog: ActivityEntry[] = [
  {
    id: "act-1",
    day: "2026-10-17",
    time: "11:20 AM",
    admin: "Nithin Kumar",
    action: "Viewed dispute",
    type: "disputes",
    target: "DSP-208",
  },
  {
    id: "act-2",
    day: "2026-10-17",
    time: "10:58 AM",
    admin: "Priya Shah",
    action: "Suspended user (spam offers)",
    type: "users",
    target: "User #30544",
  },
  {
    id: "act-3",
    day: "2026-10-17",
    time: "10:31 AM",
    admin: "Daniel Ortiz",
    action: "Retried payout",
    type: "payouts",
    target: "TXN-60152",
  },
  {
    id: "act-4",
    day: "2026-10-17",
    time: "9:47 AM",
    admin: "Marcus Bell",
    action: "Approved insurance",
    type: "verification",
    target: "Luis Martinez",
  },
  {
    id: "act-5",
    day: "2026-10-16",
    time: "5:12 PM",
    admin: "Jenna Cole",
    action: "Scheduled post",
    type: "content",
    target: "How to ship a car in winter",
  },
  {
    id: "act-6",
    day: "2026-10-16",
    time: "3:05 PM",
    admin: "Nithin Kumar",
    action: "Changed max offers per hour from 30 to 20",
    type: "settings",
    target: "Settings",
  },
];
