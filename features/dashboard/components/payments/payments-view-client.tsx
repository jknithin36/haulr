"use client";

import { useState } from "react";
import { Panel, StatCard } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import { EarningsChart } from "@/features/dashboard/components/payments/earnings-chart";
import { PayoutSettings } from "@/features/dashboard/components/payments/payout-settings";
import {
  EarningsTable,
  PaymentsMadeTable,
} from "@/features/dashboard/components/payments/tables";
import { SectionHeading } from "@/features/dashboard/components/settings/section";
import {
  type Earning,
  type EarningsSummary,
  formatMoney,
  type MonthlyEarning,
  type PaymentMade,
  type PayoutSettingsData,
} from "@/lib/demo-data/dashboard/payments";

export function PaymentsViewClient({
  summary,
  monthlyEarnings,
  earnings,
  paymentsMade,
  payout,
}: {
  summary: EarningsSummary;
  monthlyEarnings: MonthlyEarning[];
  earnings: Earning[];
  paymentsMade: PaymentMade[];
  payout: PayoutSettingsData;
}) {
  const [available, setAvailable] = useState(summary.available);

  return (
    <Tabs defaultValue="earnings" className="gap-6">
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        <DashboardTabsList>
          <TabsTrigger value="earnings" className="px-3">
            Earnings
          </TabsTrigger>
          <TabsTrigger value="payments" className="px-3">
            Payments made
          </TabsTrigger>
          <TabsTrigger value="payout" className="px-3">
            Payout settings
          </TabsTrigger>
        </DashboardTabsList>
      </div>

      <TabsContent value="earnings" className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Available for payout"
            value={formatMoney(available)}
          />
          <StatCard label="Pending" value={formatMoney(summary.pending)} />
          <StatCard label="This month" value={formatMoney(summary.thisMonth)} />
          <StatCard label="All time" value={formatMoney(summary.allTime)} />
        </div>

        <Panel className="flex flex-col gap-6">
          <SectionHeading
            title="Earnings by month"
            description="May to October"
          />
          <EarningsChart monthlyEarnings={monthlyEarnings} />
        </Panel>

        <section className="flex flex-col gap-4">
          <SectionHeading title="Earnings history" />
          <EarningsTable earnings={earnings} />
        </section>
      </TabsContent>

      <TabsContent value="payments" className="flex flex-col gap-4">
        <SectionHeading
          title="Payments made"
          description="What you’ve paid for your own shipments."
        />
        <PaymentsMadeTable payments={paymentsMade} />
      </TabsContent>

      <TabsContent value="payout">
        <PayoutSettings
          settings={payout}
          available={available}
          onWithdraw={() => setAvailable(0)}
        />
      </TabsContent>
    </Tabs>
  );
}
