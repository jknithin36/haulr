import { cn } from "@/lib/utils";

/**
 * Key number with its change vs. the same period last month. `change` is the
 * display text ("14.2%", "1.4 pts"); `direction` decides the arrow and color.
 */
export function KpiCard({
  label,
  value,
  change,
  direction = "up",
  goodWhen = "up",
  className,
}: {
  label: string;
  value: React.ReactNode;
  change?: string;
  direction?: "up" | "down";
  /** Whether "up" is good (revenue) or bad (dispute rate). */
  goodWhen?: "up" | "down";
  className?: string;
}) {
  const good = direction === goodWhen;
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl bg-muted/50 p-5",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "text-xs font-medium tabular-nums",
            good
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-destructive",
          )}
        >
          {direction === "up" ? "▲" : "▼"} {change}{" "}
          <span className="font-normal text-muted-foreground">
            vs last month
          </span>
        </p>
      )}
    </div>
  );
}
