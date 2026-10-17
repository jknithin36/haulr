"use client";

import { Message01Icon, PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ActivityLog,
  ContactCard,
  DetailSection,
} from "@/features/admin/components/marketplace/detail-kit";
import { SpaceMeter } from "@/features/admin/components/marketplace/space-meter";
import type { TripState } from "@/features/admin/components/trips/trips-view";
import { type TripRequest, tripTone } from "@/lib/demo-data/admin/trips";
import { firstName, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const requestTone: Record<TripRequest["status"], StatusTone> = {
  Pending: "info",
  Accepted: "success",
  Declined: "muted",
};

export function TripSheet({
  trip,
  onOpenChange,
  onTogglePause,
  onCancel,
  onContact,
}: {
  trip: TripState | null;
  onOpenChange: (open: boolean) => void;
  onTogglePause: (t: TripState) => void;
  onCancel: (t: TripState) => void;
  onContact: (t: TripState) => void;
}) {
  // Keep the last trip on screen while the sheet slides closed.
  const [shown, setShown] = useState<TripState | null>(trip);
  if (trip && trip !== shown) setShown(trip);
  const t = trip ?? shown;

  return (
    <Sheet open={!!trip} onOpenChange={onOpenChange}>
      <SheetContent
        initialFocus={(type) => type === "keyboard"}
        className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-xl"
      >
        {t && (
          <TripDetail
            trip={t}
            onTogglePause={() => onTogglePause(t)}
            onCancel={() => onCancel(t)}
            onContact={() => onContact(t)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function TripDetail({
  trip: t,
  onTogglePause,
  onCancel,
  onContact,
}: {
  trip: TripState;
  onTogglePause: () => void;
  onCancel: () => void;
  onContact: () => void;
}) {
  const live = t.status === "Upcoming" || t.status === "In progress";
  const free = t.capacity - t.used;
  const stops = [t.from, ...t.stops, t.to];

  return (
    <>
      <SheetHeader className="gap-3 px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 pr-8">
          <span className="text-xs text-muted-foreground tabular-nums">
            {t.id}
          </span>
          <StatusBadge tone={tripTone[t.status]}>{t.status}</StatusBadge>
          {t.paused && (
            <StatusBadge tone="warning">Bookings paused</StatusBadge>
          )}
        </div>
        <SheetTitle className="font-heading text-2xl font-semibold tracking-tight">
          <RouteLabel
            from={t.from}
            to={t.to}
            truncate
            arrowClassName="opacity-60"
          />
        </SheetTitle>
        <SheetDescription>
          {t.vehicle} · departs {t.departs}
          {t.arrives && t.arrives !== t.departs ? `, arrives ${t.arrives}` : ""}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-8 px-6 py-4">
        <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-heading text-xl font-semibold tabular-nums">
              {t.used}{" "}
              <span className="text-base font-normal text-muted-foreground">
                of {t.capacity} {t.unit} booked
              </span>
            </p>
            <p className="font-medium tabular-nums">
              {formatUsd(t.bookedValue)}
            </p>
          </div>
          <SpaceMeter used={t.used} capacity={t.capacity} className="w-full" />
          <p className="text-sm text-muted-foreground tabular-nums">
            {free > 0 ? `${free} ${t.unit} still free` : "Full"}
          </p>
        </div>

        <ContactCard
          label="Driver"
          name={t.driver}
          email={t.driverEmail}
          phone={t.driverPhone}
        />

        <DetailSection title="Route and stops">
          <ol className="flex flex-col">
            {stops.map((s, i) => (
              <li
                key={s}
                className="relative grid grid-cols-[0.875rem_1fr] gap-3 pb-4 last:pb-0"
              >
                {i < stops.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-0 left-1.5 border-l border-dashed border-foreground/25"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-1 size-3.5 rounded-full border-2 border-foreground bg-background",
                    i > 0 &&
                      i < stops.length - 1 &&
                      "size-2.5 mx-0.5 mt-1.5 border-foreground/40",
                    i === stops.length - 1 && "bg-foreground",
                  )}
                />
                <p className="flex flex-col">
                  <span
                    className={cn(
                      i > 0 && i < stops.length - 1
                        ? "text-muted-foreground"
                        : "font-medium",
                    )}
                  >
                    {s}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {i === 0
                      ? `Departs ${t.departs}`
                      : i === stops.length - 1
                        ? `Arrives ${t.arrives}`
                        : "Stop"}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </DetailSection>

        <DetailSection title={`Bookings (${t.bookings.length})`}>
          <ul className="flex flex-col divide-y divide-border rounded-2xl bg-muted/50 px-4">
            {t.bookings.map((b) => (
              <li key={b.shipper} className="flex items-center gap-3 py-3">
                <GradientAvatar seed={b.shipper} className="size-8" />
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-medium">{b.shipper}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {b.item} · {b.space}
                  </span>
                </span>
                <span className="font-medium tabular-nums">
                  {formatUsd(b.price)}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="Spot requests">
          {t.requests.length === 0 ? (
            <p className="text-muted-foreground">No requests on this trip.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border rounded-2xl bg-muted/50 px-4">
              {t.requests.map((r) => (
                <li
                  key={`${r.shipper}-${r.item}`}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="font-medium">{r.shipper}</span>
                    <span className="truncate text-sm text-muted-foreground">
                      {r.item} · {r.space} · {formatUsd(r.price)}
                      {r.note ? ` · ${r.note}` : ""}
                    </span>
                  </span>
                  <StatusBadge tone={requestTone[r.status]}>
                    {r.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </DetailSection>

        <DetailSection title="Payments">
          <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/50 p-4">
            {t.bookings.map((b) => (
              <div
                key={b.shipper}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span>
                  {b.shipper}{" "}
                  <span className="text-muted-foreground">
                    ·{" "}
                    {t.refunded
                      ? "refunded"
                      : t.status === "Completed"
                        ? `paid, released ${t.arrives}`
                        : "paid, held until delivery"}
                  </span>
                </span>
                <span className="tabular-nums">{formatUsd(b.price)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 border-t pt-2.5">
              <span className="text-muted-foreground">
                {t.refunded
                  ? "Refunded to shippers"
                  : t.status === "Completed"
                    ? `Paid out to ${firstName(t.driver)}`
                    : `Payout to ${firstName(t.driver)} after delivery`}
              </span>
              <span className="font-medium tabular-nums">
                {formatUsd(t.bookedValue)}
              </span>
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Activity">
          <ActivityLog entries={t.activity} />
        </DetailSection>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-wrap gap-2 bg-popover px-6 py-4">
        <Button variant="outline" onClick={onContact}>
          <HugeiconsIcon
            icon={Message01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Contact driver
        </Button>
        {live && (
          <>
            <Button variant="outline" onClick={onTogglePause}>
              <HugeiconsIcon
                icon={t.paused ? PlayIcon : PauseIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {t.paused ? "Resume bookings" : "Pause bookings"}
            </Button>
            <Button variant="destructive" onClick={onCancel}>
              Cancel trip and refund all
            </Button>
          </>
        )}
      </div>
    </>
  );
}
