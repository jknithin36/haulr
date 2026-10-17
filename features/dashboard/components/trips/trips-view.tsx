import { TripsViewClient } from "@/features/dashboard/components/trips/trips-view-client";
import { getMyTrips } from "@/features/dashboard/dashboard-queries";

export async function TripsView() {
  const { upcoming, spotRequests, bookings, completed } = await getMyTrips();
  return (
    <TripsViewClient
      trip={upcoming}
      initialSpotRequests={spotRequests}
      initialBookings={bookings}
      completedTrip={completed}
    />
  );
}
