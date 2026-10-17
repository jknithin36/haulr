import { city, type Place } from "@/lib/demo-data/places";

export type TruckSpace = {
  id: string;
  driver: string;
  rating: number;
  vehicle: string;
  from: Place;
  to: Place;
  departs: string;
  spaceLeft: string;
  filled: number;
  segments: number;
  price: string;
};

export const truckSpaces: TruckSpace[] = [
  {
    id: "mike",
    driver: "Mike R.",
    rating: 4.9,
    vehicle: "Open car carrier",
    from: city.miami,
    to: city.boston,
    departs: "Oct 22",
    spaceLeft: "3 of 7 spots left",
    filled: 4 / 7,
    segments: 7,
    price: "From $780 per car",
  },
  {
    id: "james",
    driver: "James T.",
    rating: 4.8,
    vehicle: "Box truck",
    from: city.dallas,
    to: city.chicago,
    departs: "Oct 20",
    spaceLeft: "400 cu ft left",
    filled: 0.75,
    segments: 10,
    price: "$1.10 per cu ft",
  },
  {
    id: "ana",
    driver: "Ana P.",
    rating: 5.0,
    vehicle: "Cargo van",
    from: city.sanDiego,
    to: city.portland,
    departs: "Oct 24",
    spaceLeft: "120 cu ft left",
    filled: 0.6,
    segments: 10,
    price: "$1.40 per cu ft",
  },
  {
    id: "chris",
    driver: "Chris W.",
    rating: 4.7,
    vehicle: "Enclosed trailer",
    from: city.atlanta,
    to: city.denver,
    departs: "Oct 25",
    spaceLeft: "1 of 2 spots left",
    filled: 0.5,
    segments: 2,
    price: "From $1,100 per car",
  },
];
