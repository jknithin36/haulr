import { ShipmentDetailView } from "@/features/shipment/components/shipment-detail-view";
import {
  getShipmentListing,
  getSimilarShipments,
  getViewer,
} from "@/features/shipment/shipment-queries";

/** The public listing page for one shipment. */
export async function ShipmentDetail({ id }: { id: string }) {
  const [{ shipment, detail, offers }, viewer] = await Promise.all([
    getShipmentListing(id),
    getViewer(),
  ]);
  const similar = await getSimilarShipments(shipment);

  return (
    <ShipmentDetailView
      shipment={shipment}
      detail={detail}
      offers={offers}
      similar={similar}
      viewer={viewer}
    />
  );
}

export function ShipmentDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-6 pt-6">
      <div className="h-5 w-64 rounded bg-muted" />
      <div className="h-72 rounded-2xl bg-muted/60 md:h-105" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-2/3 rounded bg-muted" />
          <div className="h-5 w-1/2 rounded bg-muted" />
        </div>
        <div className="h-96 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
