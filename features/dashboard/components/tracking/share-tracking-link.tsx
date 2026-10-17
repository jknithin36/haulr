"use client";

import { Link01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Copies the public tracking page URL, then confirms for two seconds. */
export function ShareTrackingLink({ shipmentId }: { shipmentId: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            `${window.location.origin}/track/${shipmentId}`,
          );
          setCopied(true);
        } catch {
          // Clipboard can be blocked; nothing useful to show.
        }
      }}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Link01Icon} strokeWidth={2} />
      <span aria-live="polite">
        {copied ? "Link copied" : "Share tracking link"}
      </span>
    </Button>
  );
}
