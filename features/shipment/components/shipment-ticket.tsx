"use client";

import { FavouriteIcon, TankerTruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Place } from "@/lib/demo-data/places";
import {
  categoryBadge,
  formatPickup,
  type Shipment,
} from "@/lib/demo-data/shipments";
import { formatMiles, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIX_HOURS = 6 * 60 * 60 * 1000;

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return d > 0
    ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Ticks every second; turns red under 6 hours. */
export function Countdown({
  ms,
  className,
}: {
  ms: number;
  className?: string;
}) {
  // The deadline is set after mount so server and client render the same markup.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = Date.now() + ms;
    const tick = () => setRemaining(deadline - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ms]);

  const value = remaining ?? ms;

  return (
    <span
      className={cn(
        "tabular-nums",
        value < SIX_HOURS && "text-destructive",
        className,
      )}
    >
      {value <= 0 ? "Closed" : formatRemaining(value)}
    </span>
  );
}

/** Big city codes joined by a dashed lane, like a boarding pass. */
export function Lane({ from, to }: { from: Place; to: Place }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <p className="font-heading text-3xl font-semibold tracking-tight">
        {from.code}
      </p>
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 border-t border-dashed border-foreground/25" />
        <HugeiconsIcon
          icon={TankerTruckIcon}
          strokeWidth={2}
          className="size-4 shrink-0"
        />
        <span className="h-px flex-1 border-t border-dashed border-foreground/25" />
      </div>
      <p className="font-heading text-3xl font-semibold tracking-tight">
        {to.code}
      </p>
      <p className="truncate text-xs text-muted-foreground">{from.label}</p>
      <span />
      <p className="truncate text-right text-xs text-muted-foreground">
        {to.label}
      </p>
    </div>
  );
}

/** Dashed tear line between the ticket and its stub. */
export function Perforation() {
  return (
    <div
      className="mx-5 my-1 border-t border-dashed border-foreground/15"
      aria-hidden
    />
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-background px-2.5 text-xs font-medium">
      {children}
    </span>
  );
}

/**
 * Card shell: the whole surface links to `href`, while controls placed with
 * `pointer-events-auto` (like the save button) stay clickable on top.
 */
export function Ticket({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl bg-muted/50 text-sm transition-colors has-[a:hover]:bg-muted has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50",
        className,
      )}
    >
      <Link href={href} className="absolute inset-0 rounded-2xl outline-none">
        <span className="sr-only">{label}</span>
      </Link>
      <div className="pointer-events-none relative flex h-full flex-col">
        {children}
      </div>
    </div>
  );
}

export function SaveButton({
  saved,
  onToggle,
  item,
}: {
  saved: boolean;
  onToggle: () => void;
  item: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${item} from saved` : `Save ${item}`}
      onClick={onToggle}
      className="pointer-events-auto rounded-full hover:bg-background"
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        strokeWidth={2}
        className={cn(saved && "fill-foreground")}
      />
    </Button>
  );
}

export function ShipmentTicket({
  shipment: s,
  saved,
  onToggleSave,
}: {
  shipment: Shipment;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  return (
    <Ticket href={`/shipments/${s.id}`} label={`View shipment: ${s.item}`}>
      <div className="flex flex-col gap-6 p-5 pb-4">
        <div className="flex h-7 items-center gap-2">
          <Tag>{categoryBadge(s.category)}</Tag>
          <span className="truncate text-xs text-muted-foreground">
            {s.offers === 0 ? "No offers yet" : `${s.offers} offers`}
            {s.lowestOffer && ` · Lowest ${formatUsd(s.lowestOffer)}`}
          </span>
          {onToggleSave && (
            <span className="-mr-1.5 ml-auto">
              <SaveButton
                saved={!!saved}
                onToggle={onToggleSave}
                item={s.item}
              />
            </span>
          )}
        </div>
        <Lane from={s.from} to={s.to} />
        <div>
          <h3 className="text-base font-semibold">{s.item}</h3>
          <p className="text-muted-foreground">
            {formatMiles(s.miles)} · Pickup {formatPickup(s)}
          </p>
        </div>
      </div>
      <Perforation />
      <div className="mt-auto flex items-end justify-between gap-3 p-5 pt-3">
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-heading text-xl font-semibold tabular-nums">
            {formatUsd(s.budget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Closes in</p>
          <Countdown
            ms={s.closesInMs}
            className="font-heading text-xl font-semibold"
          />
        </div>
      </div>
    </Ticket>
  );
}
