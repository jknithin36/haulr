import "server-only";
import { notFound } from "next/navigation";
import {
  getOffers,
  getShipmentDetail,
  viewer,
} from "@/lib/demo-data/shipment-details";
import { type Shipment, shipments } from "@/lib/demo-data/shipments";

// Reads go through this file so the in-memory demo data can be swapped for a
// database without touching the components. The data never changes at
// runtime, so there's nothing to cache or tag yet.

export async function getShipments() {
  return shipments;
}

/** The shipment with this id, or the not-found page. */
export async function getShipment(id: string) {
  const shipment = shipments.find((s) => s.id === id);
  if (!shipment) notFound();
  return shipment;
}

/** Everything the listing page shows: the shipment, its details, and its offers. */
export async function getShipmentListing(id: string) {
  const shipment = await getShipment(id);
  return {
    shipment,
    detail: getShipmentDetail(shipment),
    offers: getOffers(shipment),
  };
}

/**
 * The three closest listings to this one: same category first, then the
 * nearest pickup and dropoff.
 */
export async function getSimilarShipments(shipment: Shipment) {
  return shipments
    .filter((other) => other.id !== shipment.id)
    .map((other) => ({
      other,
      score:
        (other.category === shipment.category ? 0 : 1000) +
        Math.hypot(
          other.from.lat - shipment.from.lat,
          other.from.lng - shipment.from.lng,
        ) +
        Math.hypot(
          other.to.lat - shipment.to.lat,
          other.to.lng - shipment.to.lng,
        ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ other }) => other);
}

/** The person browsing, for the sample data. */
export async function getViewer() {
  return viewer;
}
