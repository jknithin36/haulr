import type { Metadata } from "next";
import { Suspense } from "react";
import {
  TripDetail,
  TripDetailSkeleton,
} from "@/features/trip/components/trip-detail";
import { getTrip, getTrips } from "@/features/trip/trip-queries";
import { destination, origin, vehicleLabel } from "@/lib/demo-data/trips";

export async function generateStaticParams() {
  const trips = await getTrips();
  return trips.map((trip) => ({ id: trip.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/loads/[id]">): Promise<Metadata> {
  const trip = await getTrip((await params).id);
  const from = origin(trip).place.label;
  const to = destination(trip).place.label;
  return {
    title: `${from} to ${to} · ${trip.driver} · Haulr`,
    description: `Book space on ${trip.driver}’s ${vehicleLabel(trip.vehicle).toLowerCase()} from ${from} to ${to}.`,
  };
}

export default function TripPage({ params }: PageProps<"/loads/[id]">) {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<TripDetailSkeleton />}>
        {params.then(({ id }) => (
          <TripDetail id={id} />
        ))}
      </Suspense>
    </main>
  );
}
