import type { Metadata } from "next";
import { Panel } from "@/components/ui/data-display";
import {
  ActiveUsersChart,
  SignupsChart,
} from "@/features/admin/components/analytics/analytics-charts";
import { AnalyticsFilters } from "@/features/admin/components/analytics/analytics-filters";
import {
  TopStates,
  TrafficSources,
} from "@/features/admin/components/analytics/analytics-tables";
import { Funnel } from "@/features/admin/components/analytics/funnel";
import { MarketplaceHealth } from "@/features/admin/components/analytics/marketplace-health";
import { UserSplit } from "@/features/admin/components/analytics/user-split";
import { SectionTitle } from "@/features/admin/components/charts/section";

export const metadata: Metadata = { title: "Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-balance font-semibold text-2xl tracking-tight md:text-3xl">
          Analytics
        </h1>
        <AnalyticsFilters />
      </div>

      <Panel className="flex flex-col gap-6">
        <SectionTitle
          title="Marketplace funnel"
          description="Month to date · bars show how many moved on from the step above"
        />
        <Funnel />
      </Panel>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Marketplace health" />
        <MarketplaceHealth />
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Users" />
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel className="flex flex-col gap-6">
            <SectionTitle
              title="New signups per day"
              description="2,147 since October 1"
            />
            <SignupsChart />
          </Panel>
          <Panel className="flex flex-col gap-6">
            <SectionTitle
              title="Active users per week"
              description="Last 8 weeks"
            />
            <ActiveUsersChart />
          </Panel>
        </div>
        <Panel className="flex flex-col gap-6">
          <SectionTitle
            title="Shippers vs drivers"
            description="Everyone with an account, by what they use Haulr for"
          />
          <UserSplit />
        </Panel>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <SectionTitle title="Top states by bookings" />
          <TopStates />
        </Panel>
        <Panel className="flex flex-col gap-3">
          <SectionTitle title="Traffic sources" />
          <TrafficSources />
        </Panel>
      </div>
    </div>
  );
}
