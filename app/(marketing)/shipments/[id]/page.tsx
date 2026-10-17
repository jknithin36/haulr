import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ShipmentDetail,
  ShipmentDetailSkeleton,
} from "@/features/shipment/components/shipment-detail";
import {
  getShipment,
  getShipments,
} from "@/features/shipment/shipment-queries";

export async function generateStaticParams() {
  const shipments = await getShipments();
  return shipments.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shipments/[id]">): Promise<Metadata> {
  const { id } = await params;
  const shipment = await getShipment(id);
  return {
    title: `${shipment.item} · ${shipment.from.label} to ${shipment.to.label} · Haulr`,
    description: `Send an offer to ship a ${shipment.item} from ${shipment.from.label} to ${shipment.to.label}.`,
  };
}

export default function ShipmentPage({ params }: PageProps<"/shipments/[id]">) {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<ShipmentDetailSkeleton />}>
        {params.then(({ id }) => (
          <ShipmentDetail id={id} />
        ))}
      </Suspense>
    </main>
  );
}
