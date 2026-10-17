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
import type { Place } from "@/lib/demo-data/places";

function FitPoints({ points }: { points: Place[] }) {
  const { map, isLoaded } = useMap();
  const key = points.map((p) => p.code).join("-");

  // biome-ignore lint/correctness/useExhaustiveDependencies: refit when the stops change.
  useEffect(() => {
    if (!map || !isLoaded || points.length < 2) return;
    const bounds = new LngLatBounds();
    for (const p of points) bounds.extend([p.lng, p.lat]);
    map.fitBounds(bounds, { padding: 72, maxZoom: 8, duration: 0 });
  }, [map, isLoaded, key]);

  return null;
}

function Legs({ points }: { points: Place[] }) {
  const { resolvedTheme } = useMap();
  const data = points.slice(1).map((to, i) => ({
    id: `leg-${i}`,
    from: [points[i].lng, points[i].lat] as [number, number],
    to: [to.lng, to.lat] as [number, number],
  }));
  return (
    <MapArc
      id="trip"
      data={data}
      curvature={0.15}
      interactive={false}
      paint={{
        "line-color": resolvedTheme === "dark" ? "#e5e5e5" : "#171717",
        "line-width": 2.5,
        "line-opacity": 0.85,
      }}
    />
  );
}

/** Start, stops in between, and the end of a trip, framed to fit. */
export function ShareTripMap({ points }: { points: Place[] }) {
  const last = points.length - 1;
  return (
    <MapView center={[-97, 38.5]} zoom={3}>
      <MapControls position="bottom-right" />
      <FitPoints points={points} />
      <Legs points={points} />
      {points.map((p, i) => (
        <MapMarker key={`${p.code}-${i}`} longitude={p.lng} latitude={p.lat}>
          <MarkerContent>
            {i === 0 ? (
              <span className="block size-3.5 rounded-full border-[3px] border-foreground bg-background shadow" />
            ) : i === last ? (
              <span className="block size-3.5 rounded-full border-[3px] border-background bg-foreground shadow" />
            ) : (
              <span className="block size-2.5 rounded-full border-2 border-background bg-foreground shadow" />
            )}
            <MarkerLabel className="rounded-md bg-background px-1.5 py-0.5 text-xs shadow-sm">
              {p.label}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>
      ))}
    </MapView>
  );
}
