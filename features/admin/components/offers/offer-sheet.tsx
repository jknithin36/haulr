"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DetailSection,
  Facts,
  FlagChips,
} from "@/features/admin/components/marketplace/detail-kit";
import type {
  Moderation,
  OfferAction,
} from "@/features/admin/components/offers/offers-view";
import { type AdminOffer, offerTone } from "@/lib/demo-data/admin/offers";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OfferSheet({
  offer,
  mod,
  onOpenChange,
  onAction,
}: {
  offer: AdminOffer | null;
  mod: Moderation;
  onOpenChange: (open: boolean) => void;
  onAction: (action: OfferAction, offer: AdminOffer) => void;
}) {
  const [shown, setShown] = useState<AdminOffer | null>(offer);
  if (offer && offer !== shown) setShown(offer);
  const o = offer ?? shown;

  return (
    <Sheet open={!!offer} onOpenChange={onOpenChange}>
      <SheetContent
        initialFocus={(type) => type === "keyboard"}
        className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-md"
      >
        {o && <OfferDetail offer={o} mod={mod} onAction={onAction} />}
      </SheetContent>
    </Sheet>
  );
}

function OfferDetail({
  offer: o,
  mod,
  onAction,
}: {
  offer: AdminOffer;
  mod: Moderation;
  onAction: (action: OfferAction, offer: AdminOffer) => void;
}) {
  const suspended = mod.suspended.has(o.userId);
  const warned = mod.warned.has(o.userId);
  const open = o.status === "Active" || o.status === "Flagged";
  const pct = Math.round((o.amount / o.budget) * 100);

  return (
    <>
      <SheetHeader className="gap-3 px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 pr-8">
          <span className="text-xs text-muted-foreground tabular-nums">
            {o.id}
          </span>
          <StatusBadge tone={offerTone[o.status]}>{o.status}</StatusBadge>
        </div>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
          {formatUsd(o.amount)}{" "}
          <span className="text-base font-normal text-muted-foreground">
            on a {formatUsd(o.budget)} budget
          </span>
        </SheetTitle>
        <SheetDescription>
          {o.shipmentId} {o.shipment} · sent {o.sent}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-8 px-6 py-4">
        {o.flags && (
          <div className="flex flex-col gap-3 rounded-2xl bg-destructive/5 p-4">
            <p className="font-medium">Why it was flagged</p>
            <FlagChips flags={o.flags} />
          </div>
        )}

        <Facts
          className="sm:grid-cols-2"
          items={[
            { label: "Offer", value: formatUsd(o.amount) },
            { label: "Budget", value: formatUsd(o.budget) },
            { label: "Of budget", value: `${pct}%` },
            { label: "Sent", value: o.sent },
          ]}
        />

        <DetailSection title="Driver">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
            <GradientAvatar seed={o.driver} className="size-9" />
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="font-medium">{o.driver}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                Account {o.userId}
              </span>
            </div>
            {suspended ? (
              <StatusBadge tone="danger">Suspended</StatusBadge>
            ) : warned ? (
              <StatusBadge tone="warning">Warned</StatusBadge>
            ) : null}
          </div>
        </DetailSection>

        <DetailSection title="Message to the shipper">
          <p className="rounded-2xl bg-muted/50 p-4 text-pretty">
            “{o.message}”
          </p>
        </DetailSection>

        <Link
          href={`/admin/shipments/${o.shipmentId}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          View shipment {o.shipmentId}
        </Link>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-wrap gap-2 bg-popover px-6 py-4">
        <Button
          variant="outline"
          disabled={!open}
          onClick={() => onAction("remove", o)}
        >
          Remove offer
        </Button>
        <Button
          variant="outline"
          disabled={warned || suspended}
          onClick={() => onAction("warn", o)}
        >
          {warned ? "Warned" : "Warn user"}
        </Button>
        <Button
          variant="destructive"
          disabled={suspended}
          onClick={() => onAction("suspend", o)}
        >
          {suspended ? "Suspended" : "Suspend user"}
        </Button>
      </div>
    </>
  );
}
