import { CheckmarkBadge01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MotionConfig } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/ui/cta-band";
import { Rating } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import { MessageDialog } from "@/features/message/components/message-dialog";
import { BookingPanel } from "@/features/trip/components/booking-panel";
import { SpaceDiagram } from "@/features/trip/components/space-diagram";
import { TripActions } from "@/features/trip/components/trip-actions";
import { TripBreadcrumb } from "@/features/trip/components/trip-breadcrumb";
import { TripTicket } from "@/features/trip/components/trip-card";
import { TripGallery } from "@/features/trip/components/trip-gallery";
import { TripRouteMap } from "@/features/trip/components/trip-route-map";
import { getOtherTrips, getTrip } from "@/features/trip/trip-queries";
import {
  cityName,
  destination,
  formatDay,
  formatSchedule,
  origin,
  type Trip,
  vehicleLabel,
} from "@/lib/demo-data/trips";
import { firstName, formatMiles } from "@/lib/format";
import { cn } from "@/lib/utils";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/* ----------------------------- Trip plan ---------------------------- */

function TripPlan({ trip }: { trip: Trip }) {
  const last = trip.stops.length - 1;
  return (
    <Section title="Trip plan">
      <div className="grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
        <ol className="flex flex-col rounded-2xl bg-muted/50 p-5">
          {trip.stops.map((s, i) => {
            const kind =
              i === 0 ? "Departure" : i === last ? "Arrival" : "Stop";
            return (
              <li
                key={s.place.code}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {i < last && (
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-0 left-[6px] border-l border-dashed border-foreground/25"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-1 block size-3.5 shrink-0 rounded-full",
                    i === 0 && "border-[3px] border-foreground bg-background",
                    i === last && "bg-foreground",
                    i > 0 &&
                      i < last &&
                      "mx-[2px] mt-[6px] size-2.5 border-2 border-foreground bg-background",
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <p className="font-medium">{s.place.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDay(s.date)} · {kind}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="h-72 overflow-hidden rounded-2xl bg-muted/50 md:h-auto md:min-h-72">
          <TripRouteMap stops={trip.stops} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Pickups and dropoffs are possible at any stop.
      </p>
    </Section>
  );
}

/* ------------------------------- Driver ----------------------------- */

function DriverCard({ trip }: { trip: Trip }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-muted/50 p-5">
      <GradientAvatar seed={trip.driver} className="size-12" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-semibold">{trip.driver}</p>
        <p className="text-sm text-muted-foreground">
          <Rating value={trip.rating} className="proportional-nums" /> ·{" "}
          {trip.completedTrips} trips · Member since {trip.memberSince}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {trip.verified && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-background px-2.5 text-xs font-medium">
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              Verified
            </span>
          )}
          <Link
            href={`/drivers/${trip.id}`}
            className="text-sm underline-offset-4 hover:underline"
          >
            View profile
          </Link>
        </div>
      </div>
      <MessageDialog
        name={trip.driver}
        context={`${cityName(origin(trip).place)} to ${cityName(destination(trip).place)} · Departs ${formatDay(origin(trip).date)}`}
        suggestions={[
          "Is there still space?",
          "Can you pick up near my address?",
          "When would you arrive?",
        ]}
        trigger={<Button variant="outline" size="lg" />}
      />
    </div>
  );
}

function Reviews({ trip }: { trip: Trip }) {
  return (
    <Section title="Reviews">
      <ul className="grid gap-3 sm:grid-cols-2">
        {trip.reviews.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5"
          >
            <span
              role="img"
              aria-label={`${r.rating} out of 5 stars`}
              className="flex gap-0.5"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <HugeiconsIcon
                  // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional.
                  key={i}
                  icon={StarIcon}
                  strokeWidth={2}
                  className={cn(
                    "size-3.5",
                    i < r.rating
                      ? "fill-foreground text-foreground"
                      : "text-foreground/25",
                  )}
                />
              ))}
            </span>
            <blockquote className="flex-1 text-pretty">“{r.text}”</blockquote>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <GradientAvatar seed={r.author} className="size-6" />
              {r.author}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function NextSteps({ trip }: { trip: Trip }) {
  const driver = firstName(trip.driver);
  const cargo = trip.carries.includes("cars") ? "your car" : "your items";
  const steps = [
    `${driver} accepts your request.`,
    "You pay a deposit to confirm your spot.",
    `${driver} picks up ${cargo} and you track it live.`,
  ];
  return (
    <section className="flex flex-col gap-3 px-1">
      <h2 className="text-lg font-semibold">What happens next</h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="pt-0.5 text-pretty">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------- Page ------------------------------ */

export async function TripDetail({ id }: { id: string }) {
  const trip = await getTrip(id);
  const others = await getOtherTrips(trip);
  const from = origin(trip);
  const to = destination(trip);
  const title = `${from.place.label} to ${to.place.label}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-6 pb-16 md:pb-24">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TripBreadcrumb trip={trip} />
          <TripActions title={title} />
        </div>

        <TripGallery
          title={`${trip.driver}’s ${vehicleLabel(trip.vehicle).toLowerCase()}`}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex flex-col gap-3">
              <span className="inline-flex h-6 w-fit items-center rounded-full bg-muted px-2.5 text-xs font-medium">
                {vehicleLabel(trip.vehicle)}
              </span>
              <h1 className="flex text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                <RouteLabel
                  from={from.place.label}
                  to={to.place.label}
                  className="gap-x-2.5"
                  arrowClassName="size-6 md:size-7"
                />
              </h1>
              <p className="text-lg text-muted-foreground">
                {formatSchedule(trip)} · {formatMiles(trip.miles)}
              </p>
            </div>

            <TripPlan trip={trip} />

            <Section title="Space available">
              <SpaceDiagram trip={trip} />
            </Section>

            <Section title="About the vehicle">
              <dl className="grid gap-x-8 sm:grid-cols-2">
                {[
                  { label: "Vehicle", value: trip.about.headline },
                  { label: "Can carry", value: trip.about.canCarry },
                  { label: "Insurance", value: trip.about.insurance },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex flex-col gap-0.5 border-b border-dashed border-foreground/10 py-3 first:sm:col-span-2"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="font-medium">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section title="Driver">
              <DriverCard trip={trip} />
            </Section>

            <Section title="Driver notes">
              <blockquote className="rounded-2xl bg-muted/50 p-5 text-pretty">
                “{trip.notes}”
              </blockquote>
            </Section>

            <Reviews trip={trip} />
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
            <BookingPanel trip={trip} />
            <NextSteps trip={trip} />
          </aside>
        </div>

        <section
          id="other-trips"
          className="flex scroll-mt-24 flex-col gap-6 pt-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            Other trips on this route
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <li key={other.id}>
                <TripTicket trip={other} />
              </li>
            ))}
          </ul>
        </section>

        <CtaBand>
          <p className="font-medium">Can’t find the right trip?</p>
        </CtaBand>
      </div>
    </MotionConfig>
  );
}

export function TripDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-6 pt-6">
      <div className="h-5 w-64 rounded bg-muted" />
      <div className="h-72 rounded-2xl bg-muted/60 md:h-[420px]" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-2/3 rounded bg-muted" />
          <div className="h-5 w-1/2 rounded bg-muted" />
        </div>
        <div className="h-96 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}
