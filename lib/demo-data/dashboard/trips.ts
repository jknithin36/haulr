export type SpotRequest = {
  id: string;
  shipper: string;
  rating: number;
  item: string;
  /** Space asked for, in cubic feet. */
  cuft: number;
  pickup: string;
  dropoff: string;
  price: number;
};

export type Booking = {
  id: string;
  shipper: string;
  item: string;
  cuft: number;
  price: number;
};

export type Trip = {
  id: string;
  from: { code: string; city: string };
  to: { code: string; city: string };
  stops: string[];
  departs: string;
  arrives?: string;
  vehicle: string;
  capacity: number;
  pricePerCuft: number;
};

export const upcomingTrip: Trip = {
  id: "TRP-310",
  from: { code: "DAL", city: "Dallas, TX" },
  to: { code: "CHI", city: "Chicago, IL" },
  stops: ["Oklahoma City", "Kansas City"],
  departs: "Oct 20",
  arrives: "Oct 22",
  vehicle: "2020 Isuzu NPR box truck",
  capacity: 800,
  pricePerCuft: 1.1,
};

export const spotRequests: SpotRequest[] = [
  {
    id: "REQ-1",
    shipper: "Daniel Kim",
    rating: 4.8,
    item: "3-seat sofa",
    cuft: 120,
    pickup: "Dallas",
    dropoff: "Chicago",
    price: 132,
  },
  {
    id: "REQ-2",
    shipper: "Olivia Park",
    rating: 5.0,
    item: "8 moving boxes",
    cuft: 80,
    pickup: "Dallas",
    dropoff: "Kansas City",
    price: 88,
  },
];

export const confirmedBookings: Booking[] = [
  {
    id: "BKG-1",
    shipper: "Ryan Brooks",
    item: "Bedroom set",
    cuft: 250,
    price: 275,
  },
  {
    id: "BKG-2",
    shipper: "Emma Davis",
    item: "Desk and chair",
    cuft: 90,
    price: 99,
  },
  {
    id: "BKG-3",
    shipper: "Noah Wilson",
    item: "6 storage bins",
    cuft: 110,
    price: 121,
  },
];

export type CompletedTrip = {
  id: string;
  from: { code: string; city: string };
  to: { code: string; city: string };
  date: string;
  booked: number;
  capacity: number;
  earned: number;
};

export const completedTrip: CompletedTrip = {
  id: "TRP-298",
  from: { code: "DAL", city: "Dallas, TX" },
  to: { code: "HOU", city: "Houston, TX" },
  date: "Oct 12",
  booked: 760,
  capacity: 800,
  earned: 1240,
};
