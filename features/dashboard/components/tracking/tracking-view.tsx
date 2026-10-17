import {
  Call02Icon,
  Location01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  EmptyState,
  Panel,
  Rating,
  StatusBadge,
} from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Progress } from "@/components/ui/progress";
import { RouteLabel } from "@/components/ui/route-label";
import { LazyTrackingMap } from "@/features/dashboard/components/tracking/lazy-tracking-map";
import { PickupPhotos } from "@/features/dashboard/components/tracking/pickup-photos";
import { ShareTrackingLink } from "@/features/dashboard/components/tracking/share-tracking-link";
import { getTracking } from "@/features/dashboard/dashboard-queries";
import type {
  ActiveShipment,
  TrackingStep,
} from "@/lib/demo-data/dashboard/tracking";
import { formatMiles, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

function Timeline({ steps }: { steps: TrackingStep[] }) {
  const current = steps.findLastIndex((s) => s.done);
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={`${step.label}-${step.time}`}
            className="relative grid grid-cols-[1.25rem_1fr] gap-x-3 pb-6 last:pb-0"
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-4 bottom-0 left-[calc(0.625rem-1px)] w-0.5 rounded-full",
                  steps[i + 1].done ? "bg-foreground" : "bg-foreground/15",
                )}
              />
            )}
            <span className="flex h-5 items-center justify-center">
              <span
                className={cn(
                  "rounded-full",
                  step.done
                    ? "bg-foreground"
                    : "border-2 border-foreground/25 bg-background",
                  i === current ? "size-3.5" : "size-2.5",
                )}
              />
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={cn(
                    "font-medium",
                    !step.done && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {step.time}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{step.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ActiveShipmentDetails({ shipment }: { shipment: ActiveShipment }) {
  const { driver } = shipment;
  const pickedUp = shipment.timeline.find((s) => s.label === "Picked up");

  return (
    <div className="flex flex-col gap-4">
      <Panel className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground tabular-nums">
                {shipment.id}
              </span>
              <StatusBadge tone="info">In transit</StatusBadge>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              {shipment.item}
            </h2>
            <RouteLabel
              from={shipment.from}
              to={shipment.to}
              className="text-muted-foreground"
            />
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-muted-foreground">Estimated arrival</p>
            <p className="font-medium">{shipment.eta}</p>
          </div>
        </div>

        <div className="h-72 overflow-hidden rounded-xl bg-background md:h-[380px]">
          <LazyTrackingMap
            traveled={shipment.traveled}
            remaining={shipment.remaining}
            truck={[shipment.location.lng, shipment.location.lat]}
            fromLabel={shipment.from.split(",")[0]}
            toLabel={shipment.to.split(",")[0]}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <p className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Location01Icon}
                strokeWidth={2}
                className="size-4 text-muted-foreground"
              />
              <span className="text-muted-foreground">Current location:</span>
              <span className="font-medium">{shipment.location.label}</span>
            </p>
            <p className="text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">
                {formatNumber(shipment.milesDone)}
              </span>{" "}
              of {formatMiles(shipment.milesTotal)} ({shipment.progress}%)
            </p>
          </div>
          <Progress
            value={shipment.progress}
            aria-label="Trip progress"
            className="[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-foreground/10"
          />
        </div>
      </Panel>

      <div className="grid items-start gap-4 md:grid-cols-5">
        <Panel className="flex flex-col gap-5 md:col-span-3">
          <SectionTitle>Timeline</SectionTitle>
          <Timeline steps={shipment.timeline} />
        </Panel>

        <Panel className="flex flex-col gap-5 md:col-span-2">
          <SectionTitle>Driver</SectionTitle>
          <div className="flex items-center gap-3">
            <GradientAvatar seed={driver.name} className="size-12" />
            <div className="min-w-0">
              <p className="font-medium">{driver.name}</p>
              <p className="text-sm text-muted-foreground">
                <Rating value={driver.rating} />
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col gap-0.5 rounded-xl bg-background px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">Vehicle</dt>
              <dd className="font-medium">{driver.vehicle}</dd>
            </div>
            <div className="flex flex-col gap-0.5 rounded-xl bg-background px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">Plate</dt>
              <dd className="font-medium tabular-nums">{driver.plate}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/messages"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
              Message {driver.firstName}
            </Link>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <a
                href={`tel:${driver.phone}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                <HugeiconsIcon icon={Call02Icon} strokeWidth={2} />
                Call
              </a>
              <ShareTrackingLink shipmentId={shipment.id} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <SectionTitle>Pickup photos</SectionTitle>
          {pickedUp && (
            <p className="text-sm text-muted-foreground">
              Taken at pickup, {pickedUp.time}
            </p>
          )}
        </div>
        <PickupPhotos
          photos={shipment.photos}
          item={shipment.item}
          takenAt={pickedUp?.time ?? ""}
        />
      </Panel>
    </div>
  );
}

export async function TrackingView() {
  const { active, past } = await getTracking();
  return (
    <div className="flex flex-col gap-10">
      {active ? (
        <ActiveShipmentDetails shipment={active} />
      ) : (
        <EmptyState
          icon={Location01Icon}
          title="Nothing on the move right now."
          description="Booked shipments will show up here."
        />
      )}

      {past.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Past tracking</SectionTitle>
          <ul className="flex flex-col gap-2">
            {past.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between md:px-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">{s.item}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {s.id}
                    </span>
                  </p>
                  <RouteLabel
                    from={s.from}
                    to={s.to}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge tone="success">
                    Delivered {s.delivered}
                  </StatusBadge>
                  <Link
                    href="/dashboard/shipments"
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    View details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
