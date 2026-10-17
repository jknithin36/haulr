"use client";

import { ColumnChart } from "@/features/admin/components/charts/column-chart";
import { revenueByMonth } from "@/lib/demo-data/admin/revenue";
import { formatCompact, formatUsd } from "@/lib/format";

export function RevenueByMonthChart() {
  return (
    <ColumnChart
      data={revenueByMonth}
      label="Revenue"
      format={formatUsd}
      tickFormat={(value) => (value === 0 ? "$0" : `$${formatCompact(value)}`)}
      ticks={[0, 20000, 40000, 60000, 80000]}
      summary={`Revenue by month: ${revenueByMonth
        .map((m) => `${m.title} ${formatUsd(m.value)}`)
        .join(", ")}.`}
    />
  );
}
