"use client";

import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/** Segmented bar: one pill per step, filled up to the current one. */
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={Math.min(current, total)}
        aria-valuetext={`Step ${Math.min(current, total)} of ${total}`}
        className="flex gap-1"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional.
            key={i}
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/10"
          >
            <motion.span
              className="absolute inset-0 origin-left rounded-full bg-foreground"
              initial={false}
              animate={{ scaleX: i < current ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

function FlowTopBar({
  current,
  total,
  exitHref,
  onSaveAndExit,
  showProgress = true,
  exitLabel = "Save and exit",
}: {
  current: number;
  total: number;
  exitHref: string;
  onSaveAndExit?: () => void;
  showProgress?: boolean;
  exitLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <LogoMark />
          <span>Haulr</span>
        </Link>
        <div className="mx-auto hidden w-full max-w-md items-center gap-3 sm:flex">
          {showProgress && (
            <>
              <StepProgress current={current} total={total} />
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {Math.min(current, total)} of {total}
              </span>
            </>
          )}
        </div>
        <Link
          href={exitHref}
          onClick={onSaveAndExit}
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "col-start-3",
          )}
        >
          {exitLabel}
        </Link>
      </div>
      {showProgress && (
        <div className="px-4 pb-3 sm:hidden">
          <StepProgress current={current} total={total} />
        </div>
      )}
    </header>
  );
}

export function StepHeading({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-pretty text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

type WizardNav = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hidden?: boolean;
};

/**
 * Shared frame for the step-by-step flows: minimal top bar with progress,
 * the step on the left, and a live preview on the right (a toggle on mobile).
 */
export function WizardShell({
  stepKey,
  direction,
  current,
  total,
  exitHref,
  onSaveAndExit,
  preview,
  previewNote,
  nav,
  showProgress = true,
  exitLabel,
  wide = false,
  children,
}: {
  stepKey: string | number;
  direction: number;
  current: number;
  total: number;
  exitHref: string;
  onSaveAndExit?: () => void;
  preview?: React.ReactNode;
  previewNote?: string;
  nav?: WizardNav;
  showProgress?: boolean;
  exitLabel?: string;
  /** Let the content use the full width (e.g. the success screen). */
  wide?: boolean;
  children: React.ReactNode;
}) {
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const first = useRef(true);

  // New step: start at the top of the page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per step.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
  }, [stepKey]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-1 flex-col">
        <FlowTopBar
          current={current}
          total={total}
          exitHref={exitHref}
          onSaveAndExit={onSaveAndExit}
          showProgress={showProgress}
          exitLabel={exitLabel}
        />
        <main
          className={cn(
            "mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 pt-8 md:pt-14 lg:gap-16",
            preview && "lg:grid-cols-[minmax(0,1fr)_360px]",
          )}
        >
          <div className="flex min-w-0 flex-col">
            {preview && (
              <div className="mb-6 lg:hidden">
                <Button
                  variant="secondary"
                  size="lg"
                  aria-expanded={showMobilePreview}
                  onClick={() => setShowMobilePreview((v) => !v)}
                >
                  <HugeiconsIcon
                    icon={showMobilePreview ? ViewOffSlashIcon : ViewIcon}
                    strokeWidth={2}
                  />
                  {showMobilePreview ? "Hide preview" : "Preview"}
                </Button>
                <AnimatePresence initial={false}>
                  {showMobilePreview && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">{preview}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={stepKey}
                custom={direction}
                initial={{ opacity: 0, x: 16 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 * direction }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn("flex flex-col gap-8", !wide && "max-w-2xl")}
              >
                {children}
              </motion.div>
            </AnimatePresence>
            <div className="min-h-12 flex-1" />
            {nav && !nav.hidden && (
              <div className="sticky bottom-0 z-10 -mx-4 bg-background/90 px-4 pt-4 pb-6 backdrop-blur supports-backdrop-filter:bg-background/75 md:pb-10">
                <div className="flex max-w-2xl items-center justify-between gap-3">
                  {nav.onBack ? (
                    <Button variant="ghost" size="lg" onClick={nav.onBack}>
                      <HugeiconsIcon
                        icon={ArrowLeft02Icon}
                        strokeWidth={2}
                        data-icon="inline-start"
                      />
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  {nav.onNext && (
                    <Button
                      size="lg"
                      className="min-w-32"
                      disabled={nav.nextDisabled}
                      onClick={nav.onNext}
                    >
                      {nav.nextLabel ?? "Continue"}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        strokeWidth={2}
                        data-icon="inline-end"
                      />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          {preview && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-3 pb-10">
                <p className="text-sm font-medium">Preview</p>
                {preview}
                {previewNote && (
                  <p className="text-sm text-pretty text-muted-foreground">
                    {previewNote}
                  </p>
                )}
              </div>
            </aside>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
