import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PaymentsView } from "@/features/dashboard/components/payments/payments-view";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Money you’ve paid and money you’ve earned."
      />
      <PaymentsView />
    </>
  );
}
