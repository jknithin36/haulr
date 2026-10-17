import { OffersViewClient } from "@/features/dashboard/components/offers/offers-view-client";
import { getMyOffers } from "@/features/dashboard/dashboard-queries";

export async function OffersView() {
  const offers = await getMyOffers();
  return <OffersViewClient initialOffers={offers} />;
}
