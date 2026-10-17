"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import type { SavedShipment, SavedTrip } from "@/lib/demo-data/dashboard/saved";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

function SavedRow({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <motion.li
      layout
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4 md:flex-row md:items-center md:gap-6 md:px-5"
    >
      {children}
      <div className="flex gap-2 md:ml-auto">{actions}</div>
    </motion.li>
  );
}

function SavedRowActions({
  href,
  label,
  onRemove,
}: {
  href: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex-1 md:flex-none",
        )}
      >
        View
      </Link>
      <Button
        variant="ghost"
        className="flex-1 md:flex-none"
        onClick={onRemove}
        aria-label={`Remove ${label} from saved`}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          strokeWidth={2}
          className="fill-foreground"
        />
        Remove
      </Button>
    </>
  );
}

function ShipmentRow({
  shipment: s,
  onRemove,
}: {
  shipment: SavedShipment;
  onRemove: () => void;
}) {
  return (
    <SavedRow
      actions={
        <SavedRowActions href={s.href} label={s.item} onRemove={onRemove} />
      }
    >
      <div className="flex min-w-0 flex-col gap-1 md:w-64">
        <p className={cn("font-medium", s.closed && "text-muted-foreground")}>
          {s.item}
        </p>
        <RouteLabel
          from={s.from}
          to={s.to}
          className="text-sm text-muted-foreground"
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:gap-6">
        <p className={cn("tabular-nums", s.closed && "text-muted-foreground")}>
          <span className="text-muted-foreground">Budget </span>
          {formatUsd(s.budget)}
        </p>
        {s.closed ? (
          <StatusBadge tone="muted">No longer available</StatusBadge>
        ) : (
          <p className="text-muted-foreground">{s.status}</p>
        )}
      </div>
    </SavedRow>
  );
}

function TripRow({
  trip: t,
  onRemove,
}: {
  trip: SavedTrip;
  onRemove: () => void;
}) {
  return (
    <SavedRow
      actions={
        <SavedRowActions
          href={t.href}
          label={`${t.driver}’s trip`}
          onRemove={onRemove}
        />
      }
    >
      <div className="flex min-w-0 items-center gap-3 md:w-64">
        <GradientAvatar seed={t.driver} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-medium">{t.driver}</p>
          <RouteLabel
            from={t.from}
            to={t.to}
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:gap-6">
        <p className="tabular-nums">{t.rate}</p>
        <p className="text-muted-foreground tabular-nums">{t.spaceLeft}</p>
      </div>
    </SavedRow>
  );
}

function NothingSaved() {
  return (
    <EmptyState
      icon={FavouriteIcon}
      title="Nothing saved yet."
      description="Tap the heart on any shipment or trip to save it."
    />
  );
}

export function SavedViewClient({
  initialShipments,
  initialTrips,
}: {
  initialShipments: SavedShipment[];
  initialTrips: SavedTrip[];
}) {
  const [shipments, setShipments] = useState(initialShipments);
  const [trips, setTrips] = useState(initialTrips);

  return (
    <MotionConfig reducedMotion="user">
      <Tabs defaultValue="shipments">
        <DashboardTabsList>
          <TabsTrigger value="shipments" className="px-3">
            Shipments ({shipments.length})
          </TabsTrigger>
          <TabsTrigger value="trips" className="px-3">
            Trips ({trips.length})
          </TabsTrigger>
        </DashboardTabsList>

        <TabsContent value="shipments" className="pt-3">
          {shipments.length === 0 ? (
            <NothingSaved />
          ) : (
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {shipments.map((s) => (
                  <ShipmentRow
                    key={s.id}
                    shipment={s}
                    onRemove={() =>
                      setShipments((list) => list.filter((x) => x.id !== s.id))
                    }
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </TabsContent>

        <TabsContent value="trips" className="pt-3">
          {trips.length === 0 ? (
            <NothingSaved />
          ) : (
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {trips.map((t) => (
                  <TripRow
                    key={t.id}
                    trip={t}
                    onRemove={() =>
                      setTrips((list) => list.filter((x) => x.id !== t.id))
                    }
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </MotionConfig>
  );
}
