"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ChartTip } from "@/features/admin/components/charts/tooltip";
import type { DailyPoint } from "@/lib/demo-data/admin/overview";

type TooltipPayload = { payload?: DailyPoint }[];

function DailyTooltip({
  active,
  payload,
  format,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  format: (value: number) => string;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return <ChartTip title={row.date} value={format(row.value)} />;
}

/**
 * One series over the days of the month: a 2px foreground line on a faint
 * wash, crosshair + tooltip on hover.
 */
export function DailyAreaChart({
  data,
  label,
  format,
  tickFormat,
  ticks,
  summary,
}: {
  data: DailyPoint[];
  label: string;
  format: (value: number) => string;
  tickFormat: (value: number) => string;
  ticks: number[];
  /** Screen-reader caption. */
  summary: string;
}) {
  const config = {
    value: { label, color: "var(--foreground)" },
  } satisfies ChartConfig;
  const xTicks = data
    .filter((_, i) => i % 4 === 0 || i === data.length - 1)
    .map((d) => d.day)
    .filter((day, i, all) => i === 0 || day !== all[i - 1]);

  return (
    <figure>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} strokeOpacity={0.6} />
          <XAxis
            dataKey="day"
            ticks={xTicks}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis
            width={44}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            ticks={ticks}
            domain={[ticks[0], ticks.at(-1) ?? "auto"]}
            tickFormatter={tickFormat}
          />
          <ChartTooltip
            cursor={{ strokeWidth: 1 }}
            content={<DailyTooltip format={format} />}
          />
          <Area
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="var(--color-value)"
            fillOpacity={0.06}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-value)",
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
