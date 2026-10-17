"use client";

import dynamic from "next/dynamic";

// MapLibre needs the browser, so the map only loads on the client.
export const LazyTrackingMap = dynamic(
  () =>
    import("@/features/dashboard/components/tracking/tracking-map").then(
      (m) => m.TrackingMap,
    ),
  { ssr: false, loading: () => <div className="size-full bg-background" /> },
);
