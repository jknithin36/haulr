"use client";

import { LngLatBounds } from "maplibre-gl";
import { useEffect } from "react";
import {
  MapArc,
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerLabel,
  useMap,
} from "@/components/ui/map";
import type { TripStop } from "@/lib/demo-data/trips";

function FitStops({ stops }: { stops: TripStop[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    const bounds = new LngLatBounds();
    for (const s of stops) bounds.extend([s.place.lng, s.place.lat]);
    map.fitBounds(bounds, { padding: 56, maxZoom: 8, duration: 0 });
  }, [map, isLoaded, stops]);

  return null;
}

function Legs({ stops }: { stops: TripStop[] }) {
  const { resolvedTheme } = useMap();
  return (
    <MapArc
      id="trip-legs"
      data={stops.slice(1).map((s, i) => ({
        id: `leg-${i}`,
        from: [stops[i].place.lng, stops[i].place.lat] as [number, number],
        to: [s.place.lng, s.place.lat] as [number, number],
      }))}
      curvature={0.12}
      interactive={false}
      paint={{
        "line-color": resolvedTheme === "dark" ? "#e5e5e5" : "#171717",
        "line-width": 2.5,
        "line-opacity": 0.85,
      }}
    />
  );
}

/** Every stop on the trip, joined leg by leg. */
export function TripRouteMapCanvas({ stops }: { stops: TripStop[] }) {
  const last = stops.length - 1;
  return (
    <MapView center={[-97, 38.5]} zoom={3}>
      <MapControls position="bottom-right" />
      <FitStops stops={stops} />
      <Legs stops={stops} />
      {stops.map((s, i) => (
        <MapMarker
          key={s.place.code}
          longitude={s.place.lng}
          latitude={s.place.lat}
        >
          <MarkerContent>
            {i === 0 ? (
              <span className="block size-3.5 rounded-full border-[3px] border-foreground bg-background shadow" />
            ) : i === last ? (
              <span className="block size-3.5 rounded-full border-[3px] border-background bg-foreground shadow" />
            ) : (
              <span className="block size-2.5 rounded-full border-2 border-foreground bg-background shadow" />
            )}
            <MarkerLabel className="rounded-md bg-background px-1.5 py-0.5 text-xs shadow-sm">
              {s.place.label}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>
      ))}
    </MapView>
  );
}
