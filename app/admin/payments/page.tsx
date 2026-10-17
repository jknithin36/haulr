import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PaymentsView } from "@/features/admin/components/payments/payments-view";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Money coming in from shippers and going out to drivers."
      />
      <PaymentsView />
    </>
  );
}
