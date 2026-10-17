import type { Metadata } from "next";
import { Panel } from "@/components/ui/data-display";
import { PageHeader } from "@/components/ui/page-header";
import { SectionTitle } from "@/features/admin/components/charts/section";
import { RevenueByMonthChart } from "@/features/admin/components/revenue/revenue-chart";
import { RevenueSummary } from "@/features/admin/components/revenue/revenue-summary";
import {
  FeesByPlan,
  Subscriptions,
} from "@/features/admin/components/revenue/revenue-tables";

export const metadata: Metadata = { title: "Revenue" };

export default function AdminRevenuePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Revenue"
        description="What Haulr earns from booking fees and plans."
      />

      <section aria-label="Summary" className="-mt-6 flex flex-col gap-4">
        <RevenueSummary />
      </section>

      <Panel className="flex flex-col gap-6">
        <SectionTitle
          title="Revenue by month"
          description="May to October · October is month to date"
        />
        <RevenueByMonthChart />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-5">
        <Panel className="flex flex-col gap-3 lg:col-span-3">
          <SectionTitle title="Fees by plan" />
          <FeesByPlan />
        </Panel>
        <Panel className="flex flex-col gap-3 lg:col-span-2">
          <SectionTitle title="Subscriptions" />
          <Subscriptions />
        </Panel>
      </div>
    </div>
  );
}
