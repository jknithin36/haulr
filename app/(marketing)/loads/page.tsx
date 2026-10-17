import type { Metadata } from "next";
import { Suspense } from "react";
import {
  TripBrowser,
  TripBrowserSkeleton,
} from "@/features/trip/components/trip-browser";

export const metadata: Metadata = {
  title: "Book truck space · Haulr",
  description:
    "These drivers are already heading your way. Reserve a spot and often pay less.",
};

export default function TripsPage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<TripBrowserSkeleton />}>
        <TripBrowser />
      </Suspense>
    </main>
  );
}
