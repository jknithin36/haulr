import type { Metadata } from "next";
import { ShipmentsView } from "@/features/admin/components/shipments/shipments-view";

export const metadata: Metadata = { title: "Shipments" };

export default function AdminShipmentsPage() {
  return <ShipmentsView />;
}
