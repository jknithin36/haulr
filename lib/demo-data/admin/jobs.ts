import type { StatusTone } from "@/components/ui/data-display";

/** Booked jobs, from pickup to delivery. */

export type AdminJobStatus =
  | "Scheduled"
  | "In transit"
  | "Late"
  | "Delivered"
  | "Cancelled";

export type JobPerson = { name: string; email: string; phone: string };

export type JobMessage = { from: string; time: string; text: string };

export type JobActivity = { label: string; time: string; by: string };

export type AdminJob = {
  id: string;
  shipmentId: string;
  item: string;
  driver: JobPerson;
  shipper: JobPerson;
  from: string;
  to: string;
  expected: string;
  status: AdminJobStatus;
  /** Short detail after the status, e.g. "42%" or "2 days". */
  statusNote?: string;
  progress?: number;
  disputed?: boolean;
  price: number;
  pickedUp?: string;
  lastUpdate?: { time: string; text: string };
  /** Messages from the shipper in the last 24 hours. */
  shipperMessages?: JobMessage[];
  activity: JobActivity[];
};

export const jobTone: Record<AdminJobStatus, StatusTone> = {
  Scheduled: "neutral",
  "In transit": "info",
  Late: "danger",
  Delivered: "success",
  Cancelled: "muted",
};

export const jobTabs = [
  { value: "All", label: "All" },
  { value: "Scheduled", label: "Scheduled", count: "213" },
  { value: "In transit", label: "In transit", count: "147" },
  { value: "Late", label: "Late", count: "4" },
  { value: "Delivered", label: "Delivered", count: "571 this month" },
  { value: "Cancelled", label: "Cancelled", count: "28 this month" },
] as const;

export type JobTab = (typeof jobTabs)[number]["value"];

const p = (name: string, email: string, phone: string): JobPerson => ({
  name,
  email,
  phone,
});

const sarah = p("Sarah Miller", "sarah.miller@example.com", "(214) 555-0186");

/** Drivers who can take over a job. */
export const availableDrivers: (JobPerson & { detail: string })[] = [
  {
    ...p("Luis Martinez", "luis.m@example.com", "(713) 555-0108"),
    detail: "Box truck · near Amarillo · 4.9",
  },
  {
    ...p("James Turner", "james.turner@example.com", "(214) 555-0161"),
    detail: "Box truck · Dallas · 4.8",
  },
  {
    ...p("Chris Walker", "chris.walker@example.com", "(210) 555-0185"),
    detail: "Cargo van · San Antonio · 4.7",
  },
  {
    ...p("Ana Patel", "ana.patel@example.com", "(619) 555-0173"),
    detail: "Cargo van · Albuquerque · 5.0",
  },
];

export const adminJobs: AdminJob[] = [
  {
    id: "JOB-530",
    shipmentId: "SHP-1042",
    item: "2019 Honda Civic",
    driver: p("Mike Reed", "mike.reed@example.com", "(214) 555-0142"),
    shipper: sarah,
    from: "LA",
    to: "New York",
    expected: "Oct 26",
    status: "In transit",
    statusNote: "42%",
    progress: 42,
    price: 980,
    pickedUp: "Oct 20, 9:40 AM",
    lastUpdate: {
      time: "Oct 22, 8:31 AM",
      text: "Passing Oklahoma City now, all good. Still on track for Oct 26.",
    },
    activity: [
      { label: "Booked", time: "Oct 18, 2:15 PM", by: "Sarah Miller" },
      { label: "Picked up", time: "Oct 20, 9:40 AM", by: "Mike Reed" },
      { label: "In transit", time: "Oct 22, 8:30 AM", by: "Mike Reed" },
    ],
  },
  {
    id: "JOB-527",
    shipmentId: "SHP-1049",
    item: "Grand piano",
    driver: p("Victor Hale", "victor.hale@example.com", "(617) 555-0151"),
    shipper: p("Laura Chen", "laura.chen@example.com", "(617) 555-0127"),
    from: "Boston",
    to: "Philadelphia",
    expected: "Oct 14",
    status: "Delivered",
    statusNote: "disputed",
    disputed: true,
    price: 1350,
    pickedUp: "Oct 13, 8:00 AM",
    activity: [
      { label: "Booked", time: "Oct 10, 4:48 PM", by: "Laura Chen" },
      { label: "Picked up", time: "Oct 13, 8:00 AM", by: "Victor Hale" },
      { label: "Delivered", time: "Oct 14, 2:10 PM", by: "Victor Hale" },
      { label: "Dispute opened", time: "Oct 17, 11:05 AM", by: "Laura Chen" },
    ],
  },
  {
    id: "JOB-521",
    shipmentId: "SHP-1033",
    item: "Sectional sofa",
    driver: p("Kevin Shaw", "kevin.shaw@example.com", "(512) 555-0133"),
    shipper: p("Maria Lopez", "maria.lopez@example.com", "(512) 555-0178"),
    from: "Austin",
    to: "Denver",
    expected: "Oct 15",
    status: "Late",
    statusNote: "2 days",
    price: 620,
    pickedUp: "Oct 13, 10:15 AM",
    lastUpdate: { time: "Oct 14, 6:40 PM", text: "Truck repair in Amarillo." },
    shipperMessages: [
      {
        from: "Maria Lopez",
        time: "Oct 16, 9:12 PM",
        text: "Hi Kevin, any news on the repair? The sofa was due yesterday.",
      },
      {
        from: "Maria Lopez",
        time: "Oct 17, 8:05 AM",
        text: "I took the day off to be home for this. Please let me know.",
      },
      {
        from: "Maria Lopez",
        time: "Oct 17, 10:40 AM",
        text: "Still nothing. I’m going to ask Haulr for help.",
      },
    ],
    activity: [
      { label: "Booked", time: "Oct 11, 1:20 PM", by: "Maria Lopez" },
      { label: "Picked up", time: "Oct 13, 10:15 AM", by: "Kevin Shaw" },
      {
        label: "Delayed",
        time: "Oct 14, 6:40 PM",
        by: "Kevin Shaw",
      },
      { label: "Marked late", time: "Oct 16, 12:00 AM", by: "Haulr" },
    ],
  },
  {
    id: "JOB-519",
    shipmentId: "SHP-1029",
    item: "2017 Ford F-150",
    driver: p("Derek Ross", "derek.ross@example.com", "(404) 555-0122"),
    shipper: p("Paul Grant", "paul.grant@example.com", "(404) 555-0190"),
    from: "Atlanta",
    to: "Chicago",
    expected: "Oct 16",
    status: "Late",
    statusNote: "1 day",
    price: 890,
    pickedUp: "Oct 14, 7:30 AM",
    lastUpdate: {
      time: "Oct 16, 5:15 PM",
      text: "Held up at a weigh station in Indiana. Delivering tomorrow.",
    },
    activity: [
      { label: "Booked", time: "Oct 12, 3:05 PM", by: "Paul Grant" },
      { label: "Picked up", time: "Oct 14, 7:30 AM", by: "Derek Ross" },
      { label: "Marked late", time: "Oct 17, 12:00 AM", by: "Haulr" },
    ],
  },
  {
    id: "JOB-512",
    shipmentId: "SHP-1051",
    item: "Treadmill",
    driver: sarah,
    shipper: p("Jordan Lee", "jordan.lee@example.com", "(214) 555-0147"),
    from: "Dallas",
    to: "Austin",
    expected: "Oct 19",
    status: "Scheduled",
    price: 180,
    activity: [
      { label: "Booked", time: "Oct 15, 6:22 PM", by: "Jordan Lee" },
      {
        label: "Pickup set for Oct 18, 9 AM",
        time: "Oct 16, 9:10 AM",
        by: "Sarah Miller",
      },
    ],
  },
];
