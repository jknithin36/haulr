import { TripBrowserClient } from "@/features/trip/components/trip-browser-client";
import { getTrips } from "@/features/trip/trip-queries";

/** Server half of the marketplace: loads the trips, then hands them to the client UI. */
export async function TripBrowser() {
  const trips = await getTrips();
  return <TripBrowserClient trips={trips} />;
}

export function TripBrowserSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-8 pt-6">
      <div className="flex max-w-2xl flex-col gap-3">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="h-10 w-2/3 rounded bg-muted" />
        <div className="h-6 w-1/2 rounded bg-muted" />
      </div>
      <div className="h-14 rounded-2xl bg-muted/50" />
      <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="h-96 rounded-2xl bg-muted/50 max-lg:hidden" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {["a", "b", "c"].map((key) => (
            <div key={key} className="h-96 rounded-2xl bg-muted/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
