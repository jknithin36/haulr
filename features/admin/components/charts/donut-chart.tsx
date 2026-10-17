"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Swatch, shareSteps } from "@/features/admin/components/charts/swatch";
import { ChartTip } from "@/features/admin/components/charts/tooltip";

type Slice = { name: string; share: number };
type TooltipPayload = { payload?: Slice }[];

function SliceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return <ChartTip title={row.name} value={`${row.share}% of bookings`} />;
}

/** Part-to-whole donut (≤ 4 slices) with a center total and a legend beside it. */
export function DonutChart({
  data,
  centerValue,
  centerLabel,
}: {
  data: Slice[];
  centerValue: string;
  centerLabel: string;
}) {
  const config = {
    share: { label: "Share", color: "var(--foreground)" },
  } satisfies ChartConfig;

  return (
    <figure className="flex flex-col items-center gap-6 sm:flex-row lg:gap-5">
      <div className="relative size-40 shrink-0">
        <ChartContainer config={config} className="aspect-square size-40">
          <PieChart>
            <ChartTooltip cursor={false} content={<SliceTooltip />} />
            <Pie
              data={data}
              dataKey="share"
              nameKey="name"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={2}
              cornerRadius={3}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((row, i) => (
                <Cell
                  key={row.name}
                  fill="var(--color-share)"
                  fillOpacity={shareSteps[i]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-semibold tracking-tight">
            {centerValue}
          </span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2.5 text-sm">
        {data.map((row, i) => (
          <li key={row.name} className="flex items-center gap-2.5">
            <Swatch step={i} />
            <span className="flex-1 whitespace-nowrap">{row.name}</span>
            <span className="font-medium tabular-nums">{row.share}%</span>
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">
        {data.map((row) => `${row.name} ${row.share}%`).join(", ")}.
      </figcaption>
    </figure>
  );
}
