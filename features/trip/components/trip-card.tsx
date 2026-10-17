import { ArrowRight02Icon, TankerTruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fragment } from "react";
import { Rating } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import { SegmentMeter } from "@/components/ui/segment-meter";
import {
  Perforation,
  SaveButton,
  Tag,
  Ticket,
} from "@/features/shipment/components/shipment-ticket";
import {
  cityName,
  destination,
  formatPrice,
  formatSchedule,
  meter,
  midStops,
  origin,
  spaceLabel,
  stopsText,
  type Trip,
  unitName,
  vehicleLabel,
} from "@/lib/demo-data/trips";

function Dash() {
  return (
    <span className="h-px min-w-3 flex-1 border-t border-dashed border-foreground/25" />
  );
}

/**
 * Big city codes joined by a dashed lane, with a small dot for every stop
 * along the way and the truck riding in the middle.
 */
function StopsLane({ trip }: { trip: Trip }) {
  const from = origin(trip).place;
  const to = destination(trip).place;
  const stops = midStops(trip);
  // Legs between dots; the truck sits in the middle leg.
  const legs = stops.length + 1;
  const truckLeg = Math.floor(stops.length / 2);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <p className="font-heading text-3xl font-semibold tracking-tight">
        {from.code}
      </p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: legs }, (_, i) => (
          <Fragment key={stops[i]?.place.code ?? "end"}>
            {i === truckLeg ? (
              <>
                <Dash />
                <HugeiconsIcon
                  icon={TankerTruckIcon}
                  strokeWidth={2}
                  className="size-4 shrink-0"
                />
                <Dash />
              </>
            ) : (
              <Dash />
            )}
            {i < stops.length && (
              <span
                title={stops[i].place.label}
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
        <p className="truncate">{from.label}</p>
        <p className="truncate text-right">{to.label}</p>
      </div>
    </div>
  );
}

/** "From $780 per car", with the amount set large. */
function Price({ trip }: { trip: Trip }) {
  return (
    <p className="flex items-baseline gap-1.5 whitespace-nowrap">
      {trip.unit === "car" && (
        <span className="text-sm text-muted-foreground">From</span>
      )}
      <span className="font-heading text-xl font-semibold tabular-nums">
        {formatPrice(trip.price)}
      </span>
      <span className="text-sm text-muted-foreground">
        per {unitName(trip.unit)}
      </span>
    </p>
  );
}

/** Plain-text route for screen readers and link labels. */
function routeText(trip: Trip) {
  return `${origin(trip).place.label} → ${destination(trip).place.label}`;
}

function DriverLine({ trip }: { trip: Trip }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <GradientAvatar seed={trip.driver} className="size-7" />
      <p className="min-w-0 truncate">
        <span className="font-medium">{trip.driver}</span>{" "}
        <span className="text-muted-foreground">
          <Rating value={trip.rating} className="proportional-nums" />
          {trip.verified && " · Verified"}
        </span>
      </p>
    </div>
  );
}

function ViewTrip() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 font-medium">
      View trip
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        strokeWidth={2}
        className="size-3.5"
      />
    </span>
  );
}

/** Ticket-style card for the trip grid and "Other trips on this route". */
export function TripTicket({
  trip,
  saved,
  onToggleSave,
}: {
  trip: Trip;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const m = meter(trip);
  return (
    <Ticket href={`/loads/${trip.id}`} label={`View trip: ${routeText(trip)}`}>
      <div className="flex flex-col gap-6 p-5 pb-4">
        <div className="flex h-7 items-center gap-2">
          <Tag>{vehicleLabel(trip.vehicle)}</Tag>
          {onToggleSave && (
            <span className="-mr-1.5 ml-auto">
              <SaveButton
                saved={!!saved}
                onToggle={onToggleSave}
                item={`${trip.driver}’s trip`}
              />
            </span>
          )}
        </div>
        <StopsLane trip={trip} />
        <div>
          <h3 className="sr-only">{routeText(trip)}</h3>
          <p className="font-medium">{stopsText(trip)}</p>
          <p className="text-muted-foreground">{formatSchedule(trip)}</p>
        </div>
        <DriverLine trip={trip} />
      </div>
      <Perforation />
      <div className="mt-auto flex flex-col gap-3 p-5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-muted-foreground">Space</p>
          <p className="text-xs font-medium">{spaceLabel(trip)}</p>
        </div>
        <SegmentMeter segments={m.segments} filled={m.filled / m.segments} />
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <Price trip={trip} />
          <ViewTrip />
        </div>
      </div>
    </Ticket>
  );
}

/** One-line version of the ticket for the list view. */
export function TripRow({
  trip,
  saved,
  onToggleSave,
}: {
  trip: Trip;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const m = meter(trip);
  return (
    <Ticket href={`/loads/${trip.id}`} label={`View trip: ${routeText(trip)}`}>
      <div className="grid items-center gap-x-6 gap-y-3 p-4 sm:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_8rem_auto_auto]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-2 max-sm:pr-10">
            <span className="shrink-0 whitespace-nowrap">
              <Tag>{vehicleLabel(trip.vehicle)}</Tag>
            </span>
            <h3 className="flex min-w-0 text-base font-semibold">
              <RouteLabel
                truncate
                from={cityName(origin(trip).place)}
                to={cityName(destination(trip).place)}
              />
            </h3>
          </div>
          <p className="truncate text-muted-foreground">
            {formatSchedule(trip)}
          </p>
        </div>
        <div className="min-w-0 max-lg:hidden">
          <p className="truncate">{stopsText(trip)}</p>
          <p className="truncate text-muted-foreground">
            {trip.driver}{" "}
            <Rating value={trip.rating} className="proportional-nums" />
            {trip.verified && " · Verified"}
          </p>
        </div>
        <div className="flex flex-col gap-2 max-lg:hidden">
          <p className="text-xs font-medium">{spaceLabel(trip)}</p>
          <SegmentMeter segments={m.segments} filled={m.filled / m.segments} />
        </div>
        <div className="flex items-center gap-4 sm:justify-end">
          <Price trip={trip} />
        </div>
        <div className="max-sm:absolute max-sm:top-3 max-sm:right-3">
          <SaveButton
            saved={saved}
            onToggle={onToggleSave}
            item={`${trip.driver}’s trip`}
          />
        </div>
      </div>
    </Ticket>
  );
}
