import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import { needsAttention } from "@/lib/demo-data/admin/overview";
import { cn } from "@/lib/utils";

export function NeedsAttention() {
  return (
    <ul className="flex flex-col">
      {needsAttention.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-4 border-border/60 border-b py-3 last:border-0"
        >
          <span className="w-8 shrink-0 font-heading font-semibold text-lg tabular-nums">
            {item.count}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5">
            <span className="text-sm">{item.label}</span>
            {"note" in item && (
              <StatusBadge tone="warning">{item.note}</StatusBadge>
            )}
          </span>
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-mr-2 shrink-0",
            )}
          >
            {item.action}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
