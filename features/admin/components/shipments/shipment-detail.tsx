import { getAdminShipment } from "@/features/admin/admin-queries";
import { ShipmentDetailClient } from "@/features/admin/components/shipments/shipment-detail-client";

export async function ShipmentDetail({ id }: { id: string }) {
  const { shipment, detail } = await getAdminShipment(id);
  return <ShipmentDetailClient shipment={shipment} detail={detail} />;
}

export function ShipmentDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="h-9 w-72 rounded bg-muted" />
      <div className="h-24 rounded-2xl bg-muted/60" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-96 rounded-2xl bg-muted/60" />
        <div className="h-72 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
