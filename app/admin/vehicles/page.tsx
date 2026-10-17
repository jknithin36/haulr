import type { Metadata } from "next";
import { VehiclesView } from "@/features/admin/components/vehicles/vehicles-view";

export const metadata: Metadata = { title: "Vehicles" };

export default function AdminVehiclesPage() {
  return <VehiclesView />;
}
