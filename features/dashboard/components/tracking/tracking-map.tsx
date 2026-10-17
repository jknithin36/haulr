"use client";

import { DeliveryTruck02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useMemo } from "react";
import {
  MapControls,
  MapMarker,
  MapRoute,
  Map as MapView,
  MarkerContent,
  MarkerLabel,
  useMap,
} from "@/components/ui/map";

type LngLat = [number, number];

const DASH: [number, number] = [1.5, 1.5];

function FitRoute({ points }: { points: LngLat[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    const bounds = new LngLatBounds();
    for (const p of points) bounds.extend(p);
    map.fitBounds(bounds, { padding: 56, maxZoom: 7, duration: 0 });
  }, [map, isLoaded, points]);

  return null;
}

function Lines({
  traveled,
  remaining,
}: {
  traveled: LngLat[];
  remaining: LngLat[];
}) {
  const { resolvedTheme } = useMap();
  const dark = resolvedTheme === "dark";
  return (
    <>
      <MapRoute
        id="remaining"
        coordinates={remaining}
        color={dark ? "#737373" : "#a3a3a3"}
        width={3}
        opacity={0.6}
        dashArray={DASH}
        interactive={false}
      />
      <MapRoute
        id="traveled"
        coordinates={traveled}
        color={dark ? "#f5f5f5" : "#171717"}
        width={3.5}
        opacity={0.9}
        interactive={false}
      />
    </>
  );
}

function EndPoint({
  at,
  label,
  filled,
}: {
  at: LngLat;
  label: string;
  filled?: boolean;
}) {
  return (
    <MapMarker longitude={at[0]} latitude={at[1]}>
      <MarkerContent>
        <span
          className={
            filled
              ? "block size-3.5 rounded-full border-[3px] border-background bg-foreground shadow"
              : "block size-3.5 rounded-full border-[3px] border-foreground bg-background shadow"
          }
        />
        <MarkerLabel className="rounded-md bg-background px-1.5 py-0.5 text-xs shadow-sm">
          {label}
        </MarkerLabel>
      </MarkerContent>
    </MapMarker>
  );
}

/** Full LA to NYC route, with the part already driven drawn darker. */
export function TrackingMap({
  traveled,
  remaining,
  truck,
  fromLabel,
  toLabel,
}: {
  traveled: LngLat[];
  remaining: LngLat[];
  truck: LngLat;
  fromLabel: string;
  toLabel: string;
}) {
  const all = useMemo(() => [...traveled, ...remaining], [traveled, remaining]);
  return (
    <MapView center={[-97, 38.5]} zoom={3}>
      <MapControls position="bottom-right" />
      <FitRoute points={all} />
      <Lines traveled={traveled} remaining={remaining} />
      <EndPoint at={traveled[0]} label={fromLabel} />
      <EndPoint at={remaining[remaining.length - 1]} label={toLabel} filled />
      <MapMarker longitude={truck[0]} latitude={truck[1]}>
        <MarkerContent>
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-md">
            <HugeiconsIcon
              icon={DeliveryTruck02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </MarkerContent>
      </MapMarker>
    </MapView>
  );
}
