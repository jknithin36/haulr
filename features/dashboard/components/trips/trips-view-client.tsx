"use client";

import {
  Calendar03Icon,
  Route02Icon,
  TankerTruckIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState, Rating, StatusBadge } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import { SegmentMeter } from "@/components/ui/segment-meter";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MutedTableHead } from "@/features/dashboard/components/dashboard-table";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import {
  Perforation,
  Tag,
} from "@/features/shipment/components/shipment-ticket";
import type {
  Booking,
  CompletedTrip,
  SpotRequest,
  Trip,
} from "@/lib/demo-data/dashboard/trips";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Each segment of the capacity meter stands for this much space. */
const SEGMENT_CUFT = 50;

export function TripsViewClient({
  trip,
  initialSpotRequests,
  initialBookings,
  completedTrip,
}: {
  trip: Trip;
  initialSpotRequests: SpotRequest[];
  initialBookings: Booking[];
  completedTrip: CompletedTrip;
}) {
  const [requests, setRequests] = useState(initialSpotRequests);
  const [bookings, setBookings] = useState(initialBookings);

  const booked = bookings.reduce((sum, b) => sum + b.cuft, 0);
  const earned = bookings.reduce((sum, b) => sum + b.price, 0);
  const free = trip.capacity - booked;

  function accept(r: SpotRequest) {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    setBookings((prev) => [
      ...prev,
      {
        id: r.id,
        shipper: r.shipper,
        item: r.item,
        cuft: r.cuft,
        price: r.price,
      },
    ]);
  }

  function decline(r: SpotRequest) {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
  }

  return (
    <MotionConfig reducedMotion="user">
      <Tabs defaultValue="upcoming" className="gap-6">
        <DashboardTabsList>
          <TabsTrigger value="upcoming" className="px-3">
            Upcoming (1)
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-3">
            Completed (1)
          </TabsTrigger>
          <TabsTrigger value="drafts" className="px-3">
            Drafts (0)
          </TabsTrigger>
        </DashboardTabsList>

        <TabsContent value="upcoming" className="flex flex-col gap-10">
          <TripSummary trip={trip} booked={booked} earned={earned} />

          <Section
            title="Spot requests"
            count={requests.length}
            description="People asking for space on this trip."
          >
            {requests.length === 0 ? (
              <p className="rounded-2xl bg-muted/50 px-5 py-8 text-center text-muted-foreground">
                No new requests. We’ll let you know when someone asks for space.
              </p>
            ) : (
              <>
                <Table className="max-md:hidden">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <MutedTableHead className="pl-0">Shipper</MutedTableHead>
                      <MutedTableHead>Item</MutedTableHead>
                      <MutedTableHead className="text-right">
                        Space
                      </MutedTableHead>
                      <MutedTableHead className="pl-8">
                        <RouteLabel
                          from="Pickup"
                          to="Dropoff"
                          truncate
                          arrowClassName="opacity-60"
                        />
                      </MutedTableHead>
                      <MutedTableHead className="text-right">
                        Price
                      </MutedTableHead>
                      <MutedTableHead className="pr-0 text-right">
                        <span className="sr-only">Action</span>
                      </MutedTableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence initial={false}>
                      {requests.map((r) => (
                        <motion.tr
                          key={r.id}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="border-b last:border-0"
                        >
                          <TableCell className="py-4 pl-0">
                            <Person name={r.shipper} rating={r.rating} />
                          </TableCell>
                          <TableCell className="py-4">{r.item}</TableCell>
                          <TableCell className="py-4 text-right tabular-nums">
                            {r.cuft} cu ft
                          </TableCell>
                          <TableCell className="py-4 pl-8 text-muted-foreground">
                            <RouteLabel
                              from={r.pickup}
                              to={r.dropoff}
                              truncate
                              arrowClassName="opacity-60"
                            />
                          </TableCell>
                          <TableCell className="py-4 text-right font-medium tabular-nums">
                            {formatUsd(r.price)}
                          </TableCell>
                          <TableCell className="py-4 pr-0">
                            <RequestActions
                              request={r}
                              free={free}
                              onAccept={accept}
                              onDecline={decline}
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                <div className="flex flex-col gap-3 md:hidden">
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Person name={r.shipper} rating={r.rating} />
                        <p className="font-medium tabular-nums">
                          {formatUsd(r.price)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p>
                          {r.item}{" "}
                          <span className="text-muted-foreground">
                            · {r.cuft} cu ft
                          </span>
                        </p>
                        <RouteLabel
                          from={r.pickup}
                          to={r.dropoff}
                          truncate
                          arrowClassName="opacity-60"
                          className="text-muted-foreground"
                        />
                      </div>
                      <RequestActions
                        request={r}
                        free={free}
                        onAccept={accept}
                        onDecline={decline}
                        stretch
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>

          <Section
            title="Confirmed bookings"
            count={bookings.length}
            description="Items you’ve agreed to carry."
          >
            <Table className="max-md:hidden">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <MutedTableHead className="pl-0">Shipper</MutedTableHead>
                  <MutedTableHead>Item</MutedTableHead>
                  <MutedTableHead className="text-right">Space</MutedTableHead>
                  <MutedTableHead className="pr-0 text-right">
                    Price
                  </MutedTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <motion.tr
                    key={b.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b last:border-0"
                  >
                    <TableCell className="py-4 pl-0">
                      <Person name={b.shipper} />
                    </TableCell>
                    <TableCell className="py-4">{b.item}</TableCell>
                    <TableCell className="py-4 text-right tabular-nums">
                      {b.cuft} cu ft
                    </TableCell>
                    <TableCell className="py-4 pr-0 text-right font-medium tabular-nums">
                      {formatUsd(b.price)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-3 md:hidden">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/50 p-4"
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <Person name={b.shipper} />
                    <p className="text-muted-foreground">
                      {b.item} · {b.cuft} cu ft
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">
                    {formatUsd(b.price)}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="completed">
          <CompletedTripSummary trip={completedTrip} />
        </TabsContent>

        <TabsContent value="drafts">
          <EmptyState
            icon={Route02Icon}
            title="No drafts"
            description="Driving somewhere soon? Share your empty space and earn on the way."
            action={
              <Link href="/loads/new" className={cn(buttonVariants())}>
                Share truck space
              </Link>
            }
          />
        </TabsContent>
      </Tabs>
    </MotionConfig>
  );
}

function Section({
  title,
  count,
  description,
  children,
}: {
  title: string;
  count: number;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          {title}{" "}
          <span className="font-normal text-muted-foreground tabular-nums">
            {count}
          </span>
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Person({ name, rating }: { name: string; rating?: number }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <GradientAvatar seed={name} className="size-8" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-medium">{name}</span>
        {rating !== undefined && (
          <Rating value={rating} className="text-xs text-muted-foreground" />
        )}
      </span>
    </span>
  );
}

function RequestActions({
  request: r,
  free,
  onAccept,
  onDecline,
  stretch,
}: {
  request: SpotRequest;
  free: number;
  onAccept: (r: SpotRequest) => void;
  onDecline: (r: SpotRequest) => void;
  stretch?: boolean;
}) {
  const fits = r.cuft <= free;
  return (
    <div className={cn("flex justify-end gap-2", stretch && "*:flex-1")}>
      <Button
        variant="outline"
        onClick={() => onDecline(r)}
        aria-label={`Decline ${r.shipper}’s request`}
      >
        Decline
      </Button>
      <Button
        onClick={() => onAccept(r)}
        disabled={!fits}
        title={fits ? undefined : "Not enough space left"}
        aria-label={`Accept ${r.shipper}’s request`}
      >
        Accept
      </Button>
    </div>
  );
}

function Lane({
  from,
  to,
  stops = [],
}: {
  from: { code: string; city: string };
  to: { code: string; city: string };
  stops?: string[];
}) {
  const legs = stops.length + 1;
  const truckLeg = Math.floor(stops.length / 2);
  const dash = (
    <span className="h-px min-w-3 flex-1 border-t border-dashed border-foreground/25" />
  );
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <p className="font-heading text-3xl font-semibold tracking-tight">
        {from.code}
      </p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: legs }, (_, i) => (
          <Fragment key={stops[i] ?? "end"}>
            {dash}
            {i === truckLeg && (
              <>
                <HugeiconsIcon
                  icon={TankerTruckIcon}
                  strokeWidth={2}
                  className="size-4 shrink-0"
                />
                {dash}
              </>
            )}
            {i < stops.length && (
              <span
                title={stops[i]}
                className="size-1.5 shrink-0 rounded-full bg-foreground/40"
              />
            )}
          </Fragment>
        ))}
      </div>
      <p className="font-heading text-3xl font-semibold tracking-tight">
        {to.code}
      </p>
      <div className="col-span-3 -mt-2 flex justify-between gap-3 text-xs text-muted-foreground">
        <p className="truncate">{from.city}</p>
        <p className="truncate text-right">{to.city}</p>
      </div>
    </div>
  );
}

/** Two-part ticket: trip details on the left, space and money on the right. */
function TripTicket({
  details,
  stats,
}: {
  details: React.ReactNode;
  stats: React.ReactNode;
}) {
  return (
    <div className="grid rounded-2xl bg-muted/50 text-sm md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 p-5 md:p-6">{details}</div>
      <div className="md:hidden">
        <Perforation />
      </div>
      <div className="flex flex-col justify-between gap-6 p-5 md:border-l md:border-dashed md:border-foreground/15 md:p-6">
        {stats}
      </div>
    </div>
  );
}

function TripSummary({
  trip,
  booked,
  earned,
}: {
  trip: Trip;
  booked: number;
  earned: number;
}) {
  const segments = trip.capacity / SEGMENT_CUFT;
  return (
    <TripTicket
      details={
        <>
          <div className="flex items-center gap-2">
            <Tag>{trip.id}</Tag>
            <StatusBadge tone="info">Upcoming</StatusBadge>
          </div>
          <Lane from={trip.from} to={trip.to} stops={trip.stops} />
          <div className="flex flex-col gap-2">
            <p className="font-medium">Stops: {trip.stops.join(", ")}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <HugeiconsIcon
                icon={Calendar03Icon}
                strokeWidth={2}
                className="size-4"
              />
              Departs {trip.departs} · Arrives about {trip.arrives}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <HugeiconsIcon
                icon={TruckIcon}
                strokeWidth={2}
                className="size-4"
              />
              {trip.vehicle}
            </p>
          </div>
        </>
      }
      stats={
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-muted-foreground">Space</p>
              <p className="font-medium tabular-nums">
                {booked} of {trip.capacity} cu ft booked
              </p>
            </div>
            <SegmentMeter segments={segments} filled={booked / trip.capacity} />
            <p className="text-xs text-muted-foreground tabular-nums">
              {trip.capacity - booked} cu ft still free
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Price</dt>
              <dd className="flex items-baseline gap-1">
                <span className="font-heading text-xl font-semibold tabular-nums">
                  {formatUsd(trip.pricePerCuft, 2)}
                </span>
                <span className="text-muted-foreground">per cu ft</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Booked so far</dt>
              <dd>
                <motion.span
                  key={earned}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="font-heading text-xl font-semibold tabular-nums"
                >
                  {formatUsd(earned)}
                </motion.span>
              </dd>
            </div>
          </dl>
        </>
      }
    />
  );
}

function CompletedTripSummary({ trip: t }: { trip: CompletedTrip }) {
  return (
    <TripTicket
      details={
        <>
          <div className="flex items-center gap-2">
            <Tag>{t.id}</Tag>
            <StatusBadge tone="success">Completed</StatusBadge>
          </div>
          <Lane from={t.from} to={t.to} />
          <p className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-4"
            />
            {t.date}
          </p>
        </>
      }
      stats={
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-muted-foreground">Space</p>
              <p className="font-medium tabular-nums">
                {t.booked} of {t.capacity} cu ft
              </p>
            </div>
            <SegmentMeter
              segments={t.capacity / SEGMENT_CUFT}
              filled={t.booked / t.capacity}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground">Earned</p>
            <p className="font-heading text-xl font-semibold tabular-nums">
              {formatUsd(t.earned)}
            </p>
          </div>
        </>
      }
    />
  );
}
