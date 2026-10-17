import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Panel } from "@/components/ui/data-display";
import { PageHeader } from "@/components/ui/page-header";
import { SectionTitle } from "@/features/admin/components/charts/section";
import { ExportReportButton } from "@/features/admin/components/overview/export-report-button";
import { LiveActivity } from "@/features/admin/components/overview/live-activity";
import { NeedsAttention } from "@/features/admin/components/overview/needs-attention";
import {
  BookingValueChart,
  CategoryDonut,
} from "@/features/admin/components/overview/overview-charts";
import { OverviewKpis } from "@/features/admin/components/overview/overview-kpis";
import {
  TopDrivers,
  TopRoutes,
} from "@/features/admin/components/overview/top-tables";
import { adminUser } from "@/lib/demo-data/admin/admin-user";

export const metadata: Metadata = { title: "Overview" };

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Good morning, ${adminUser.firstName}`}
        description="Here’s how Haulr is doing this month."
        action={
          <div className="flex gap-2">
            <ExportReportButton />
            <Link
              href="/admin/analytics"
              className={buttonVariants({ variant: "default" })}
            >
              View analytics
            </Link>
          </div>
        }
      />

      <section aria-label="Key numbers" className="flex flex-col gap-4 -mt-6">
        <OverviewKpis />
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel className="flex flex-col gap-6 lg:col-span-2">
          <SectionTitle
            title="Booking value by day"
            description="October 1–17 · weekends run lighter"
          />
          <BookingValueChart />
        </Panel>
        <Panel className="flex flex-col gap-6">
          <SectionTitle
            title="Bookings by category"
            description="Share of bookings this month"
          />
          <CategoryDonut />
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <SectionTitle title="Needs attention" />
          <NeedsAttention />
        </Panel>
        <Panel className="flex flex-col gap-5">
          <SectionTitle
            title="Live activity"
            action={
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            }
          />
          <LiveActivity />
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <SectionTitle title="Top routes this month" />
          <TopRoutes />
        </Panel>
        <Panel className="flex flex-col gap-3">
          <SectionTitle title="Top drivers this month" />
          <TopDrivers />
        </Panel>
      </div>
    </div>
  );
}
