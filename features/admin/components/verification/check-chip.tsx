import {
  Alert02Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StatusBadge } from "@/components/ui/data-display";
import type { AutoCheck } from "@/lib/demo-data/admin/verification";

const look = {
  pass: { icon: CheckmarkCircle02Icon, tone: "success" },
  warn: { icon: Alert02Icon, tone: "warning" },
  fail: { icon: CancelCircleIcon, tone: "danger" },
} as const;

function CheckChip({ check }: { check: AutoCheck }) {
  const { icon, tone } = look[check.result];
  return (
    <StatusBadge tone={tone} className="gap-1 pl-1.5">
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
      {check.label}
    </StatusBadge>
  );
}

export function CheckChips({ checks }: { checks: AutoCheck[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {checks.map((c) => (
        <CheckChip key={c.label} check={c} />
      ))}
    </div>
  );
}
