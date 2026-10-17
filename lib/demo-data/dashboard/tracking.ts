/** Live tracking for Sarah's booked shipments. */

export type TrackingStep = {
  label: string;
  time: string;
  note: string;
  done: boolean;
};

export type ActiveShipment = {
  id: string;
  item: string;
  from: string;
  to: string;
  driver: {
    name: string;
    firstName: string;
    rating: number;
    vehicle: string;
    plate: string;
    phone: string;
  };
  location: { label: string; lat: number; lng: number };
  milesDone: number;
  milesTotal: number;
  progress: number;
  eta: string;
  /** Road path as [lng, lat], split where the truck is now. */
  traveled: [number, number][];
  remaining: [number, number][];
  timeline: TrackingStep[];
  photos: string[];
};

const losAngeles: [number, number] = [-118.2437, 34.0522];
const oklahomaCity: [number, number] = [-97.5164, 35.4676];
const newYork: [number, number] = [-74.006, 40.7128];

export const activeShipment: ActiveShipment | null = {
  id: "SHP-1042",
  item: "2019 Honda Civic",
  from: "Los Angeles, CA",
  to: "New York, NY",
  driver: {
    name: "Mike Reed",
    firstName: "Mike",
    rating: 4.9,
    vehicle: "Open car carrier",
    plate: "TX 7KP-2210",
    phone: "+12145550142",
  },
  location: {
    label: "near Oklahoma City, OK",
    lat: oklahomaCity[1],
    lng: oklahomaCity[0],
  },
  milesDone: 1180,
  milesTotal: 2790,
  progress: 42,
  eta: "Oct 26, between 10 AM and 2 PM",
  // Roughly I-15 / I-40 west of the truck, I-40 / I-81 / I-78 east of it.
  traveled: [
    losAngeles,
    [-117.0173, 34.8958], // Barstow
    [-114.053, 35.1894], // Kingman
    [-111.6513, 35.1983], // Flagstaff
    [-106.6504, 35.0844], // Albuquerque
    [-101.8313, 35.222], // Amarillo
    oklahomaCity,
  ],
  remaining: [
    oklahomaCity,
    [-94.3985, 35.3859], // Fort Smith
    [-92.2896, 34.7465], // Little Rock
    [-90.049, 35.1495], // Memphis
    [-86.7816, 36.1627], // Nashville
    [-83.9207, 35.9606], // Knoxville
    [-79.9414, 37.271], // Roanoke
    [-76.8867, 40.2732], // Harrisburg
    newYork,
  ],
  timeline: [
    {
      label: "Booked",
      time: "Oct 18, 2:15 PM",
      note: "Deposit of $196 paid",
      done: true,
    },
    {
      label: "Driver assigned",
      time: "Oct 18, 2:16 PM",
      note: "Mike Reed",
      done: true,
    },
    {
      label: "Picked up",
      time: "Oct 20, 9:40 AM",
      note: "6 pickup photos added",
      done: true,
    },
    {
      label: "In transit",
      time: "Oct 21, 6:05 PM",
      note: "Passed Amarillo, TX",
      done: true,
    },
    {
      label: "In transit",
      time: "Oct 22, 8:30 AM",
      note: "Near Oklahoma City, OK",
      done: true,
    },
    { label: "Delivered", time: "—", note: "Expected Oct 26", done: false },
  ],
  photos: ["Front", "Back", "Left side", "Right side", "Interior", "Odometer"],
};

export const pastTracking = [
  {
    id: "SHP-0988",
    item: "Queen bed and dresser",
    from: "Houston, TX",
    to: "Dallas, TX",
    delivered: "Sep 28",
  },
];
