"use client";

import {
  CheckmarkCircle02Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Rating, StatusBadge } from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  depositFor,
  type MyShipment,
  type ShipmentOffer,
  statusLabel,
  statusTone,
} from "@/lib/demo-data/dashboard/shipments";
import { firstName, formatMiles, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-muted/50 px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function OfferRow({
  offer,
  onAccept,
  onProfile,
}: {
  offer: ShipmentOffer;
  onAccept: () => void;
  onProfile: () => void;
}) {
  return (
    <li className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4">
      <div className="flex items-start gap-3">
        <GradientAvatar seed={offer.driver} />
        <div className="min-w-0 flex-1">
          <p className="font-medium">{offer.driver}</p>
          <p className="text-sm text-muted-foreground">
            <Rating value={offer.rating} /> · {offer.jobs} jobs ·{" "}
            {offer.vehicle}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-lg font-semibold tabular-nums">
            {formatUsd(offer.price)}
          </p>
          <p className="text-xs text-muted-foreground">{offer.sent}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Delivers by {offer.deliverBy}
        </p>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={onProfile}>
            View profile
          </Button>
          <Link
            href="/dashboard/messages"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Message
          </Link>
          <Button size="sm" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    </li>
  );
}

function ProfileDialog({
  offer,
  onOpenChange,
}: {
  offer: ShipmentOffer | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={offer !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {offer && (
          <>
            <DialogHeader className="items-center text-center">
              <GradientAvatar seed={offer.driver} className="size-16" />
              <DialogTitle className="pt-2 text-lg">{offer.driver}</DialogTitle>
              <DialogDescription>
                {offer.vehicle} · {offer.jobs} jobs on Haulr
              </DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-3 gap-2 text-center">
              <Fact label="Rating" value={<Rating value={offer.rating} />} />
              <Fact label="Jobs" value={offer.jobs} />
              <Fact label="Offer" value={formatUsd(offer.price)} />
            </dl>
            <Link
              href="/dashboard/messages"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Message {firstName(offer.driver)}
            </Link>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BookedSummary({
  shipment,
  offer,
}: {
  shipment: MyShipment;
  offer: ShipmentOffer;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
          className="mt-0.5 size-5 shrink-0"
        />
        <div className="text-sm">
          <p className="font-medium">
            Booked with {offer.driver} for {formatUsd(offer.price)}
          </p>
          <p className="opacity-80">
            Deposit of {formatUsd(depositFor(offer.price))} paid. The rest (
            {formatUsd(offer.price - depositFor(offer.price))}) is due after
            delivery.
          </p>
        </div>
      </div>
      <section className="flex flex-col gap-3">
        <h3 className="font-semibold">Your driver</h3>
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <GradientAvatar seed={offer.driver} />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{offer.driver}</p>
            <p className="text-sm text-muted-foreground">
              <Rating value={offer.rating} /> · {offer.vehicle} · Delivers by{" "}
              {offer.deliverBy}
            </p>
          </div>
          <Link
            href="/dashboard/messages"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
            Message {firstName(offer.driver)}
          </Link>
        </div>
      </section>
      <p className="text-sm text-muted-foreground">
        Pickup is {shipment.listing?.pickup}. We’ll let you know when{" "}
        {firstName(offer.driver)} is on the way.
      </p>
    </div>
  );
}

function ListingDetails({
  shipment,
  onAccept,
}: {
  shipment: MyShipment;
  onAccept: (offer: ShipmentOffer) => void;
}) {
  const listing = shipment.listing;
  const [pending, setPending] = useState<ShipmentOffer | null>(null);
  const [profile, setProfile] = useState<ShipmentOffer | null>(null);
  if (!listing) return null;

  const accepted = listing.offers.find(
    (o) => o.id === shipment.acceptedOfferId,
  );

  return (
    <>
      <dl className="grid grid-cols-3 gap-2">
        <Fact label="Pickup" value={listing.pickup} />
        <Fact label="Deliver by" value={listing.deliverBy} />
        {accepted ? (
          <Fact label="Price" value={formatUsd(accepted.price)} />
        ) : (
          <Fact label="Budget" value={formatUsd(listing.budget)} />
        )}
      </dl>

      {accepted ? (
        <BookedSummary shipment={shipment} offer={accepted} />
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Offers close in{" "}
              <span className="font-medium text-foreground tabular-nums">
                {listing.closesIn}
              </span>
            </p>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Offers", value: listing.offerCount },
                { label: "Lowest", value: formatUsd(listing.lowest) },
                { label: "Average", value: formatUsd(listing.average) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse rounded-lg bg-background px-2 py-3"
                >
                  <dt className="text-xs text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="font-heading text-lg font-semibold tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <section className="flex flex-col gap-3">
            <h3 className="font-semibold">Offers received</h3>
            <ul className="flex flex-col gap-2">
              {listing.offers.map((offer) => (
                <OfferRow
                  key={offer.id}
                  offer={offer}
                  onAccept={() => setPending(offer)}
                  onProfile={() => setProfile(offer)}
                />
              ))}
            </ul>
          </section>
        </>
      )}

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent>
          {pending && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Accept {firstName(pending.driver)}’s offer for{" "}
                  {formatUsd(pending.price)}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You’ll pay a {formatUsd(depositFor(pending.price))} deposit
                  now and the rest after delivery.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onAccept(pending);
                    setPending(null);
                  }}
                >
                  Accept and pay deposit
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <ProfileDialog
        offer={profile}
        onOpenChange={(open) => !open && setProfile(null)}
      />
    </>
  );
}

function BasicDetails({ shipment }: { shipment: MyShipment }) {
  const { status, driver } = shipment;
  return (
    <>
      <dl className="grid grid-cols-2 gap-2">
        <Fact label="Price" value={shipment.price} />
        <Fact
          label={status === "cancelled" ? "Cancelled" : "Date"}
          value={shipment.date}
        />
      </dl>

      {driver && (
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">Driver</h3>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
            <GradientAvatar seed={driver.name} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{driver.name}</p>
              <p className="text-sm text-muted-foreground">
                <Rating value={driver.rating} /> · {driver.vehicle}
              </p>
            </div>
          </div>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        {status === "draft" &&
          "This shipment hasn’t been posted yet, so drivers can’t see it."}
        {status === "in-transit" &&
          `${driver?.name ?? "Your driver"} is on the way. Follow along live on the tracking page.`}
        {status === "booked" && "Your driver will be in touch before pickup."}
        {status === "delivered" &&
          "Delivered and paid. Thanks for shipping with Haulr."}
        {status === "cancelled" &&
          "This shipment was cancelled before it was booked. Duplicate it to post it again."}
      </p>

      <div className="flex flex-wrap gap-2">
        {status === "draft" && (
          <Link href="/shipments/new" className={cn(buttonVariants())}>
            Finish and post
          </Link>
        )}
        {status === "in-transit" && (
          <Link href="/dashboard/tracking" className={cn(buttonVariants())}>
            Track shipment
          </Link>
        )}
        {(status === "delivered" || status === "cancelled") && (
          <Link href="/shipments/new" className={cn(buttonVariants())}>
            {status === "cancelled"
              ? "Post it again"
              : "Ship something similar"}
          </Link>
        )}
      </div>
    </>
  );
}

export function ShipmentPanel({
  shipment,
  open,
  onOpenChange,
  onAccept,
}: {
  shipment: MyShipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (shipmentId: string, offer: ShipmentOffer) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-xl"
      >
        {shipment && (
          <>
            <SheetHeader className="gap-2 p-6 pb-4">
              <div className="flex items-center gap-2 pr-8">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {shipment.id}
                </span>
                <StatusBadge tone={statusTone[shipment.status]}>
                  {statusLabel[shipment.status]}
                </StatusBadge>
              </div>
              <SheetTitle className="text-xl font-semibold tracking-tight">
                {shipment.item}
              </SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-x-1.5">
                <RouteLabel from={shipment.from} to={shipment.to} />
                {shipment.listing && (
                  <span className="tabular-nums">
                    · {formatMiles(shipment.listing.miles)}
                  </span>
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-6 pb-8">
              {shipment.listing ? (
                <ListingDetails
                  key={shipment.id}
                  shipment={shipment}
                  onAccept={(offer) => onAccept(shipment.id, offer)}
                />
              ) : (
                <BasicDetails shipment={shipment} />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
