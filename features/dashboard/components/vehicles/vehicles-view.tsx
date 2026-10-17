import { VehiclesViewClient } from "@/features/dashboard/components/vehicles/vehicles-view-client";
import { getMyVehicles } from "@/features/dashboard/dashboard-queries";

export async function VehiclesView() {
  const vehicles = await getMyVehicles();
  return <VehiclesViewClient initialVehicles={vehicles} />;
}
