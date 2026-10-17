"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** "48h 00m" style countdown that ticks every few seconds. */
export function HoursCountdown({ hours }: { hours: number }) {
  const [remaining, setRemaining] = useState(hours * 3600_000);

  useEffect(() => {
    const deadline = Date.now() + hours * 3600_000;
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [hours]);

  // Round up so a fresh post reads "48h 00m", not "47h 59m".
  const totalMinutes = Math.ceil(remaining / 60_000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return (
    <span className="tabular-nums">
      {h}h {String(m).padStart(2, "0")}m
    </span>
  );
}

function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            `${window.location.origin}${path}`,
          );
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      {copied ? "Link copied" : "Copy link"}
    </Button>
  );
}

export function SuccessScreen({
  title,
  text,
  detail,
  primary,
  secondaryLabel,
  onSecondary,
  sharePath,
  preview,
}: {
  title: string;
  text: string;
  detail?: React.ReactNode;
  primary: { label: string; href: string };
  secondaryLabel: string;
  onSecondary: () => void;
  sharePath: string;
  preview?: React.ReactNode;
}) {
  return (
    <div className="grid w-full items-center gap-12 pb-16 md:grid-cols-[minmax(0,1fr)_360px] md:pt-6 lg:gap-24">
      <div className="flex max-w-xl flex-col gap-8">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="grid size-14 place-items-center rounded-full bg-foreground text-background"
        >
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-7" />
        </motion.span>
        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="max-w-lg text-pretty text-muted-foreground md:text-lg">
            {text}
          </p>
        </div>
        {detail}
        <div className="flex flex-wrap gap-3">
          <Link
            href={primary.href}
            className={cn(buttonVariants({ size: "lg" }), "px-4")}
          >
            {primary.label}
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="px-4"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Share</p>
          <div>
            <CopyLink path={sharePath} />
          </div>
        </div>
      </div>
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
        >
          {preview}
        </motion.div>
      )}
    </div>
  );
}
