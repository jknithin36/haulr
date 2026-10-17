"use client";

import {
  FavouriteIcon,
  Flag02Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Save · Share · Report, for the top of the trip page. */
export function TripActions({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        aria-pressed={saved}
        onClick={() => setSaved(!saved)}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          strokeWidth={2}
          className={cn(saved && "fill-foreground")}
        />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="ghost" onClick={share}>
        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} />
        {copied ? "Link copied" : "Share"}
      </Button>
      <Dialog onOpenChange={(open) => open && setReported(false)}>
        <DialogTrigger render={<Button variant="ghost" />}>
          <HugeiconsIcon icon={Flag02Icon} strokeWidth={2} />
          Report
        </DialogTrigger>
        <DialogContent>
          {reported ? (
            <DialogHeader>
              <DialogTitle>Thanks for letting us know</DialogTitle>
              <DialogDescription>
                Our team will review this trip within 24 hours.
              </DialogDescription>
            </DialogHeader>
          ) : (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setReported(true);
              }}
            >
              <DialogHeader>
                <DialogTitle>Report this trip</DialogTitle>
                <DialogDescription>
                  Tell us what looks wrong. The driver won’t see who reported
                  it.
                </DialogDescription>
              </DialogHeader>
              <Textarea required placeholder="What’s wrong with this trip?" />
              <DialogFooter>
                <Button type="submit">Send report</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
