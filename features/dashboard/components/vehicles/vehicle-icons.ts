import {
  Car05Icon,
  ContainerTruck01Icon,
  Pickup01Icon,
  ShippingTruck01Icon,
  TruckIcon,
  VanIcon,
} from "@hugeicons/core-free-icons";
import type { VehicleKind } from "@/lib/demo-data/dashboard/vehicles";

export const kindIcon: Record<VehicleKind, typeof TruckIcon> = {
  box: TruckIcon,
  van: VanIcon,
  pickup: Pickup01Icon,
  flatbed: ShippingTruck01Icon,
  "car-carrier": Car05Icon,
  enclosed: ContainerTruck01Icon,
};
