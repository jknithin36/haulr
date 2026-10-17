"use client";

import { LngLatBounds } from "maplibre-gl";
import Link from "next/link";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  MapArc,
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { RouteLabel } from "@/components/ui/route-label";
import {
  destination,
  formatSchedule,
  origin,
  pinPrice,
  priceLabel,
  stopsText,
  type Trip,
  vehicleLabel,
} from "@/lib/demo-data/trips";
import { cn } from "@/lib/utils";

/** Keeps every visible trip in frame when the results change. */
function FitToTrips({ trips }: { trips: Trip[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || trips.length === 0) return;
    const bounds = new LngLatBounds();
    for (const trip of trips) {
      for (const s of trip.stops) bounds.extend([s.place.lng, s.place.lat]);
    }
    map.fitBounds(bounds, { padding: 64, maxZoom: 6, duration: 600 });
  }, [map, isLoaded, trips]);

  return null;
}

function Routes({ trips }: { trips: Trip[] }) {
  const { resolvedTheme } = useMap();
  const color = resolvedTheme === "dark" ? "#e5e5e5" : "#171717";

  return (
    <MapArc
      id="trip-routes"
      data={trips.map((trip) => ({
        id: trip.id,
        from: [origin(trip).place.lng, origin(trip).place.lat] as [
          number,
          number,
        ],
        to: [destination(trip).place.lng, destination(trip).place.lat] as [
          number,
          number,
        ],
      }))}
      curvature={0.25}
      interactive={false}
      paint={{
        "line-color": color,
        "line-width": 1.5,
        "line-opacity": 0.55,
        "line-dasharray": [2, 2],
      }}
    />
  );
}

/** Every trip in the results as a price pin, with its route drawn as an arc. */
export function TripsMap({ trips }: { trips: Trip[] }) {
  return (
    <div className="h-[640px] overflow-hidden rounded-2xl bg-muted/50">
      <MapView center={[-97, 38.5]} zoom={3.3}>
        <MapControls position="bottom-right" />
        <FitToTrips trips={trips} />
        <Routes trips={trips} />

        {trips.map((trip) => {
          const to = destination(trip).place;
          return (
            <MapMarker
              key={`${trip.id}-to`}
              longitude={to.lng}
              latitude={to.lat}
            >
              <MarkerContent>
                <span className="block size-2.5 rounded-full border-2 border-foreground bg-background" />
              </MarkerContent>
            </MapMarker>
          );
        })}

        {trips.map((trip) => {
          const from = origin(trip).place;
          const to = destination(trip).place;
          return (
            <MapMarker key={trip.id} longitude={from.lng} latitude={from.lat}>
              <MarkerContent>
                <button
                  type="button"
                  aria-label={`${trip.driver}’s trip, ${from.label} to ${to.label}`}
                  className="flex h-7 cursor-pointer items-center rounded-full bg-foreground px-2.5 text-xs font-semibold text-background tabular-nums shadow-md"
                >
                  {pinPrice(trip)}
                </button>
              </MarkerContent>
              <MarkerPopup className="w-72 max-w-none p-4">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">
                      {vehicleLabel(trip.vehicle)} · {trip.driver}
                    </p>
                    <p className="flex font-semibold">
                      <RouteLabel from={from.label} to={to.label} />
                    </p>
                    <p className="text-muted-foreground">{stopsText(trip)}</p>
                    <p className="text-muted-foreground">
                      {formatSchedule(trip)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-heading font-semibold">
                      {priceLabel(trip)}
                    </p>
                    <Link
                      href={`/loads/${trip.id}`}
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      View trip
                    </Link>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
      </MapView>
    </div>
  );
}
