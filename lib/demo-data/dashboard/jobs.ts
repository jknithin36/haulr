import type { StatusTone } from "@/components/ui/data-display";

export type JobStatus = "Scheduled" | "In progress" | "Completed";

export type Stop = {
  address: string;
  when: string;
  contact?: string;
};

export type Job = {
  id: string;
  item: string;
  from: string;
  to: string;
  pickup: string;
  pay: number;
  status: JobStatus;
  /** Set when the job is a whole shared trip rather than a single shipment. */
  tripId?: string;
  bookings?: string[];
  detail?: {
    model?: string;
    weight?: string;
    pickup: Stop;
    dropoff: Stop;
    note?: string;
  };
};

export const jobs: Job[] = [
  {
    id: "JOB-512",
    item: "Treadmill",
    from: "Dallas",
    to: "Austin",
    pickup: "Oct 18, 9 AM",
    pay: 180,
    status: "Scheduled",
    detail: {
      model: "NordicTrack T 6.5",
      weight: "about 250 lb",
      pickup: {
        address: "1420 Elm St, Dallas, TX 75201",
        when: "Oct 18, 9 AM",
        contact: "Jordan Lee",
      },
      dropoff: {
        address: "88 Barton Springs Rd, Austin, TX 78704",
        when: "by Oct 19",
      },
      note: "Second floor, no elevator. Please bring a dolly.",
    },
  },
  {
    id: "JOB-509",
    item: "Trip TRP-310 (3 bookings)",
    from: "Dallas",
    to: "Chicago",
    pickup: "Oct 20, 7 AM",
    pay: 495,
    status: "Scheduled",
    tripId: "TRP-310",
    bookings: [
      "Ryan Brooks · Bedroom set",
      "Emma Davis · Desk and chair",
      "Noah Wilson · 6 storage bins",
    ],
  },
  {
    id: "JOB-487",
    item: "2 pallets",
    from: "Dallas",
    to: "Houston",
    pickup: "Oct 12",
    pay: 210,
    status: "Completed",
    detail: {
      weight: "about 900 lb",
      pickup: { address: "2300 Irving Blvd, Dallas, TX 75207", when: "Oct 12" },
      dropoff: {
        address: "5100 Westheimer Rd, Houston, TX 77056",
        when: "Oct 12",
      },
    },
  },
  {
    id: "JOB-476",
    item: "Bookshelf and boxes",
    from: "Plano",
    to: "Austin",
    pickup: "Oct 5",
    pay: 310,
    status: "Completed",
    detail: {
      pickup: { address: "6100 W Park Blvd, Plano, TX 75093", when: "Oct 5" },
      dropoff: {
        address: "1201 S Lamar Blvd, Austin, TX 78704",
        when: "Oct 6",
      },
    },
  },
  {
    id: "JOB-468",
    item: "Trip TRP-298",
    from: "Dallas",
    to: "Houston",
    pickup: "Oct 12",
    pay: 1240,
    status: "Completed",
    tripId: "TRP-298",
  },
];

export const jobTone: Record<JobStatus, StatusTone> = {
  Scheduled: "neutral",
  "In progress": "info",
  Completed: "success",
};
