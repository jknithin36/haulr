// MapLibre loads its web worker from a URL (see components/ui/map.tsx), so the
// worker must be served from public/. It is copied from node_modules before
// dev and build instead of being committed, which keeps it in sync with the
// installed maplibre-gl version.
import { copyFileSync } from "node:fs";

copyFileSync(
  "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
  "public/maplibre-gl-worker.mjs",
);
