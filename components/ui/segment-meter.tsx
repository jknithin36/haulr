"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** A row of pills; `filled` is the share (0–1) already taken. */
export function SegmentMeter({
  segments,
  filled,
}: {
  segments: number;
  filled: number;
}) {
  const taken = Math.round(segments * filled);
  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }, (_, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional.
          key={i}
          className={cn(
            "h-2 flex-1 rounded-full",
            i < taken ? "bg-foreground" : "bg-foreground/10",
          )}
          initial={{ scaleY: 0.4, opacity: 0.3 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
        />
      ))}
    </div>
  );
}
