import type { StatusTone } from "@/components/ui/data-display";
import {
  confirmedBookings,
  spotRequests,
  upcomingTrip,
} from "@/lib/demo-data/dashboard/trips";

/** Trips drivers post to share space on a route they are already driving. */

export type TripStatus = "Upcoming" | "In progress" | "Completed" | "Cancelled";

export type TripBooking = {
  shipper: string;
  item: string;
  /** e.g. "250 cu ft" or "1 spot". */
  space: string;
  price: number;
};

export type TripRequest = TripBooking & {
  status: "Pending" | "Accepted" | "Declined";
  note?: string;
};

export type TripActivity = { label: string; time: string; by: string };

export type AdminTrip = {
  id: string;
  driver: string;
  driverEmail: string;
  driverPhone: string;
  vehicle: string;
  from: string;
  to: string;
  stops: string[];
  departs: string;
  arrives: string;
  used: number;
  capacity: number;
  unit: "spots" | "cu ft" | "pallets";
  bookedValue: number;
  status: TripStatus;
  bookings: TripBooking[];
  requests: TripRequest[];
  activity: TripActivity[];
};

export const tripTone: Record<TripStatus, StatusTone> = {
  Upcoming: "info",
  "In progress": "neutral",
  Completed: "success",
  Cancelled: "muted",
};

export const tripTabs = [
  { value: "Upcoming", label: "Upcoming", count: 342 },
  { value: "In progress", label: "In progress", count: 58 },
  { value: "Completed", label: "Completed", count: 6912 },
  { value: "Cancelled", label: "Cancelled", count: 214 },
] as const;

const cuft = (n: number) => `${n} cu ft`;

export const adminTrips: AdminTrip[] = [
  {
    id: "TRP-318",
    driver: "Mike Reed",
    driverEmail: "mike.reed@example.com",
    driverPhone: "(214) 555-0142",
    vehicle: "7-car open carrier",
    from: "Miami, FL",
    to: "Boston, MA",
    stops: ["Jacksonville", "Charlotte", "Baltimore"],
    departs: "Oct 22",
    arrives: "Oct 25",
    used: 4,
    capacity: 7,
    unit: "spots",
    bookedValue: 3120,
    status: "Upcoming",
    bookings: [
      {
        shipper: "Grace Liu",
        item: "2020 Toyota Camry",
        space: "1 spot",
        price: 780,
      },
      {
        shipper: "Marcus Bell",
        item: "2018 Ford Escape",
        space: "1 spot",
        price: 760,
      },
      {
        shipper: "Hannah Cole",
        item: "2022 Honda CR-V",
        space: "1 spot",
        price: 810,
      },
      {
        shipper: "Ethan Ward",
        item: "2016 BMW 328i",
        space: "1 spot",
        price: 770,
      },
    ],
    requests: [
      {
        shipper: "Sofia Reyes",
        item: "2019 Mazda 3",
        space: "1 spot",
        price: 740,
        status: "Pending",
      },
      {
        shipper: "Owen Hart",
        item: "1968 Mustang, not running",
        space: "1 spot",
        price: 900,
        status: "Declined",
        note: "Needs a winch",
      },
    ],
    activity: [
      { label: "Trip posted", time: "Oct 9, 4:20 PM", by: "Mike Reed" },
      { label: "First booking", time: "Oct 11, 10:02 AM", by: "Grace Liu" },
      {
        label: "Request declined",
        time: "Oct 14, 8:45 AM",
        by: "Mike Reed",
      },
      { label: "4 of 7 spots booked", time: "Oct 16, 3:30 PM", by: "Haulr" },
    ],
  },
  {
    id: "TRP-315",
    driver: "Ana Patel",
    driverEmail: "ana.patel@example.com",
    driverPhone: "(619) 555-0173",
    vehicle: "Cargo van",
    from: "San Diego, CA",
    to: "Portland, OR",
    stops: ["Los Angeles", "Sacramento"],
    departs: "Oct 24",
    arrives: "Oct 26",
    used: 60,
    capacity: 180,
    unit: "cu ft",
    bookedValue: 84,
    status: "Upcoming",
    bookings: [
      {
        shipper: "Liam Foster",
        item: "Road bike and 2 boxes",
        space: cuft(60),
        price: 84,
      },
    ],
    requests: [
      {
        shipper: "Mia Torres",
        item: "Armchair",
        space: cuft(40),
        price: 56,
        status: "Pending",
      },
    ],
    activity: [
      { label: "Trip posted", time: "Oct 13, 7:05 PM", by: "Ana Patel" },
      { label: "Booking confirmed", time: "Oct 15, 1:12 PM", by: "Ana Patel" },
    ],
  },
  {
    id: upcomingTrip.id,
    driver: "Sarah Miller",
    driverEmail: "sarah.miller@example.com",
    driverPhone: "(214) 555-0186",
    vehicle: "Box truck",
    from: upcomingTrip.from.city,
    to: upcomingTrip.to.city,
    stops: upcomingTrip.stops,
    departs: upcomingTrip.departs,
    arrives: upcomingTrip.arrives ?? "",
    used: 450,
    capacity: upcomingTrip.capacity,
    unit: "cu ft",
    bookedValue: 495,
    status: "Upcoming",
    bookings: confirmedBookings.map((b) => ({
      shipper: b.shipper,
      item: b.item,
      space: cuft(b.cuft),
      price: b.price,
    })),
    requests: [
      ...spotRequests.map((r) => ({
        shipper: r.shipper,
        item: r.item,
        space: cuft(r.cuft),
        price: r.price,
        status: "Pending" as const,
        note: `${r.pickup} to ${r.dropoff}`,
      })),
      ...confirmedBookings.map((b) => ({
        shipper: b.shipper,
        item: b.item,
        space: cuft(b.cuft),
        price: b.price,
        status: "Accepted" as const,
      })),
    ],
    activity: [
      { label: "Trip posted", time: "Oct 10, 6:40 PM", by: "Sarah Miller" },
      {
        label: "Booking accepted",
        time: "Oct 12, 9:15 AM",
        by: "Sarah Miller",
      },
      {
        label: "Booking accepted",
        time: "Oct 14, 5:02 PM",
        by: "Sarah Miller",
      },
      {
        label: "Booking accepted",
        time: "Oct 15, 11:30 AM",
        by: "Sarah Miller",
      },
      { label: "2 new spot requests", time: "Oct 16", by: "Shippers" },
    ],
  },
  {
    id: "TRP-306",
    driver: "Luis Martinez",
    driverEmail: "luis.m@example.com",
    driverPhone: "(713) 555-0108",
    vehicle: "Flatbed",
    from: "Houston, TX",
    to: "Phoenix, AZ",
    stops: ["San Antonio", "El Paso"],
    departs: "Oct 18",
    arrives: "Oct 20",
    used: 4,
    capacity: 6,
    unit: "pallets",
    bookedValue: 720,
    status: "In progress",
    bookings: [
      {
        shipper: "Lane Home Goods",
        item: "2 pallets of pavers",
        space: "2 pallets",
        price: 380,
      },
      {
        shipper: "Desert Bloom Nursery",
        item: "2 pallets of planters",
        space: "2 pallets",
        price: 340,
      },
    ],
    requests: [
      {
        shipper: "Ryan Brooks",
        item: "Pallet of lumber",
        space: "1 pallet",
        price: 170,
        status: "Declined",
        note: "Too long for the deck",
      },
    ],
    activity: [
      { label: "Trip posted", time: "Oct 8, 2:00 PM", by: "Luis Martinez" },
      { label: "Fully loaded", time: "Oct 18, 7:10 AM", by: "Luis Martinez" },
      { label: "Departed", time: "Oct 18, 7:45 AM", by: "Luis Martinez" },
    ],
  },
  {
    id: "TRP-298",
    driver: "Sarah Miller",
    driverEmail: "sarah.miller@example.com",
    driverPhone: "(214) 555-0186",
    vehicle: "Box truck",
    from: "Dallas, TX",
    to: "Houston, TX",
    stops: [],
    departs: "Oct 12",
    arrives: "Oct 12",
    used: 760,
    capacity: 800,
    unit: "cu ft",
    bookedValue: 1240,
    status: "Completed",
    bookings: [
      {
        shipper: "Kevin Shaw",
        item: "Office furniture",
        space: cuft(420),
        price: 690,
      },
      {
        shipper: "Emma Davis",
        item: "Washer and dryer",
        space: cuft(180),
        price: 290,
      },
      {
        shipper: "Jordan Lee",
        item: "12 moving boxes",
        space: cuft(160),
        price: 260,
      },
    ],
    requests: [],
    activity: [
      { label: "Trip posted", time: "Oct 3, 9:30 AM", by: "Sarah Miller" },
      { label: "Departed", time: "Oct 12, 6:50 AM", by: "Sarah Miller" },
      {
        label: "All items delivered",
        time: "Oct 12, 3:20 PM",
        by: "Sarah Miller",
      },
    ],
  },
];

export function spaceLabel(t: AdminTrip) {
  return `${t.used} of ${t.capacity} ${t.unit}`;
}
