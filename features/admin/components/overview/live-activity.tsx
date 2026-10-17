import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  MoneySend01Icon,
  Shield01Icon,
  Tag01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { RouteLabel } from "@/components/ui/route-label";
import {
  type Activity,
  type ActivityKind,
  liveActivity,
} from "@/lib/demo-data/admin/overview";

const icons: Record<ActivityKind, typeof Tag01Icon> = {
  offer: Tag01Icon,
  signup: UserAdd01Icon,
  booking: CheckmarkCircle02Icon,
  document: Shield01Icon,
  dispute: Alert02Icon,
  payout: MoneySend01Icon,
};

function ActivityText({ entry }: { entry: Activity }) {
  if (!entry.route) return entry.text;
  const { ref, item, from, to, price } = entry.route;
  return (
    <>
      {ref} booked · {item} ·{" "}
      <RouteLabel
        from={from}
        to={to}
        className="flex-nowrap gap-1 align-bottom"
        arrowClassName="text-muted-foreground"
      />{" "}
      · <span className="tabular-nums">{price}</span>
    </>
  );
}

export function LiveActivity() {
  return (
    <ol className="flex flex-col gap-4">
      {liveActivity.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
            <HugeiconsIcon
              icon={icons[entry.kind]}
              strokeWidth={2}
              className="size-4"
            />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
            <span className="text-pretty text-sm">
              <ActivityText entry={entry} />
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {entry.time}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
