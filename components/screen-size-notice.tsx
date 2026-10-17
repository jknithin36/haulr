"use client";

import { LaptopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "haulr:screen-notice-dismissed";
const SMALL_SCREEN = "(max-width: 767px)";

function wasDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * One-time hint on phones: the maps and dashboards are designed for larger
 * screens. Shown once per browser; dismissing it is remembered locally.
 */
export function ScreenSizeNotice() {
  const [open, setOpen] = useState(false);

  // Decided after mount so the server render and hydration always match.
  useEffect(() => {
    if (window.matchMedia(SMALL_SCREEN).matches && !wasDismissed()) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be blocked (private mode); the notice just shows again.
    }
  }

  return (
    <section
      aria-label="Screen size tip"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex flex-col gap-4 rounded-2xl bg-foreground p-5 text-background shadow-2xl duration-300 animate-in fade-in slide-in-from-bottom-4 md:hidden"
    >
      <div className="flex gap-3">
        <HugeiconsIcon
          icon={LaptopIcon}
          strokeWidth={2}
          className="mt-0.5 size-5 shrink-0"
        />
        <div className="flex flex-col gap-1">
          <p className="font-heading font-semibold">Best on a larger screen</p>
          <p className="text-sm text-pretty text-background/70">
            Haulr works here, but the maps, dashboards and posting flow are
            designed for laptops and desktops. Open it on a bigger screen for
            the full experience.
          </p>
        </div>
      </div>
      <Button
        size="lg"
        variant="secondary"
        onClick={dismiss}
        className="bg-background text-foreground hover:bg-background/90"
      >
        Got it
      </Button>
    </section>
  );
}
