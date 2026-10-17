"use client";

import dynamic from "next/dynamic";
import type { TripStop } from "@/lib/demo-data/trips";

// MapLibre needs the browser, so the map only loads on the client.
const TripRouteMapCanvas = dynamic(
  () =>
    import("@/features/trip/components/trip-route-map-canvas").then(
      (m) => m.TripRouteMapCanvas,
    ),
  { ssr: false, loading: () => <div className="size-full bg-muted/50" /> },
);

/** Every stop on the trip, joined leg by leg. */
export function TripRouteMap({ stops }: { stops: TripStop[] }) {
  return <TripRouteMapCanvas stops={stops} />;
}
