import { ShipmentsViewClient } from "@/features/dashboard/components/shipments/shipments-view-client";
import { getMyShipments } from "@/features/dashboard/dashboard-queries";

export async function ShipmentsView() {
  const shipments = await getMyShipments();
  return <ShipmentsViewClient initialShipments={shipments} />;
}
