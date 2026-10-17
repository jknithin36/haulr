import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ReportsView } from "@/features/admin/components/reports/reports-view";

export const metadata: Metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Content and users flagged by the community or by our system."
      />
      <ReportsView />
    </>
  );
}
