"use client";

import {
  MapArc,
  MapMarker,
  Map as MapView,
  MarkerContent,
  useMap,
} from "@/components/ui/map";
import { city, type Place } from "@/lib/demo-data/places";

// Label-free basemaps so only the routes read.
const styles = {
  light:
    "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
};

/** Lower 48, framed with a little room around the coasts. */
const usBounds: [[number, number], [number, number]] = [
  [-125, 24],
  [-66.5, 49.5],
];

const routes: [Place, Place][] = [
  [city.losAngeles, city.newYork],
  [city.seattle, city.chicago],
  [city.dallas, city.atlanta],
  [city.miami, city.boston],
  [city.denver, city.phoenix],
  [city.houston, city.nashville],
];

const stops = [...new Map(routes.flat().map((p) => [p.code, p])).values()];

function Routes() {
  const { resolvedTheme } = useMap();
  return (
    <MapArc
      id="signup-routes"
      interactive={false}
      curvature={0.22}
      data={routes.map(([from, to]) => ({
        id: `${from.code}-${to.code}`,
        from: [from.lng, from.lat] as [number, number],
        to: [to.lng, to.lat] as [number, number],
      }))}
      paint={{
        "line-color": resolvedTheme === "dark" ? "#e5e5e5" : "#171717",
        "line-width": 1.5,
        "line-opacity": 0.4,
      }}
    />
  );
}

/** Decorative, non-interactive map of the US with routes between cities. */
export function SignupMapCanvas() {
  return (
    <MapView
      styles={styles}
      bounds={usBounds}
      // Leave room for the heading above and the benefits list below.
      fitBoundsOptions={{
        padding: { top: 100, bottom: 170, left: 32, right: 32 },
      }}
      interactive={false}
      attributionControl={false}
    >
      <Routes />
      {stops.map((p) => (
        <MapMarker key={p.code} longitude={p.lng} latitude={p.lat}>
          <MarkerContent className="cursor-default">
            <span className="block size-1.5 rounded-full bg-foreground/70 ring-2 ring-background/80" />
          </MarkerContent>
        </MapMarker>
      ))}
    </MapView>
  );
}
