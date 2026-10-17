import { getDispute } from "@/features/admin/admin-queries";
import { DisputeDetailClient } from "@/features/admin/components/disputes/dispute-detail-client";

export async function DisputeDetail({ id }: { id: string }) {
  const dispute = await getDispute(id);
  return <DisputeDetailClient dispute={dispute} />;
}

export function DisputeDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-7 w-24 rounded bg-muted" />
      <div className="h-9 w-2/3 rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-96 rounded-2xl bg-muted/60" />
        <div className="h-96 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
