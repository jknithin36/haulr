import { SavedViewClient } from "@/features/dashboard/components/saved/saved-view-client";
import { getSavedItems } from "@/features/dashboard/dashboard-queries";

export async function SavedView() {
  const { shipments, trips } = await getSavedItems();
  return <SavedViewClient initialShipments={shipments} initialTrips={trips} />;
}
