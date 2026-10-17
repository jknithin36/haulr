import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

/** Status colors are kept soft and few, so status reads at a glance without shouting. */
const tones = {
  neutral: "bg-muted text-foreground",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  warning: "bg-amber-500/15 text-amber-800 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Rating like "★ 4.9", with black stars to match the rest of the site. */
export function Rating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 tabular-nums", className)}
    >
      <HugeiconsIcon
        icon={StarIcon}
        strokeWidth={2}
        className="size-3.5 fill-foreground text-foreground"
      />
      {value.toFixed(1)}
    </span>
  );
}

/** Row of 1–5 filled stars. */
export function Stars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={cn("inline-flex gap-0.5", className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <HugeiconsIcon
          // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional.
          key={i}
          icon={StarIcon}
          strokeWidth={2}
          className={cn(
            "size-3.5",
            i < value
              ? "fill-foreground text-foreground"
              : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

/** Small number tile for summaries (earnings, win rate, ...). */
export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
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
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Soft panel used for every card-like surface in the dashboard. */
export function Panel({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl bg-muted/50 p-5 md:p-6", className)}
      {...props}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: typeof StarIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Empty className="rounded-2xl bg-muted/50 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
