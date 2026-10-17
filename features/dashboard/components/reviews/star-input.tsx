"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

/**
 * Clickable 1–5 star rating. Built on native radios, so arrow keys,
 * Tab and screen readers all work without extra wiring.
 */
export function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-3">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: hover preview only; the radios handle input. */}
      <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
        {labels.map((label, i) => {
          const n = i + 1;
          return (
            <label
              key={label}
              htmlFor={`${id}-${n}`}
              onMouseEnter={() => setHover(n)}
              className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
            >
              <input
                id={`${id}-${n}`}
                type="radio"
                name={id}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              <span className="sr-only">
                {n} {n === 1 ? "star" : "stars"}, {label}
              </span>
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={2}
                aria-hidden
                className={cn(
                  "size-7 transition-colors",
                  n <= shown
                    ? "fill-foreground text-foreground"
                    : "fill-transparent text-muted-foreground/50",
                )}
              />
            </label>
          );
        })}
      </div>
      <span aria-hidden className="text-sm text-muted-foreground">
        {shown ? labels[shown - 1] : "Select a rating"}
      </span>
    </div>
  );
}
