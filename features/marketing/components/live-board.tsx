import { LiveBoardClient } from "@/features/marketing/components/live-board-client";
import { getTruckSpaces } from "@/features/marketing/marketing-queries";
import { getShipments } from "@/features/shipment/shipment-queries";

/** "Happening right now": a few open shipments and trips with space. */
export async function LiveBoard() {
  const [shipments, truckSpaces] = await Promise.all([
    getShipments(),
    getTruckSpaces(),
  ]);
  return (
    <LiveBoardClient
      shipments={shipments.slice(0, 4)}
      truckSpaces={truckSpaces}
    />
  );
}
