"use client";

import {
  ArrowLeft02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Rating,
  StatusBadge,
  type StatusTone,
} from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RouteLabel } from "@/components/ui/route-label";
import { Textarea } from "@/components/ui/textarea";
import {
  ActivityLog,
  ConfirmDialog,
  ContactCard,
  DetailSection,
  Facts,
  FlagChips,
} from "@/features/admin/components/marketplace/detail-kit";
import { adminUser } from "@/lib/demo-data/admin/admin-user";
import {
  type ActivityEntry,
  type AdminShipment,
  type AdminShipmentStatus,
  type DetailOffer,
  type InternalNote,
  priceLabel,
  type ShipmentDetail,
  shipmentTone,
} from "@/lib/demo-data/admin/shipments";
import { firstName, formatMiles, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const offerTone: Record<DetailOffer["status"], StatusTone> = {
  Accepted: "success",
  Active: "info",
  "Not chosen": "muted",
  Withdrawn: "muted",
};

export function ShipmentDetailClient({
  shipment: initial,
  detail,
}: {
  shipment: AdminShipment;
  detail: ShipmentDetail;
}) {
  const [shipment, setShipment] = useState(initial);
  const [status, setStatus] = useState<AdminShipmentStatus | "Removed">(
    initial.status,
  );
  const [paused, setPaused] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const [activity, setActivity] = useState<ActivityEntry[]>(detail.activity);
  const [notes, setNotes] = useState<InternalNote[]>(detail.notes);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState<"cancel" | "remove" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const log = (label: string, note?: string) =>
    setActivity((a) => [
      ...a,
      { label, time: "Just now", by: adminUser.name, note },
    ]);

  const closed = status === "Cancelled" || status === "Removed";
  const paid = detail.payment?.lines
    .filter((l) => l.status === "Paid" || l.status === "Held")
    .reduce((sum, l) => sum + l.amount, 0);

  function ask(kind: "cancel" | "remove") {
    setConfirm(kind);
    setConfirmOpen(true);
  }

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setNotes((n) => [
      ...n,
      { text, by: adminUser.firstName, time: "just now" },
    ]);
    setDraft("");
  }

  const facts = [
    {
      label: shipment.priceKind === "budget" ? "Budget" : "Price",
      value: shipment.amount === null ? "—" : formatUsd(shipment.amount),
    },
    { label: "Offers", value: shipment.offers ?? "—" },
    {
      label: "Posted",
      value: shipment.status === "Draft" ? "Not yet" : shipment.posted,
    },
    { label: "Category", value: shipment.category },
    ...(detail.pickupWindow
      ? [{ label: "Pickup", value: detail.pickupWindow }]
      : []),
    ...(detail.deliverBy
      ? [{ label: "Delivery", value: `Expected ${detail.deliverBy}` }]
      : []),
    ...(detail.miles
      ? [
          {
            label: "Distance",
            value: formatMiles(detail.miles),
          },
        ]
      : []),
    ...(detail.driver
      ? [{ label: "Vehicle", value: detail.driver.vehicle }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <Link
          href="/admin/shipments"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            strokeWidth={2}
            className="size-4"
          />
          Shipments
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground tabular-nums">
                {shipment.id}
              </span>
              <StatusBadge
                tone={status === "Removed" ? "muted" : shipmentTone[status]}
              >
                {status}
              </StatusBadge>
              {paused && !closed && (
                <StatusBadge tone="warning">Offers paused</StatusBadge>
              )}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              {shipment.item}
            </h1>
            <RouteLabel
              truncate
              arrowClassName="opacity-60"
              from={shipment.from}
              to={shipment.to}
              className="text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={closed}
              onClick={() => setEditing(true)}
            >
              <HugeiconsIcon
                icon={Edit02Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Edit
            </Button>
            <Button
              variant="outline"
              disabled={closed}
              onClick={() => {
                setPaused((p) => !p);
                log(paused ? "Offers resumed" : "Offers paused");
              }}
            >
              <HugeiconsIcon
                icon={paused ? PlayIcon : PauseIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {paused ? "Resume offers" : "Pause offers"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="More actions"
                    disabled={closed}
                  />
                }
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => ask("cancel")}
                >
                  Cancel and refund
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => ask("remove")}
                >
                  Remove listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {closed && (
        <p className="rounded-2xl bg-muted/50 px-5 py-4 text-sm">
          {status === "Removed"
            ? "This listing was removed. Only admins can see this page now."
            : `Cancelled. ${shipment.shipper} has been refunded ${formatUsd(paid ?? 0)}.`}
        </p>
      )}

      {detail.flags && (
        <div className="flex flex-col gap-3 rounded-2xl bg-destructive/5 p-5">
          <p className="font-medium">Flagged by our checks</p>
          <FlagChips flags={detail.flags} />
          <p className="text-sm text-muted-foreground">
            Hidden from drivers until someone reviews it.
          </p>
        </div>
      )}

      {status === "Disputed" && (
        <div className="flex flex-col gap-3 rounded-2xl bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium">Open dispute DSP-208.</span>{" "}
            <span className="text-muted-foreground">
              Laura Chen reported damage on arrival.
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

      <Facts items={facts} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-10">
          {detail.description && (
            <DetailSection title="Description">
              <p className="text-pretty">{detail.description}</p>
            </DetailSection>
          )}

          <DetailSection title="Pickup and dropoff">
            <ol className="flex flex-col rounded-2xl bg-muted/50 p-5">
              <Stop
                label="Pickup"
                when={detail.pickupWindow}
                address={detail.pickupAddress}
                first
              />
              <Stop
                label="Dropoff"
                when={detail.deliverBy && `by ${detail.deliverBy}`}
                address={detail.dropoffAddress}
              />
            </ol>
          </DetailSection>

          <DetailSection
            title={`Offers${detail.offers.length ? ` (${detail.offers.length})` : ""}`}
          >
            {detail.offers.length === 0 ? (
              <p className="rounded-2xl bg-muted/50 px-5 py-6 text-muted-foreground">
                {shipment.offers === 0
                  ? "No offers. Drivers can’t see this listing while it’s flagged."
                  : shipment.offers === null
                    ? "No offers. The listing isn’t posted yet."
                    : `${shipment.offers} offers. Open the Offers page to review them one by one.`}
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border rounded-2xl bg-muted/50 px-5">
                {detail.offers.map((o) => (
                  <li
                    key={o.id}
                    className={cn(
                      "flex items-center gap-4 py-3.5",
                      o.status === "Withdrawn" && "text-muted-foreground",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <GradientAvatar seed={o.driver} className="size-8" />
                      <div className="flex min-w-0 flex-col leading-tight">
                        <span className="flex items-center gap-2 font-medium">
                          {o.driver}
                          <Rating
                            value={o.rating}
                            className="text-xs font-normal text-muted-foreground"
                          />
                        </span>
                        <span className="truncate text-sm text-muted-foreground">
                          {o.vehicle} · {o.id} · sent {o.sent}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <StatusBadge tone={offerTone[o.status]}>
                        {o.status}
                      </StatusBadge>
                      <span
                        className={cn(
                          "text-right font-medium tabular-nums sm:w-16",
                          o.status === "Withdrawn" && "line-through",
                        )}
                      >
                        {formatUsd(o.amount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>

          {detail.messages.length > 0 && (
            <DetailSection
              title="Messages"
              action={
                <span className="text-xs text-muted-foreground">Read only</span>
              }
            >
              <ul className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5">
                {detail.messages.map((m) => (
                  <li key={m.time} className="flex gap-3">
                    <GradientAvatar seed={m.from} className="size-8" />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="text-sm">
                        <span className="font-medium">{firstName(m.from)}</span>{" "}
                        <span className="text-muted-foreground tabular-nums">
                          {m.time}
                        </span>
                      </p>
                      <p className="text-pretty">{m.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection title="Activity">
            <div className="rounded-2xl bg-muted/50 p-5">
              <ActivityLog entries={activity} />
            </div>
          </DetailSection>
        </div>

        <aside className="flex flex-col gap-10">
          <DetailSection title="People">
            <div className="flex flex-col gap-3">
              <ContactCard label="Shipper" {...detail.shipper} />
              {detail.driver && (
                <ContactCard
                  label="Driver"
                  {...detail.driver}
                  note={`${detail.driver.note}${detail.driver.plate ? ` · ${detail.driver.plate}` : ""}`}
                />
              )}
            </div>
          </DetailSection>

          {detail.payment && (
            <DetailSection title="Payment">
              <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5">
                {detail.payment.lines.map((l) => (
                  <div
                    key={l.label}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{l.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {refunded ? "Refunded just now" : l.when}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-medium tabular-nums">
                        {formatUsd(l.amount)}
                      </span>
                      <StatusBadge
                        tone={
                          refunded
                            ? "muted"
                            : l.status === "Paid"
                              ? "success"
                              : "warning"
                        }
                      >
                        {refunded ? "Refunded" : l.status}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium tabular-nums">
                    {formatUsd(detail.payment.total)}
                  </span>
                </div>
              </div>
            </DetailSection>
          )}

          <DetailSection title="Internal notes">
            <div className="flex flex-col gap-3">
              {notes.map((n, i) => (
                <figure
                  // biome-ignore lint/suspicious/noArrayIndexKey: notes only append.
                  key={i}
                  className="flex flex-col gap-1 rounded-2xl bg-muted/50 p-4"
                >
                  <blockquote className="text-pretty">“{n.text}”</blockquote>
                  <figcaption className="text-sm text-muted-foreground">
                    {n.by}, {n.time}
                  </figcaption>
                </figure>
              ))}
              <form onSubmit={addNote} className="flex flex-col gap-2">
                <Label htmlFor="note" className="sr-only">
                  Add internal note
                </Label>
                <Textarea
                  id="note"
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Only admins can see notes."
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-fit"
                  disabled={!draft.trim()}
                >
                  Add note
                </Button>
              </form>
            </div>
          </DetailSection>
        </aside>
      </div>

      <EditDialog
        open={editing}
        onOpenChange={setEditing}
        shipment={shipment}
        onSave={(next) => {
          setShipment(next);
          log("Listing edited", "Changed by an admin");
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          confirm === "cancel"
            ? `Cancel ${shipment.id} and refund?`
            : `Remove ${shipment.id}?`
        }
        description={
          confirm === "cancel"
            ? `${shipment.shipper} gets ${formatUsd(paid ?? 0)} back${detail.driver ? ` and ${detail.driver.name} is told the job is off` : ""}. This can’t be undone.`
            : `The listing comes off Haulr right away and ${shipment.shipper} is told why. Open offers are closed.`
        }
        confirmLabel={
          confirm === "cancel" ? "Cancel and refund" : "Remove listing"
        }
        cancelLabel="Keep it"
        onConfirm={() => {
          if (confirm === "cancel") {
            setStatus("Cancelled");
            setRefunded(true);
            log(
              "Cancelled",
              paid
                ? `${formatUsd(paid)} refunded to ${shipment.shipper}`
                : undefined,
            );
          } else {
            setStatus("Removed");
            log("Listing removed");
          }
        }}
      />
    </div>
  );
}

function Stop({
  label,
  when,
  address,
  first,
}: {
  label: string;
  when?: string;
  address: string;
  first?: boolean;
}) {
  return (
    <li className="relative grid grid-cols-[0.875rem_1fr] gap-3 pb-5 last:pb-0">
      {first && (
        <span
          aria-hidden
          className="absolute top-4 bottom-0 left-1.5 border-l border-dashed border-foreground/25"
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative mt-1 size-3.5 rounded-full border-2 border-foreground bg-background",
          !first && "bg-foreground",
        )}
      />
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-muted-foreground">
          {label}
          {when ? ` · ${when}` : ""}
        </p>
        <p className="font-medium">{address}</p>
      </div>
    </li>
  );
}

function EditDialog({
  open,
  onOpenChange,
  shipment,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: AdminShipment;
  onSave: (s: AdminShipment) => void;
}) {
  const [item, setItem] = useState(shipment.item);
  const [amount, setAmount] = useState(String(shipment.amount ?? ""));
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setItem(shipment.item);
      setAmount(String(shipment.amount ?? ""));
    }
  }
  const n = Number(amount);
  const valid = item.trim().length > 0 && (amount === "" || n > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            onSave({
              ...shipment,
              item: item.trim(),
              amount: amount === "" ? null : n,
            });
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit {shipment.id}</DialogTitle>
            <DialogDescription>
              {shipment.shipper} is told about any change.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-item">Item</Label>
              <Input
                id="edit-item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-amount">
                {shipment.priceKind === "budget" ? "Budget" : "Price"} (USD)
              </Label>
              <Input
                id="edit-amount"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              />
              <p className="text-xs text-muted-foreground">
                Now {priceLabel(shipment)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
