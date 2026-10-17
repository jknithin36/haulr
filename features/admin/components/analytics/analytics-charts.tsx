"use client";

import { DailyAreaChart } from "@/features/admin/components/charts/area-chart";
import { ColumnChart } from "@/features/admin/components/charts/column-chart";
import {
  activeUsersByWeek,
  signupsByDay,
} from "@/lib/demo-data/admin/analytics";
import { formatCompact, formatNumber } from "@/lib/format";

export function SignupsChart() {
  return (
    <DailyAreaChart
      data={signupsByDay}
      label="New signups"
      format={(value) => `${formatNumber(value)} signups`}
      tickFormat={formatNumber}
      ticks={[0, 50, 100, 150, 200]}
      summary={`New signups per day, October 1 to 17: ${signupsByDay
        .map((d) => `${d.day} ${d.value}`)
        .join(", ")}.`}
    />
  );
}

export function ActiveUsersChart() {
  return (
    <ColumnChart
      data={activeUsersByWeek}
      label="Active users"
      emphasis="last"
      format={(value) => `${formatNumber(value)} active users`}
      labelFormat={formatNumber}
      tickFormat={formatCompact}
      ticks={[0, 5000, 10000, 15000]}
      summary={`Active users per week: ${activeUsersByWeek
        .map((w) => `${w.title} ${formatNumber(w.value)}`)
        .join(", ")}.`}
    />
  );
}
