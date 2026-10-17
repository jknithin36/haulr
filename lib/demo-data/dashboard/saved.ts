/** Shipments and trips Sarah has hearted. */

export type SavedShipment = {
  id: string;
  item: string;
  from: string;
  to: string;
  budget: number;
  /** e.g. "2 offers · closes in 2d"; undefined once the listing is closed. */
  status?: string;
  closed: boolean;
  href: string;
};

export type SavedTrip = {
  id: string;
  driver: string;
  from: string;
  to: string;
  rate: string;
  spaceLeft: string;
  href: string;
};

export const savedShipments: SavedShipment[] = [
  {
    id: "s1",
    item: "Upright piano",
    from: "Dallas, TX",
    to: "Nashville, TN",
    budget: 850,
    status: "2 offers · closes in 2d",
    closed: false,
    href: "/shipments",
  },
  {
    id: "s2",
    item: "Office chairs (10)",
    from: "Irving, TX",
    to: "Austin, TX",
    budget: 300,
    status: "No offers yet · closes in 3d",
    closed: false,
    href: "/shipments",
  },
  {
    id: "s3",
    item: "2018 Toyota Camry",
    from: "Dallas, TX",
    to: "Phoenix, AZ",
    budget: 700,
    closed: true,
    href: "/shipments",
  },
];

export const savedTrips: SavedTrip[] = [
  {
    id: "t1",
    driver: "Ana Patel",
    from: "Dallas, TX",
    to: "Denver, CO",
    rate: "$1.20 per cu ft",
    spaceLeft: "200 cu ft left",
    href: "/loads",
  },
];
