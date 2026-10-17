import { Swatch, shareSteps } from "@/features/admin/components/charts/swatch";
import { userSplit } from "@/lib/demo-data/admin/analytics";
import { formatNumber } from "@/lib/format";

/** Shippers vs drivers as one stacked bar, ordered ship only → do both → drive only. */
export function UserSplit() {
  const { total, segments } = userSplit;
  return (
    <figure className="flex flex-col gap-5">
      <p className="flex items-baseline gap-2">
        <span className="font-heading font-semibold text-3xl tracking-tight">
          {formatNumber(total)}
        </span>
        <span className="text-sm text-muted-foreground">total users</span>
      </p>
      <div className="flex h-3 gap-0.5" aria-hidden>
        {segments.map((s, i) => (
          <span
            key={s.label}
            title={`${s.label}: ${formatNumber(s.count)}`}
            className="h-full bg-foreground first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(s.count / total) * 100}%`,
              opacity: shareSteps[i],
            }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-2.5 text-sm">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <Swatch step={i} />
            <span className="flex-1">{s.label}</span>
            <span className="font-medium tabular-nums">
              {formatNumber(s.count)}
            </span>
            <span className="w-12 text-right text-muted-foreground tabular-nums">
              {((s.count / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">
        {segments.map((s) => `${s.label} ${formatNumber(s.count)}`).join(", ")},
        of {formatNumber(total)} total users.
      </figcaption>
    </figure>
  );
}
