import type { Metadata } from "next";
import { Suspense } from "react";
import { getDispute, getDisputeIds } from "@/features/admin/admin-queries";
import {
  DisputeDetail,
  DisputeDetailSkeleton,
} from "@/features/admin/components/disputes/dispute-detail";

export async function generateStaticParams() {
  const ids = await getDisputeIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/admin/disputes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const dispute = await getDispute(id);
  return { title: `${dispute.id} · ${dispute.job.item}` };
}

export default function AdminDisputePage({
  params,
}: PageProps<"/admin/disputes/[id]">) {
  return (
    <Suspense fallback={<DisputeDetailSkeleton />}>
      {params.then(({ id }) => (
        <DisputeDetail id={id} />
      ))}
    </Suspense>
  );
}
