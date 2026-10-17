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

function FitRoute({ from, to }: { from: Place; to: Place }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    const bounds = new LngLatBounds()
      .extend([from.lng, from.lat])
      .extend([to.lng, to.lat]);
    map.fitBounds(bounds, { padding: 72, maxZoom: 8, duration: 0 });
  }, [map, isLoaded, from, to]);

  return null;
}

function RouteLine({ from, to }: { from: Place; to: Place }) {
  const { resolvedTheme } = useMap();
  return (
    <MapArc
      id="route"
      data={[{ id: "route", from: [from.lng, from.lat], to: [to.lng, to.lat] }]}
      curvature={0.2}
      interactive={false}
      paint={{
        "line-color": resolvedTheme === "dark" ? "#e5e5e5" : "#171717",
        "line-width": 2.5,
        "line-opacity": 0.85,
      }}
    />
  );
}

/** Pickup → dropoff on a map, framed to fit both ends. */
export function RouteMap({ from, to }: { from: Place; to: Place }) {
  return (
    <MapView center={[-97, 38.5]} zoom={3}>
      <MapControls position="bottom-right" />
      <FitRoute from={from} to={to} />
      <RouteLine from={from} to={to} />
      <MapMarker longitude={from.lng} latitude={from.lat}>
        <MarkerContent>
          <span className="block size-3.5 rounded-full border-[3px] border-foreground bg-background shadow" />
          <MarkerLabel className="rounded-md bg-background px-1.5 py-0.5 text-xs shadow-sm">
            {from.label}
          </MarkerLabel>
        </MarkerContent>
      </MapMarker>
      <MapMarker longitude={to.lng} latitude={to.lat}>
        <MarkerContent>
          <span className="block size-3.5 rounded-full border-[3px] border-background bg-foreground shadow" />
          <MarkerLabel className="rounded-md bg-background px-1.5 py-0.5 text-xs shadow-sm">
            {to.label}
          </MarkerLabel>
        </MarkerContent>
      </MapMarker>
    </MapView>
  );
}
