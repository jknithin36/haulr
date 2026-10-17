import { PaymentsViewClient } from "@/features/dashboard/components/payments/payments-view-client";
import { getPayments } from "@/features/dashboard/dashboard-queries";

export async function PaymentsView() {
  const payments = await getPayments();
  return <PaymentsViewClient {...payments} />;
}
