import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getAdminShipment,
  getAdminShipmentIds,
} from "@/features/admin/admin-queries";
import {
  ShipmentDetail,
  ShipmentDetailSkeleton,
} from "@/features/admin/components/shipments/shipment-detail";

export async function generateStaticParams() {
  const ids = await getAdminShipmentIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/admin/shipments/[id]">): Promise<Metadata> {
  const { id } = await params;
  const { shipment } = await getAdminShipment(id);
  return { title: `${shipment.id} · Shipments` };
}

export default function AdminShipmentPage({
  params,
}: PageProps<"/admin/shipments/[id]">) {
  return (
    <Suspense fallback={<ShipmentDetailSkeleton />}>
      {params.then(({ id }) => (
        <ShipmentDetail id={id} />
      ))}
    </Suspense>
  );
}
