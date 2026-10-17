import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

/**
 * "Austin, TX → Denver, CO", drawn with an arrow icon instead of the
 * text glyph. Use `truncate` inside tight table cells.
 */
export function RouteLabel({
  from,
  to,
  truncate = false,
  className,
  arrowClassName,
}: {
  from: string;
  to: string;
  truncate?: boolean;
  className?: string;
  arrowClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-x-1.5",
        truncate ? "min-w-0" : "flex-wrap",
        className,
      )}
    >
      <span className={cn(truncate && "truncate")}>{from}</span>
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        strokeWidth={2}
        aria-label="to"
        className={cn("size-3.5 shrink-0", arrowClassName)}
      />
      <span className={cn(truncate && "truncate")}>{to}</span>
    </span>
  );
}
