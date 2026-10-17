import type { Metadata } from "next";
import { OffersView } from "@/features/admin/components/offers/offers-view";

export const metadata: Metadata = { title: "Offers" };

export default function AdminOffersPage() {
  return <OffersView />;
}
