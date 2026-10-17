import "server-only";
import { notFound } from "next/navigation";
import { destination, origin, type Trip, trips } from "@/lib/demo-data/trips";

// Reads go through this file so the in-memory demo data can be swapped for a
// database without touching the components. The data never changes at
// runtime, so there's nothing to cache or tag yet.

export async function getTrips() {
  return trips;
}

/** The trip with this id, or the not-found page. */
export async function getTrip(id: string) {
  const trip = trips.find((t) => t.id === id);
  if (!trip) notFound();
  return trip;
}

/** Other trips, closest route first (by straight-line distance of both ends). */
export async function getOtherTrips(trip: Trip, count = 3) {
  const a = origin(trip).place;
  const b = destination(trip).place;
  return trips
    .filter((other) => other.id !== trip.id)
    .map((other) => ({
      other,
      score:
        Math.hypot(
          origin(other).place.lat - a.lat,
          origin(other).place.lng - a.lng,
        ) +
        Math.hypot(
          destination(other).place.lat - b.lat,
          destination(other).place.lng - b.lng,
        ),
    }))
    .sort((p, q) => p.score - q.score)
    .slice(0, count)
    .map(({ other }) => other);
}
