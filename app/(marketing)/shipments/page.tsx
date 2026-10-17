import type { Metadata } from "next";
import { ShipmentBrowser } from "@/features/shipment/components/shipment-browser";

export const metadata: Metadata = {
  title: "Browse shipments · Haulr",
  description:
    "Find shipments on your route, send your best offer, and get booked.",
};

export default function ShipmentsPage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <ShipmentBrowser />
    </main>
  );
}
