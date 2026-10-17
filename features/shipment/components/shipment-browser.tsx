import { ShipmentBrowserClient } from "@/features/shipment/components/shipment-browser-client";
import { getShipments } from "@/features/shipment/shipment-queries";

/** The shipments marketplace. Filtering runs in the browser over every listing. */
export async function ShipmentBrowser() {
  const shipments = await getShipments();
  return <ShipmentBrowserClient shipments={shipments} />;
}
