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
import { categoryBadge, type Shipment } from "@/lib/demo-data/shipments";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Keeps every visible route in frame when the results change. */
function FitToShipments({ shipments }: { shipments: Shipment[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || shipments.length === 0) return;
    const bounds = new LngLatBounds();
    for (const s of shipments) {
      bounds.extend([s.from.lng, s.from.lat]);
      bounds.extend([s.to.lng, s.to.lat]);
    }
    map.fitBounds(bounds, { padding: 64, maxZoom: 6, duration: 600 });
  }, [map, isLoaded, shipments]);

  return null;
}

function Routes({ shipments }: { shipments: Shipment[] }) {
  const { resolvedTheme } = useMap();
  const color = resolvedTheme === "dark" ? "#e5e5e5" : "#171717";

  return (
    <MapArc
      id="shipment-routes"
      data={shipments.map((s) => ({
        id: s.id,
        from: [s.from.lng, s.from.lat] as [number, number],
        to: [s.to.lng, s.to.lat] as [number, number],
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

export function ShipmentsMap({ shipments }: { shipments: Shipment[] }) {
  return (
    <div className="h-[640px] overflow-hidden rounded-2xl bg-muted/50">
      <MapView center={[-97, 38.5]} zoom={3.3}>
        <MapControls position="bottom-right" />
        <FitToShipments shipments={shipments} />
        <Routes shipments={shipments} />

        {shipments.map((s) => (
          <MapMarker
            key={`${s.id}-to`}
            longitude={s.to.lng}
            latitude={s.to.lat}
          >
            <MarkerContent>
              <span className="block size-2.5 rounded-full border-2 border-foreground bg-background" />
            </MarkerContent>
          </MapMarker>
        ))}

        {shipments.map((s) => (
          <MapMarker key={s.id} longitude={s.from.lng} latitude={s.from.lat}>
            <MarkerContent>
              <button
                type="button"
                aria-label={`${s.item}, ${s.from.label} to ${s.to.label}`}
                className="flex h-7 cursor-pointer items-center rounded-full bg-foreground px-2.5 text-xs font-semibold text-background tabular-nums shadow-md transition-transform hover:scale-105"
              >
                {formatUsd(s.budget)}
              </button>
            </MarkerContent>
            <MarkerPopup className="w-64 max-w-none p-4">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    {categoryBadge(s.category)}
                  </p>
                  <p className="font-semibold">{s.item}</p>
                  <RouteLabel
                    from={s.from.label}
                    to={s.to.label}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-heading text-lg font-semibold tabular-nums">
                    {formatUsd(s.budget)}
                  </p>
                  <Link
                    href={`/shipments/${s.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    View shipment
                  </Link>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </MapView>
    </div>
  );
}
