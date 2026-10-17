import { funnel } from "@/lib/demo-data/admin/analytics";
import { formatNumber } from "@/lib/format";

/**
 * Marketplace funnel. Each bar is the share of the step above that made it
 * through, so the drop-offs are visible even where raw counts are tiny next
 * to visitors. Counts and conversion are printed on every row.
 */
export function Funnel() {
  return (
    <ol className="flex flex-col gap-4">
      {funnel.map((step, i) => {
        const previous = funnel[i - 1];
        const width = previous ? (step.count / previous.count) * 100 : 100;
        return (
          <li
            key={step.label}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 md:grid-cols-[13rem_1fr_6rem_9rem]"
          >
            <span className="text-sm">
              {step.label}
              {step.note && (
                <span className="text-muted-foreground"> · {step.note}</span>
              )}
            </span>
            <span className="col-start-1 row-start-2 h-2 overflow-hidden rounded-full bg-foreground/[0.07] md:col-start-auto md:row-start-auto">
              <span
                className="block h-full rounded-full bg-foreground"
                style={{ width: `${width}%` }}
              />
            </span>
            <span className="text-right font-medium text-sm tabular-nums">
              {formatNumber(step.count)}
            </span>
            <span className="row-start-2 text-right text-muted-foreground text-xs tabular-nums md:row-start-auto md:text-sm">
              {step.conversion ? `${step.conversion} of previous` : "—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
