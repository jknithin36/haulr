import type { Metadata } from "next";
import { VehiclesView } from "@/features/dashboard/components/vehicles/vehicles-view";

export const metadata: Metadata = { title: "My vehicles" };

export default function VehiclesPage() {
  return <VehiclesView />;
}
