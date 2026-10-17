"use client";

import {
  Alert02Icon,
  Message01Icon,
  MoneyReceiveSquareIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  type JobState,
  JobStatus,
} from "@/features/admin/components/jobs/job-status";
import {
  ActivityLog,
  ContactCard,
  DetailSection,
  Facts,
} from "@/features/admin/components/marketplace/detail-kit";
import { OptionSelect } from "@/features/admin/components/marketplace/option-select";
import { SpaceMeter } from "@/features/admin/components/marketplace/space-meter";
import { availableDrivers, type JobPerson } from "@/lib/demo-data/admin/jobs";
import { firstName, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

type Driver = (typeof availableDrivers)[number];

export function JobSheet({
  job,
  onOpenChange,
  onMessage,
  onRefund,
  onReassign,
}: {
  job: JobState | null;
  onOpenChange: (open: boolean) => void;
  onMessage: (person: JobPerson, role: string) => void;
  onRefund: (job: JobState, amount: number) => void;
  onReassign: (job: JobState, driver: Driver) => void;
}) {
  const [shown, setShown] = useState<JobState | null>(job);
  if (job && job !== shown) setShown(job);
  const j = job ?? shown;

  const [refundOpen, setRefundOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  return (
    <>
      <Sheet open={!!job} onOpenChange={onOpenChange}>
        <SheetContent
          initialFocus={(type) => type === "keyboard"}
          className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-xl"
        >
          {j && (
            <JobDetail
              job={j}
              onMessage={onMessage}
              onRefund={() => setRefundOpen(true)}
              onReassign={() => setReassignOpen(true)}
            />
          )}
        </SheetContent>
      </Sheet>

      {j && (
        <>
          <RefundDialog
            open={refundOpen}
            onOpenChange={setRefundOpen}
            job={j}
            onConfirm={(amount) => onRefund(j, amount)}
          />
          <ReassignDialog
            open={reassignOpen}
            onOpenChange={setReassignOpen}
            job={j}
            onConfirm={(driver) => onReassign(j, driver)}
          />
        </>
      )}
    </>
  );
}

function JobDetail({
  job: j,
  onMessage,
  onRefund,
  onReassign,
}: {
  job: JobState;
  onMessage: (person: JobPerson, role: string) => void;
  onRefund: () => void;
  onReassign: () => void;
}) {
  const late = j.status === "Late";

  return (
    <>
      <SheetHeader className="gap-3 px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 pr-8">
          <span className="text-xs text-muted-foreground tabular-nums">
            {j.id}
          </span>
          <JobStatus job={j} />
        </div>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
          {j.item}
        </SheetTitle>
        <SheetDescription render={<div />}>
          <RouteLabel
            from={j.from}
            to={j.to}
            truncate
            arrowClassName="opacity-60"
          />
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-8 px-6 py-4">
        {late && j.lastUpdate && (
          <div className="flex flex-col gap-4 rounded-2xl bg-destructive/5 p-5">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Last driver update ·{" "}
                <span className="tabular-nums">{j.lastUpdate.time}</span>
              </p>
              <p className="text-lg font-medium text-pretty">
                “{j.lastUpdate.text}”
              </p>
            </div>
            {j.shipperMessages && (
              <p className="flex items-center gap-2 text-sm">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  strokeWidth={2}
                  className="size-4 text-destructive"
                />
                Shipper messages: {j.shipperMessages.length} in the last 24
                hours
              </p>
            )}
          </div>
        )}

        {j.progress !== undefined && (
          <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-medium">On the way</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {j.progress}% of the route
              </p>
            </div>
            <SpaceMeter used={j.progress} capacity={100} className="w-full" />
            {j.lastUpdate && (
              <p className="text-sm text-muted-foreground">
                {j.lastUpdate.time} · “{j.lastUpdate.text}”
              </p>
            )}
          </div>
        )}

        <Facts
          className="sm:grid-cols-2"
          items={[
            { label: "Job price", value: formatUsd(j.price) },
            { label: "Expected", value: j.expected },
            { label: "Picked up", value: j.pickedUp ?? "Not yet" },
            {
              label: "Shipment",
              value: (
                <Link
                  href={`/admin/shipments/${j.shipmentId}`}
                  className="underline-offset-4 hover:underline"
                >
                  {j.shipmentId}
                </Link>
              ),
            },
            ...(j.refund
              ? [
                  {
                    label: "Partial refund",
                    value: `${formatUsd(j.refund)} offered`,
                  },
                ]
              : []),
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <ContactCard label="Driver" {...j.driver} />
          <ContactCard label="Shipper" {...j.shipper} />
        </div>

        {late && j.shipperMessages && (
          <DetailSection title="Shipper messages, last 24 hours">
            <ul className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5">
              {j.shipperMessages.map((m) => (
                <li key={m.time} className="flex gap-3">
                  <GradientAvatar seed={m.from} className="size-7" />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {m.time}
                    </p>
                    <p className="text-pretty">{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {j.disputed && (
          <div className="flex flex-col gap-3 rounded-2xl bg-destructive/5 p-5">
            <p>
              <span className="font-medium">Dispute DSP-208 is open.</span>{" "}
              <span className="text-muted-foreground">
                {j.shipper.name} reported damage on arrival.
              </span>
            </p>
            <Link
              href="/admin/disputes"
              className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            >
              Open dispute
            </Link>
          </div>
        )}

        <DetailSection title="Activity">
          <ActivityLog entries={j.activity} />
        </DetailSection>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-popover px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => onMessage(j.driver, "Driver")}
          >
            <HugeiconsIcon
              icon={Message01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Message driver
          </Button>
          <Button
            variant="outline"
            onClick={() => onMessage(j.shipper, "Shipper")}
          >
            <HugeiconsIcon
              icon={Message01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Message shipper
          </Button>
        </div>
        {late && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onRefund} disabled={!!j.refund}>
              <HugeiconsIcon
                icon={MoneyReceiveSquareIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {j.refund ? "Refund offered" : "Offer a partial refund"}
            </Button>
            <Button variant="outline" onClick={onReassign}>
              <HugeiconsIcon
                icon={UserSwitchIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Reassign to another driver
            </Button>
            <Link
              href="/admin/disputes"
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Escalate to dispute
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function RefundDialog({
  open,
  onOpenChange,
  job,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobState;
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const n = Number(amount);
  const valid = n > 0 && n <= job.price;

  function change(o: boolean) {
    onOpenChange(o);
    if (!o) {
      setAmount("");
      setReason("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="gap-5 sm:max-w-md">
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            onConfirm(n);
            change(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Offer a partial refund</DialogTitle>
            <DialogDescription>
              {job.shipper.name} paid {formatUsd(job.price)} for this job. The
              refund comes out of {firstName(job.driver.name)}’s payout.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="refund-amount">Amount</Label>
              <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
                <InputGroupInput
                  id="refund-amount"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  aria-invalid={amount !== "" && !valid}
                />
              </InputGroup>
              <div className="flex flex-wrap gap-1.5">
                {[10, 15, 25].map((pct) => {
                  const v = Math.round((job.price * pct) / 100);
                  return (
                    <Button
                      key={pct}
                      type="button"
                      variant="secondary"
                      size="xs"
                      className="tabular-nums"
                      onClick={() => setAmount(String(v))}
                    >
                      {pct}% · {formatUsd(v)}
                    </Button>
                  );
                })}
              </div>
              {amount !== "" && !valid && (
                <p className="text-xs text-destructive">
                  Enter up to {formatUsd(job.price)}.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="refund-reason">Note to the shipper</Label>
              <Textarea
                id="refund-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Sorry for the delay. Here is part of your payment back."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => change(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              {valid ? `Offer ${formatUsd(n)} refund` : "Offer refund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReassignDialog({
  open,
  onOpenChange,
  job,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobState;
  onConfirm: (driver: Driver) => void;
}) {
  const [name, setName] = useState("");
  const options = availableDrivers
    .filter((d) => d.name !== job.driver.name)
    .map((d) => ({ value: d.name, label: `${d.name} · ${d.detail}` }));
  const picked = availableDrivers.find((d) => d.name === name);

  function change(o: boolean) {
    onOpenChange(o);
    if (!o) setName("");
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign {job.id}</DialogTitle>
          <DialogDescription>
            {job.driver.name} is taken off the job and the new driver picks up
            where it is now. {job.shipper.name} is told who’s coming.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reassign-driver">New driver</Label>
          <OptionSelect
            id="reassign-driver"
            value={name}
            onChange={setName}
            options={options}
            placeholder="Choose a driver"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => change(false)}>
            Cancel
          </Button>
          <Button
            disabled={!picked}
            onClick={() => {
              if (!picked) return;
              onConfirm(picked);
              change(false);
            }}
          >
            Reassign job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
