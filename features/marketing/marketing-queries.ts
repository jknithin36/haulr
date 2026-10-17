import "server-only";
import { truckSpaces } from "@/lib/demo-data/truck-spaces";

// Reads go through this file so the in-memory demo data can be swapped for a
// database without touching the components.

/** Trips with space to share, for the home page teaser. */
export async function getTruckSpaces() {
  return truckSpaces;
}
