"use client";

import { DailyAreaChart } from "@/features/admin/components/charts/area-chart";
import { DonutChart } from "@/features/admin/components/charts/donut-chart";
import {
  bookingCategories,
  bookingValueByDay,
  totalBookings,
} from "@/lib/demo-data/admin/overview";
import { formatCompact, formatNumber, formatUsd } from "@/lib/format";

export function BookingValueChart() {
  return (
    <DailyAreaChart
      data={bookingValueByDay}
      label="Booking value"
      format={formatUsd}
      tickFormat={(value) => (value === 0 ? "$0" : `$${formatCompact(value)}`)}
      ticks={[0, 10000, 20000, 30000]}
      summary={`Booking value by day, October 1 to 17: ${bookingValueByDay
        .map((d) => `${d.day} ${formatUsd(d.value)}`)
        .join(", ")}.`}
    />
  );
}

export function CategoryDonut() {
  return (
    <DonutChart
      data={bookingCategories}
      centerValue={formatNumber(totalBookings)}
      centerLabel="bookings"
    />
  );
}
