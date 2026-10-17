"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { AdminReview } from "@/lib/demo-data/admin/reviews";
import { firstName } from "@/lib/format";

export function ContactDialog({
  review,
  open,
  onOpenChange,
}: {
  review: AdminReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage("");
      setSent(false);
    }
  }, [open]);

  if (!review) return null;
  const first = firstName(review.from);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={2}
                  className="size-5 text-emerald-700 dark:text-emerald-400"
                />
                Message sent
              </DialogTitle>
              <DialogDescription>
                {first} will see it in their Haulr inbox and by email.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>Done</DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) setSent(true);
            }}
          >
            <DialogHeader>
              <DialogTitle>Contact {review.from}</DialogTitle>
              <DialogDescription>
                About their review of {review.to} on {review.job}.
              </DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${first}, we’re reaching out about your review…`}
              />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={!message.trim()}>
                Send message
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
