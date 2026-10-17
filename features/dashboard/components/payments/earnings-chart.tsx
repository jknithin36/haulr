"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  formatMoney,
  type MonthlyEarning,
} from "@/lib/demo-data/dashboard/payments";
import { formatCompact } from "@/lib/format";

const chartConfig = {
  amount: { label: "Earned", color: "var(--foreground)" },
} satisfies ChartConfig;

const monthNames: Record<string, string> = {
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
};

type TooltipPayload = { payload?: MonthlyEarning }[];

function EarningsTooltip({
  active,
  payload,
  currentMonth,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  currentMonth?: string;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="grid gap-0.5 rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/10">
      <span className="text-muted-foreground">
        {monthNames[row.month] ?? row.month}
        {row.month === currentMonth && " (so far)"}
      </span>
      <span className="font-medium text-sm tabular-nums">
        {formatMoney(row.amount)}
      </span>
    </div>
  );
}

/** Monthly earnings, one foreground hue; the current month is the only solid bar. */
export function EarningsChart({
  monthlyEarnings,
}: {
  monthlyEarnings: MonthlyEarning[];
}) {
  // The newest month is still in progress.
  const currentMonth = monthlyEarnings.at(-1)?.month;
  return (
    <figure className="flex flex-col gap-4">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-56 w-full md:h-64"
      >
        <BarChart
          data={monthlyEarnings}
          margin={{ top: 24, right: 0, bottom: 0, left: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid vertical={false} strokeOpacity={0.6} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            width={44}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            ticks={[0, 1000, 2000, 3000]}
            domain={[0, 3000]}
            tickFormatter={(value: number) => `$${formatCompact(value)}`}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", radius: 8 }}
            content={<EarningsTooltip currentMonth={currentMonth} />}
          />
          <Bar
            dataKey="amount"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={false}
          >
            {monthlyEarnings.map((row) => (
              <Cell
                key={row.month}
                fill="var(--color-amount)"
                fillOpacity={row.month === currentMonth ? 1 : 0.22}
              />
            ))}
            <LabelList
              dataKey="amount"
              position="top"
              offset={8}
              className="fill-foreground font-medium"
              formatter={(value) =>
                value === monthlyEarnings.at(-1)?.amount
                  ? formatMoney(Number(value))
                  : ""
              }
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Earnings by month:{" "}
        {monthlyEarnings
          .map((row) => `${monthNames[row.month]} ${formatMoney(row.amount)}`)
          .join(", ")}
        .
      </figcaption>
    </figure>
  );
}
