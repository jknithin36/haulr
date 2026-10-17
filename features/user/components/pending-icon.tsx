import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function PendingIcon() {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={2}
      aria-hidden
      className="size-4 animate-spin"
    />
  );
}
