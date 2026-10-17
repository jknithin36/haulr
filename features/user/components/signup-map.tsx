"use client";

import dynamic from "next/dynamic";

// MapLibre needs the browser.
const SignupMapCanvas = dynamic(
  () =>
    import("@/features/user/components/signup-map-canvas").then(
      (m) => m.SignupMapCanvas,
    ),
  { ssr: false },
);

/** Full-bleed map that sits behind the signup panel's content. */
export function SignupMap() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <SignupMapCanvas />
      <p className="absolute top-4 right-5 text-[10px] text-muted-foreground/70">
        © CARTO © OpenStreetMap
      </p>
    </div>
  );
}
