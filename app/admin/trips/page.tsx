import type { Metadata } from "next";
import { TripsView } from "@/features/admin/components/trips/trips-view";

export const metadata: Metadata = { title: "Trips" };

export default function AdminTripsPage() {
  return <TripsView />;
}
