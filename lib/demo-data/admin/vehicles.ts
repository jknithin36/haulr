import type { StatusTone } from "@/components/ui/data-display";

export type AdminVehicleStatus =
  | "Verified"
  | "Pending"
  | "Rejected"
  | "Expiring soon"
  | "Disabled";

export type AdminVehicle = {
  id: string;
  name: string;
  plate: string;
  owner: string;
  ownerId?: string;
  type: string;
  capacity: string;
  insurance: string;
  status: AdminVehicleStatus;
  /** Set once a reminder about expiring insurance has gone out. */
  reminderSent?: boolean;
};

export const vehicleTotals = { total: "5,912", verified: "5,406" };

export const adminVehicles: AdminVehicle[] = [
  {
    id: "VEH-1",
    name: "2020 Isuzu NPR",
    plate: "TX 4RD-8812",
    owner: "Sarah Miller",
    ownerId: "sarah-miller",
    type: "Box truck",
    capacity: "800 cu ft",
    insurance: "$100K · exp Mar 2027",
    status: "Verified",
  },
  {
    id: "VEH-2",
    name: "2022 Big Tex 70CH",
    plate: "TX 9TL-0457",
    owner: "Sarah Miller",
    ownerId: "sarah-miller",
    type: "2-car open trailer",
    capacity: "2 cars",
    insurance: "$150K · exp Jan 2027",
    status: "Pending",
  },
  {
    id: "VEH-3",
    name: "2019 Peterbilt 389 + trailer",
    plate: "AZ CR7-2210",
    owner: "Mike Reed",
    ownerId: "mike-reed",
    type: "7-car open carrier",
    capacity: "7 cars",
    insurance: "$250K · exp Jun 2027",
    status: "Verified",
  },
  {
    id: "VEH-4",
    name: "2021 Ford Transit 250",
    plate: "TX 7KV-3095",
    owner: "Ana Patel",
    type: "Cargo van",
    capacity: "180 cu ft",
    insurance: "$75K · exp Nov 2, 2026",
    status: "Expiring soon",
  },
  {
    id: "VEH-5",
    name: "2018 Chevy Silverado 3500",
    plate: "TX 2HN-6614",
    owner: "Kevin Shaw",
    ownerId: "kevin-shaw",
    type: "Flatbed",
    capacity: "6 pallets",
    insurance: "Under review",
    status: "Pending",
  },
];

export const vehicleTabs = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending (14)" },
  { value: "rejected", label: "Rejected" },
  { value: "expiring", label: "Insurance expiring soon (37)" },
] as const;

export type VehicleTab = (typeof vehicleTabs)[number]["value"];

export function inVehicleTab(v: AdminVehicle, tab: VehicleTab) {
  switch (tab) {
    case "all":
      return true;
    case "verified":
      return v.status === "Verified";
    case "pending":
      return v.status === "Pending";
    case "rejected":
      return v.status === "Rejected";
    case "expiring":
      return v.status === "Expiring soon";
  }
}

export const vehicleStatusTone: Record<AdminVehicleStatus, StatusTone> = {
  Verified: "success",
  Pending: "warning",
  "Expiring soon": "warning",
  Rejected: "danger",
  Disabled: "muted",
};
