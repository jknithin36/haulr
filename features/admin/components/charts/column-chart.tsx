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
import { ChartTip } from "@/features/admin/components/charts/tooltip";

export type Column = {
  label: string;
  /** Longer name for the tooltip. */
  title: string;
  value: number;
  /** Incomplete period: drawn lighter and labeled "to date". */
  partial?: boolean;
};

type TooltipPayload = { payload?: Column }[];

function ColumnTooltip({
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
  return <ChartTip title={row.title} value={format(row.value)} />;
}

/**
 * Single-series columns in the foreground color. `emphasis` picks which
 * column stays solid ("last") or draws every complete column solid ("all").
 * Partial columns are always lighter and capped with a "to date" label.
 */
export function ColumnChart({
  data,
  label,
  format,
  tickFormat,
  ticks,
  emphasis = "all",
  labelFormat = format,
  summary,
}: {
  data: Column[];
  label: string;
  format: (value: number) => string;
  tickFormat: (value: number) => string;
  ticks: number[];
  emphasis?: "all" | "last";
  /** Format for the cap label on the emphasized/partial column. */
  labelFormat?: (value: number) => string;
  summary: string;
}) {
  const config = {
    value: { label, color: "var(--foreground)" },
  } satisfies ChartConfig;
  const last = data.length - 1;
  const opacity = (row: Column, i: number) => {
    if (row.partial) return 0.28;
    if (emphasis === "last") return i === last ? 1 : 0.22;
    return 1;
  };
  const capLabel = (i: number) => {
    const row = data[i];
    if (!row) return "";
    if (row.partial) return labelFormat(row.value);
    if (emphasis === "last" && i === last) return labelFormat(row.value);
    return "";
  };

  return (
    <figure>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <BarChart
          data={data}
          margin={{ top: 36, right: 0, bottom: 0, left: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid vertical={false} strokeOpacity={0.6} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
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
            cursor={{ fill: "var(--muted)", radius: 8 }}
            content={<ColumnTooltip format={format} />}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            isAnimationActive={false}
          >
            {data.map((row, i) => (
              <Cell
                key={row.label}
                fill="var(--color-value)"
                fillOpacity={opacity(row, i)}
              />
            ))}
            <LabelList
              dataKey="value"
              content={(props) => {
                const { x, y, width, index } = props;
                const row = data[Number(index)];
                const text = capLabel(Number(index));
                if (!row || !text) return null;
                const cx = Number(x) + Number(width) / 2;
                return (
                  <text
                    x={cx}
                    y={Number(y) - (row.partial ? 22 : 8)}
                    textAnchor="middle"
                    className="fill-foreground font-medium"
                  >
                    {text}
                    {row.partial && (
                      <tspan
                        x={cx}
                        dy={14}
                        className="fill-muted-foreground font-normal"
                      >
                        to date
                      </tspan>
                    )}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
