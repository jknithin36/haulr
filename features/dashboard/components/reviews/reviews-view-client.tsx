"use client";

import {
  CheckmarkCircle02Icon,
  QuillWrite01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import { ReviewCard } from "@/features/dashboard/components/reviews/review-card";
import { StarInput } from "@/features/dashboard/components/reviews/star-input";
import {
  type PendingReview,
  type RatingSummary,
  type Review,
  reviewHighlights,
} from "@/lib/demo-data/dashboard/reviews";
import { firstName } from "@/lib/format";

function RatingOverview({ summary }: { summary: RatingSummary }) {
  const { average, count, breakdown } = summary;
  const max = Math.max(...breakdown.map((b) => b.count));
  return (
    <Panel
      aria-label="Rating summary"
      className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10"
    >
      <div className="flex shrink-0 flex-col gap-1 sm:w-40">
        <p className="flex items-center gap-2 text-4xl font-semibold tracking-tight tabular-nums">
          <HugeiconsIcon
            icon={StarIcon}
            strokeWidth={2}
            className="size-7 fill-foreground text-foreground"
          />
          {average.toFixed(1)}
        </p>
        <p className="text-sm text-muted-foreground">{count} reviews</p>
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {breakdown.map((b) => (
          <li
            key={b.stars}
            className="grid grid-cols-[2rem_1fr_2rem] items-center gap-3 text-sm tabular-nums"
          >
            <span className="flex items-center gap-1 text-muted-foreground">
              {b.stars}
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={2}
                aria-label="stars"
                className="size-3 fill-current"
              />
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <span
                className="block h-full rounded-full bg-foreground"
                style={{ width: `${max ? (b.count / max) * 100 : 0}%` }}
              />
            </span>
            <span className="text-right text-muted-foreground">{b.count}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function WriteReview({
  pending,
  onSubmit,
}: {
  pending: PendingReview;
  onSubmit: (review: Review) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(false);

  return (
    <Panel className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <GradientAvatar seed={pending.person} className="size-10" />
        <p className="min-w-0 flex-1 basis-48 text-sm text-pretty">
          {pending.summary}
        </p>
        {!open && (
          <Button
            size="lg"
            className="max-sm:w-full"
            onClick={() => setOpen(true)}
          >
            <HugeiconsIcon icon={QuillWrite01Icon} strokeWidth={2} />
            Write a review
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!rating) {
                setError(true);
                return;
              }
              onSubmit({
                id: `w-${pending.id}`,
                person: pending.person,
                ref: pending.ref,
                rating,
                comment: comment.trim(),
                tags,
              });
            }}
            className="flex flex-col gap-6 sm:pl-14"
          >
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">
                How was your experience?
              </legend>
              <StarInput
                value={rating}
                onChange={(v) => {
                  setRating(v);
                  setError(false);
                }}
              />
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  Choose a star rating to continue.
                </p>
              )}
            </fieldset>

            <div className="flex flex-col gap-3">
              <p id="highlights-label" className="text-sm font-medium">
                What went well?
              </p>
              <ToggleGroup
                multiple
                value={tags}
                onValueChange={(v) => setTags(v as string[])}
                aria-labelledby="highlights-label"
                className="flex-wrap"
              >
                {reviewHighlights.map((h) => (
                  <ToggleGroupItem
                    key={h}
                    value={h}
                    className="h-8 rounded-full bg-background px-3.5 hover:bg-background/70 aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/85 aria-pressed:hover:text-background"
                  >
                    {h}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="review-comment">Comment</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Tell others what it was like working with ${firstName(pending.person)}.`}
                className="min-h-24 bg-background dark:bg-background"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="lg">
                Submit review
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Panel>
  );
}

export function ReviewsViewClient({
  summary,
  aboutMe,
  initialWritten,
  initialPending,
}: {
  summary: RatingSummary;
  aboutMe: Review[];
  initialWritten: Review[];
  initialPending: PendingReview[];
}) {
  const [tab, setTab] = useState<string>("about");
  const [written, setWritten] = useState(initialWritten);
  const [pending, setPending] = useState(initialPending);

  function submit(id: string, review: Review) {
    setWritten((list) => [review, ...list]);
    setPending((list) => list.filter((p) => p.id !== id));
    setTab("written");
  }

  return (
    <MotionConfig reducedMotion="user">
      <PageHeader title="Reviews" />
      <RatingOverview summary={summary} />

      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          <DashboardTabsList>
            <TabsTrigger value="about" className="px-2 sm:px-3">
              Reviews about me
            </TabsTrigger>
            <TabsTrigger value="written" className="px-2 sm:px-3">
              Reviews I wrote
            </TabsTrigger>
            <TabsTrigger value="todo" className="px-2 sm:px-3">
              To write{pending.length > 0 && ` (${pending.length})`}
            </TabsTrigger>
          </DashboardTabsList>
        </div>

        <TabsContent value="about" className="pt-3">
          <div className="flex flex-col gap-3">
            {aboutMe.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="written" className="pt-3">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {written.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ReviewCard review={r} prefix="To" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="todo" className="pt-3">
          {pending.length === 0 ? (
            <EmptyState
              icon={CheckmarkCircle02Icon}
              title="You’re all caught up"
              description="When a job wraps up, you can review the other person here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((p) => (
                <WriteReview
                  key={p.id}
                  pending={p}
                  onSubmit={(review) => submit(p.id, review)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MotionConfig>
  );
}
