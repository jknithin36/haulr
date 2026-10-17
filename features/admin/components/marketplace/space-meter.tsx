import { cn } from "@/lib/utils";

/** Thin bar showing how much of a vehicle is booked. */
export function SpaceMeter({
  used,
  capacity,
  className,
}: {
  used: number;
  capacity: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((used / capacity) * 100));
  return (
    <span
      aria-hidden
      className={cn(
        "relative block h-1.5 w-16 overflow-hidden rounded-full bg-foreground/10",
        className,
      )}
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full bg-foreground"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}
