"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** "Save changes" with a short-lived "Saved" confirmation next to it. */
export function SaveBar({
  dirty,
  onSave,
}: {
  dirty: boolean;
  onSave: () => void;
}) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [justSaved]);

  return (
    <div className="flex items-center gap-3">
      <Button
        size="lg"
        disabled={!dirty}
        onClick={() => {
          onSave();
          setJustSaved(true);
        }}
      >
        Save changes
      </Button>
      <output className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {justSaved && !dirty && (
          <>
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="size-4 text-emerald-600 dark:text-emerald-400"
            />
            Saved
          </>
        )}
      </output>
    </div>
  );
}

/** Shallow compare for flat settings objects. */
export function isDirty<T extends object>(a: T, b: T) {
  return (Object.keys(a) as (keyof T)[]).some(
    (key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]),
  );
}
