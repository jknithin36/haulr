import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DisputesView } from "@/features/admin/components/disputes/disputes-view";

export const metadata: Metadata = { title: "Disputes" };

export default function AdminDisputesPage() {
  return (
    <>
      <PageHeader
        title="Disputes"
        description="Problems between shippers and drivers. Target: resolve within 72 hours."
      />
      <DisputesView />
    </>
  );
}
