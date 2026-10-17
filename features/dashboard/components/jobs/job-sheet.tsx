"use client";

import {
  CheckmarkCircle02Icon,
  Flag02Icon,
  QuoteDownIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  type Photo,
  PhotoUploader,
} from "@/features/dashboard/components/jobs/photo-uploader";
import {
  type Job,
  type JobStatus,
  jobTone,
} from "@/lib/demo-data/dashboard/jobs";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function JobSheet({
  job,
  onOpenChange,
  photos,
  onPhotosChange,
  onStatusChange,
}: {
  job: Job | null;
  onOpenChange: (open: boolean) => void;
  photos: Photo[];
  onPhotosChange: (id: string, photos: Photo[]) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}) {
  // Keep the last job on screen while the sheet slides closed.
  const [shown, setShown] = useState<Job | null>(job);
  if (job && job !== shown) setShown(job);

  const [confirming, setConfirming] = useState(false);
  const [reporting, setReporting] = useState(false);

  const j = job ?? shown;

  return (
    <>
      <Sheet open={!!job} onOpenChange={onOpenChange}>
        <SheetContent className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-md">
          {j && (
            <JobDetail
              job={j}
              photos={photos}
              onPhotosChange={(next) => onPhotosChange(j.id, next)}
              onPickedUp={() => onStatusChange(j.id, "In progress")}
              onDelivered={() => setConfirming(true)}
              onReport={() => setReporting(true)}
            />
          )}
        </SheetContent>
      </Sheet>

      {j && (
        <ConfirmDeliveryDialog
          open={confirming}
          onOpenChange={setConfirming}
          job={j}
          photos={photos}
          onPhotosChange={(next) => onPhotosChange(j.id, next)}
          onConfirm={() => onStatusChange(j.id, "Completed")}
        />
      )}

      <ReportDialog open={reporting} onOpenChange={setReporting} />
    </>
  );
}

function Block({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3 px-5 py-5", className)}>
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function JobDetail({
  job: j,
  photos,
  onPhotosChange,
  onPickedUp,
  onDelivered,
  onReport,
}: {
  job: Job;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  onPickedUp: () => void;
  onDelivered: () => void;
  onReport: () => void;
}) {
  const d = j.detail;
  const done = j.status === "Completed";
  const trackable = !j.tripId && !!d;

  return (
    <>
      <SheetHeader className="gap-3 px-5 pt-5 pb-2">
        <div className="flex items-center gap-2 pr-8">
          <span className="text-xs text-muted-foreground tabular-nums">
            {j.id}
          </span>
          <StatusBadge tone={jobTone[j.status]}>{j.status}</StatusBadge>
        </div>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
          {j.item}
        </SheetTitle>
        <SheetDescription render={<div />} className="flex flex-col gap-0.5">
          {d?.model || d?.weight ? (
            <span>{[d.model, d.weight].filter(Boolean).join(" · ")}</span>
          ) : null}
          <RouteLabel
            from={j.from}
            to={j.to}
            truncate
            arrowClassName="opacity-60"
          />
        </SheetDescription>
      </SheetHeader>

      <div className="mx-5 my-3 flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
        <p className="text-muted-foreground">{done ? "Paid" : "You’ll earn"}</p>
        <p className="font-heading text-xl font-semibold tabular-nums">
          {formatUsd(j.pay)}
        </p>
      </div>

      {d && (
        <Block title="Route">
          <ol className="flex flex-col">
            <StopItem
              label="Pickup"
              address={d.pickup.address}
              when={d.pickup.when}
              contact={d.pickup.contact}
              first
            />
            <StopItem
              label="Dropoff"
              address={d.dropoff.address}
              when={d.dropoff.when}
              contact={d.dropoff.contact}
            />
          </ol>
        </Block>
      )}

      {d?.note && (
        <Block title="Note from the shipper">
          <div className="flex gap-3 rounded-2xl bg-muted/50 p-4">
            <HugeiconsIcon
              icon={QuoteDownIcon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <p className="text-pretty">“{d.note}”</p>
          </div>
        </Block>
      )}

      {j.tripId && (
        <Block title="Trip">
          {j.bookings ? (
            <ul className="flex flex-col gap-3">
              {j.bookings.map((b) => {
                const [name, item] = b.split(" · ");
                return (
                  <li key={b} className="flex items-center gap-3">
                    <GradientAvatar seed={name} className="size-8" />
                    <span className="flex flex-col leading-tight">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground">{item}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Shared space on your {j.from} to {j.to} trip, picked up {j.pickup}
              .
            </p>
          )}
          <Link
            href="/dashboard/trips"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            View trip {j.tripId}
          </Link>
        </Block>
      )}

      {trackable && !done && (
        <Block title="Pickup and delivery photos">
          <p className="-mt-1 text-muted-foreground">
            Required. Take photos when you load and when you drop off.
          </p>
          <PhotoUploader
            id={`photos-${j.id}`}
            photos={photos}
            onAdd={(added) => onPhotosChange([...photos, ...added])}
            onRemove={(p) => {
              URL.revokeObjectURL(p.url);
              onPhotosChange(photos.filter((x) => x.id !== p.id));
            }}
          />
        </Block>
      )}

      {trackable && done && photos.length > 0 && (
        <Block title="Delivery photos">
          <div className="grid grid-cols-4 gap-2.5">
            {photos.map((p) => (
              // biome-ignore lint/performance/noImgElement: local blob preview.
              <img
                key={p.id}
                src={p.url}
                alt={p.name}
                className="aspect-square rounded-xl object-cover"
              />
            ))}
          </div>
        </Block>
      )}

      <div className="mt-auto flex flex-col gap-3 px-5 pt-3 pb-5">
        {trackable && !done && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              variant={j.status === "Scheduled" ? "default" : "outline"}
              disabled={j.status !== "Scheduled"}
              onClick={onPickedUp}
            >
              {j.status !== "Scheduled" && (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
              )}
              {j.status === "Scheduled" ? "Mark picked up" : "Picked up"}
            </Button>
            <Button
              size="lg"
              variant={j.status === "In progress" ? "default" : "outline"}
              disabled={j.status !== "In progress"}
              onClick={onDelivered}
            >
              Mark delivered
            </Button>
          </div>
        )}
        {done && trackable && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              strokeWidth={2}
              className="size-4 text-emerald-600"
            />
            Delivered. Payment goes out within 2 business days.
          </p>
        )}
        <Button
          variant="ghost"
          className="w-fit text-muted-foreground"
          onClick={onReport}
        >
          <HugeiconsIcon
            icon={Flag02Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Report a problem
        </Button>
      </div>
    </>
  );
}

function StopItem({
  label,
  address,
  when,
  contact,
  first,
}: {
  label: string;
  address: string;
  when: string;
  contact?: string;
  first?: boolean;
}) {
  return (
    <li className="relative grid grid-cols-[1rem_1fr] gap-3 pb-5 last:pb-0">
      {first && (
        <span
          aria-hidden
          className="absolute top-4 bottom-0 left-[7px] border-l border-dashed border-foreground/25"
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative mt-1 size-3.5 rounded-full border-2 border-foreground bg-background",
          !first && "bg-foreground",
        )}
      />
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          {label} · {when}
        </p>
        <p className="font-medium">{address}</p>
        {contact && (
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <GradientAvatar seed={contact} className="size-5" />
            Contact: <span className="text-foreground">{contact}</span>
          </p>
        )}
      </div>
    </li>
  );
}

function ConfirmDeliveryDialog({
  open,
  onOpenChange,
  job,
  photos,
  onPhotosChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  onConfirm: () => void;
}) {
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const ready = photos.length >= 2 && name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setConfirmed(false);
          setName("");
        }
      }}
    >
      <DialogContent className="gap-5 sm:max-w-md">
        {confirmed ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                strokeWidth={2}
                className="size-6"
              />
            </span>
            <DialogTitle className="text-lg">Delivery confirmed</DialogTitle>
            <DialogDescription className="text-pretty">
              {formatUsd(job.pay)} will be paid to you within 2 business days.
            </DialogDescription>
            <Button className="mt-2" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Confirm delivery</DialogTitle>
              <DialogDescription>
                Upload at least 2 photos and get the receiver’s name.
              </DialogDescription>
            </DialogHeader>
            <form
              id="confirm-delivery"
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!ready) return;
                onConfirm();
                setConfirmed(true);
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor={`confirm-photos-${job.id}`}>Photos</Label>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {Math.min(photos.length, 2)} of 2 needed
                  </span>
                </div>
                <PhotoUploader
                  id={`confirm-photos-${job.id}`}
                  photos={photos}
                  label="Add photos"
                  onAdd={(added) => onPhotosChange([...photos, ...added])}
                  onRemove={(p) => {
                    URL.revokeObjectURL(p.url);
                    onPhotosChange(photos.filter((x) => x.id !== p.id));
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="received-by">Received by</Label>
                <Input
                  id="received-by"
                  className="h-10"
                  placeholder="Full name"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" form="confirm-delivery" disabled={!ready}>
                Confirm delivery
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setSent(false);
          setText("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Report a problem</DialogTitle>
          <DialogDescription>
            {sent
              ? "Thanks. Our support team will get back to you within a few hours."
              : "Tell us what happened. We’ll reach out to you and the shipper."}
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </DialogFooter>
        ) : (
          <>
            <Textarea
              aria-label="What happened"
              placeholder="For example: the item is larger than listed."
              className="min-h-28"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled={!text.trim()} onClick={() => setSent(true)}>
                Send report
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
