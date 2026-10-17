"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  Lane,
  Perforation,
  Tag,
} from "@/features/shipment/components/shipment-ticket";
import {
  carrierCapacity,
  currentVehicle,
  isCarrier,
  kindLabel,
  spaceLabel,
  type TripDraft,
} from "@/features/trip/trip-draft";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatDay, placeholderPlace } from "@/lib/wizard";

function Meter({ segments, taken }: { segments: number; taken: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }, (_, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional.
          key={i}
          layout
          className={cn(
            "h-2 flex-1 rounded-full",
            i < taken ? "bg-foreground" : "bg-foreground/10",
          )}
        />
      ))}
    </div>
  );
}

export function tripPriceLabel(d: TripDraft) {
  const amount = Number(d.price);
  if (!amount) return "Set your price";
  if (d.pricing === "spot") return `From ${formatUsd(amount)} per car`;
  if (d.pricing === "cuft")
    return `${formatUsd(amount, amount % 1 ? 2 : 0)} per cu ft`;
  return `${formatUsd(amount)} per pallet`;
}

/** Mirrors the homepage truck-space ticket, filled from the draft. */
export function ShareTripPreview({ draft }: { draft: TripDraft }) {
  const vehicle = currentVehicle(draft);
  const carrier = isCarrier(draft);
  const capacity = carrier ? carrierCapacity(draft) : 10;
  const segments = Math.min(capacity, 10);
  const taken = carrier
    ? Math.round(((capacity - draft.spots) / capacity) * segments)
    : 0;
  const via = draft.stops
    .map((s) => s.place?.code)
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      inert
      className="flex select-none flex-col rounded-2xl bg-muted/50 text-sm"
    >
      <div className="flex flex-col gap-6 p-5 pb-4">
        <div className="flex h-6 items-center gap-2">
          <Tag>{vehicle ? kindLabel(vehicle.kind) : "Your vehicle"}</Tag>
          <span className="truncate text-xs text-muted-foreground">
            {draft.departure
              ? `Departs ${formatDay(draft.departure)}`
              : "Departure date"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Lane
            from={draft.start ?? placeholderPlace("Start city")}
            to={draft.end ?? placeholderPlace("End city")}
          />
          {via && (
            <p className="truncate text-center text-xs text-muted-foreground">
              Via {via}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <GradientAvatar seed="You" />
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">
              {vehicle?.name ?? "You"}
            </h3>
            <p className="inline-flex items-center gap-1 text-muted-foreground">
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={2}
                className="size-3.5 fill-foreground text-foreground"
              />
              New driver
            </p>
          </div>
        </div>
      </div>
      <Perforation />
      <div className="mt-auto flex flex-col gap-3 p-5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-muted-foreground">Space</p>
          <p className="text-xs font-medium">{spaceLabel(draft)}</p>
        </div>
        <Meter segments={segments} taken={taken} />
        <p
          className={cn(
            "pt-1 font-heading text-xl font-semibold",
            !Number(draft.price) && "text-muted-foreground",
          )}
        >
          {tripPriceLabel(draft)}
        </p>
      </div>
    </div>
  );
}
