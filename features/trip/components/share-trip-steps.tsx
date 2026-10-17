"use client";

import {
  Add01Icon,
  ArrowRight02Icon,
  Car01Icon,
  Delete02Icon,
  DeliveryTruck01Icon,
  ForkliftIcon,
  KettlebellIcon,
  Route01Icon,
  ShippingTruck01Icon,
  Sofa01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Chips,
  DateField,
  Field,
  FieldSection,
  MultiChips,
  OptionCards,
  ReviewSection,
  SelectField,
  Stepper,
  UnitInput,
} from "@/components/wizard/wizard-fields";
import { StepHeading } from "@/components/wizard/wizard-shell";
import { PlacePicker } from "@/features/place/components/place-picker";
import { tripPriceLabel } from "@/features/trip/components/share-trip-preview";
import {
  allVehicles,
  type Carry,
  currentVehicle,
  isCarrier,
  kindLabel,
  spaceLabel,
  type TripDraft,
  timesOfDay,
  tripMiles,
  tripPoints,
  type Vehicle,
  type VehicleKind,
  vehicleDefaults,
  vehicleKinds,
} from "@/features/trip/trip-draft";
import { formatMiles, formatNumber, formatUsd } from "@/lib/format";
import {
  estimateTrip,
  formatDay,
  pricingUnits,
  type TripPricing,
  uid,
} from "@/lib/wizard";

// MapLibre needs the browser.
const ShareTripMap = dynamic(
  () =>
    import("@/features/trip/components/share-trip-map").then(
      (m) => m.ShareTripMap,
    ),
  { ssr: false, loading: () => <div className="size-full bg-muted/50" /> },
);

export type TripPatch =
  | Partial<TripDraft>
  | ((draft: TripDraft) => Partial<TripDraft>);
type StepProps = { draft: TripDraft; update: (patch: TripPatch) => void };

const kindIcons: Record<VehicleKind, IconSvgElement> = {
  carrier: ShippingTruck01Icon,
  truck: TruckIcon,
  van: DeliveryTruck01Icon,
  trailer: ShippingTruck01Icon,
};

/* ------------------------------ Step 1 ------------------------------ */

function AddVehicleForm({
  onAdd,
  onCancel,
}: {
  onAdd: (vehicle: Vehicle) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState("");
  const [name, setName] = useState("");
  const kindValue = vehicleKinds.find((k) => k.label === kind)?.value;
  const valid = !!kindValue && !!name.trim();

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!kindValue || !name.trim()) return;
        onAdd({
          id: uid(),
          kind: kindValue,
          name: name.trim(),
          detail: kind,
        });
      }}
    >
      <h2 className="font-semibold">Add a vehicle</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="vehicle-kind">
          <SelectField
            id="vehicle-kind"
            value={kind}
            onChange={setKind}
            options={vehicleKinds.map((k) => k.label)}
            placeholder="Choose a type"
          />
        </Field>
        <Field label="Name" htmlFor="vehicle-name">
          <Input
            id="vehicle-name"
            placeholder="3-car wedge trailer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 bg-background"
          />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="lg" disabled={!valid}>
          Add vehicle
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function VehicleStep({ draft, update }: StepProps) {
  const [adding, setAdding] = useState(false);
  const vehicles = allVehicles(draft);
  return (
    <>
      <StepHeading
        title="Which vehicle are you driving?"
        description="Pick from your vehicles. Shippers see the type so they know what fits."
      />
      <OptionCards
        label="Which vehicle are you driving?"
        value={draft.vehicleId}
        onChange={(id) => {
          const v = vehicles.find((x) => x.id === id);
          if (v) update((d) => vehicleDefaults(v, d));
        }}
        options={vehicles.map((v) => ({
          value: v.id,
          label: v.name,
          description: v.detail ?? kindLabel(v.kind),
          icon: kindIcons[v.kind],
        }))}
      />
      {adding ? (
        <AddVehicleForm
          onCancel={() => setAdding(false)}
          onAdd={(v) => {
            update((d) => ({
              addedVehicles: [...d.addedVehicles, v],
              ...vehicleDefaults(v, d),
            }));
            setAdding(false);
          }}
        />
      ) : (
        <div>
          <Button variant="secondary" size="lg" onClick={() => setAdding(true)}>
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Add a vehicle
          </Button>
        </div>
      )}
    </>
  );
}

/* ------------------------------ Step 2 ------------------------------ */

export function RouteStep({ draft, update }: StepProps) {
  const points = tripPoints(draft);
  const miles = tripMiles(draft);
  const same = draft.start && draft.end && draft.start.code === draft.end.code;
  const ready = draft.start && draft.end && !same;

  return (
    <>
      <StepHeading
        title="Where are you going?"
        description="Add the cities you’ll pass through. Shippers on your way can book a spot."
      />
      <FieldSection title="Route">
        <div className="flex flex-col gap-4">
          <Field label="Start city" htmlFor="trip-start">
            <PlacePicker
              id="trip-start"
              value={draft.start}
              onChange={(start) => update({ start })}
            />
          </Field>
          {draft.stops.map((stop, i) => (
            <div key={stop.id} className="flex items-end gap-2">
              <Field
                label={`Stop ${i + 1}`}
                htmlFor={`stop-${stop.id}`}
                className="flex-1"
              >
                <PlacePicker
                  id={`stop-${stop.id}`}
                  value={stop.place}
                  onChange={(place) =>
                    update((d) => ({
                      stops: d.stops.map((s) =>
                        s.id === stop.id ? { ...s, place } : s,
                      ),
                    }))
                  }
                />
              </Field>
              <Button
                variant="ghost"
                size="icon-lg"
                className="size-10"
                aria-label={`Remove stop ${i + 1}`}
                onClick={() =>
                  update((d) => ({
                    stops: d.stops.filter((s) => s.id !== stop.id),
                  }))
                }
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            </div>
          ))}
          <Field label="End city" htmlFor="trip-end">
            <PlacePicker
              id="trip-end"
              value={draft.end}
              onChange={(end) => update({ end })}
            />
          </Field>
          <div>
            <Button
              variant="secondary"
              size="lg"
              disabled={draft.stops.length >= 6}
              onClick={() =>
                update((d) => ({
                  stops: [
                    ...d.stops,
                    { id: uid(), place: null, date: "", time: "" },
                  ],
                }))
              }
            >
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Add a stop
            </Button>
          </div>
        </div>
      </FieldSection>
      <FieldSection
        title="How far you’ll go off route for a pickup"
        description="Shippers within this distance of your route can request a spot."
      >
        <Chips
          label="How far you’ll go off route for a pickup"
          value={draft.detour}
          onChange={(detour) => update({ detour })}
          options={[
            { value: "10", label: "10 mi" },
            { value: "25", label: "25 mi" },
            { value: "50", label: "50 mi" },
          ]}
        />
      </FieldSection>
      <div className="relative h-72 overflow-hidden rounded-2xl bg-muted/50 md:h-80">
        {ready ? (
          <>
            <ShareTripMap points={points} />
            <span className="pointer-events-none absolute top-3 left-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-background px-3 text-sm font-medium shadow-sm">
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={2}
                className="size-4"
              />
              {formatMiles(miles)}
              {draft.stops.length > 0 &&
                ` · ${draft.stops.length} ${draft.stops.length === 1 ? "stop" : "stops"}`}
            </span>
          </>
        ) : (
          <div className="grid size-full place-items-center p-6 text-center">
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={2}
                className="size-5 text-foreground"
              />
              {same
                ? "Start and end need to be different cities."
                : "Choose a start and end city to see your route."}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------ Step 3 ------------------------------ */

export function ScheduleStep({
  draft,
  update,
  today,
}: StepProps & { today: string }) {
  const lastStopDate = draft.stops.reduce(
    (latest, s) => (s.date > latest ? s.date : latest),
    "",
  );
  return (
    <>
      <StepHeading
        title="When are you leaving?"
        description="Shippers plan around these dates, so give your best estimate."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          id="trip-departure"
          label="Departure date"
          value={draft.departure}
          min={today}
          onChange={(departure) =>
            update((d) => ({
              departure,
              arrival: d.arrival && d.arrival < departure ? "" : d.arrival,
              stops: d.stops.map((s) =>
                s.date && s.date < departure ? { ...s, date: "" } : s,
              ),
            }))
          }
        />
        <DateField
          id="trip-arrival"
          label="Estimated arrival"
          value={draft.arrival}
          min={lastStopDate || draft.departure || today}
          onChange={(arrival) => update({ arrival })}
        />
      </div>
      {draft.stops.length > 0 && (
        <FieldSection
          title="Arrival at each stop"
          description="Roughly when you’ll roll through."
        >
          <div className="flex flex-col gap-3">
            {draft.stops.map((stop, i) => (
              <div
                key={stop.id}
                className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4"
              >
                <p className="font-medium">
                  Stop {i + 1} ·{" "}
                  <span className="text-muted-foreground">
                    {stop.place?.label}
                  </span>
                </p>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <DateField
                    id={`stop-date-${stop.id}`}
                    label="Date"
                    value={stop.date}
                    min={draft.departure || today}
                    max={draft.arrival || undefined}
                    onChange={(date) =>
                      update((d) => ({
                        stops: d.stops.map((s) =>
                          s.id === stop.id ? { ...s, date } : s,
                        ),
                      }))
                    }
                  />
                  <Chips
                    label={`Time at stop ${i + 1}`}
                    value={stop.time}
                    onChange={(time) =>
                      update((d) => ({
                        stops: d.stops.map((s) =>
                          s.id === stop.id ? { ...s, time } : s,
                        ),
                      }))
                    }
                    options={timesOfDay}
                  />
                </div>
              </div>
            ))}
          </div>
        </FieldSection>
      )}
    </>
  );
}

/* ------------------------------ Step 4 ------------------------------ */

const carryOptions: { value: Carry; label: string; icon: IconSvgElement }[] = [
  { value: "cars", label: "Cars", icon: Car01Icon },
  { value: "furniture", label: "Furniture", icon: Sofa01Icon },
  { value: "heavy", label: "Heavy items", icon: KettlebellIcon },
  { value: "pallets", label: "Pallets", icon: ForkliftIcon },
];

export function SpaceStep({ draft, update }: StepProps) {
  const vehicle = currentVehicle(draft);
  const carrier = isCarrier(draft);
  return (
    <>
      <StepHeading
        title="How much space do you have?"
        description={
          vehicle
            ? `Only list what’s open on your ${vehicle.name.toLowerCase()}.`
            : undefined
        }
      />
      {carrier ? (
        <Field label="Open spots">
          <div>
            <Stepper
              label="open spots"
              min={1}
              max={vehicle?.capacity ?? 12}
              value={draft.spots}
              onChange={(spots) => update({ spots })}
            />
          </div>
        </Field>
      ) : (
        <FieldSection title="Open space">
          <Chips
            label="Measure space in"
            value={draft.spaceUnit}
            onChange={(spaceUnit) =>
              update((d) => {
                // Keep the price unit in step with how space is measured.
                const pricing = spaceUnit === "pallets" ? "pallet" : "cuft";
                return d.pricing === "spot" || d.pricing === pricing
                  ? { spaceUnit }
                  : { spaceUnit, pricing, price: "" };
              })
            }
            options={[
              { value: "cuft", label: "Cubic feet" },
              { value: "pallets", label: "Pallets" },
            ]}
          />
          {draft.spaceUnit === "cuft" ? (
            <Field
              label="Cubic feet"
              htmlFor="trip-cuft"
              hint={
                vehicle?.capacity
                  ? `Your ${vehicle.name.toLowerCase()} holds about ${formatNumber(vehicle.capacity)} cu ft.`
                  : undefined
              }
            >
              <div className="max-w-xs">
                <UnitInput
                  id="trip-cuft"
                  unit="cu ft"
                  placeholder="400"
                  value={draft.cuft}
                  onChange={(cuft) => update({ cuft })}
                />
              </div>
            </Field>
          ) : (
            <Field label="Number of pallets">
              <div>
                <Stepper
                  label="pallets"
                  min={1}
                  max={26}
                  value={draft.pallets}
                  onChange={(pallets) => update({ pallets })}
                />
              </div>
            </Field>
          )}
        </FieldSection>
      )}
      <FieldSection title="What you can carry">
        <MultiChips
          label="What you can carry"
          value={draft.carries}
          onChange={(carries) => update({ carries })}
          options={carryOptions}
        />
      </FieldSection>
    </>
  );
}

/* ------------------------------ Step 5 ------------------------------ */

export function PriceStep({ draft, update }: StepProps) {
  const unit = pricingUnits[draft.pricing];
  const range = estimateTrip(draft.pricing, tripMiles(draft));
  return (
    <>
      <StepHeading
        title="Set your price"
        description="Shippers see this up front. You can still accept or decline each request."
      />
      <Field label="Pricing">
        <Chips<TripPricing>
          label="Pricing"
          value={draft.pricing}
          onChange={(pricing) => update({ pricing, price: "" })}
          options={(Object.keys(pricingUnits) as TripPricing[]).map((k) => ({
            value: k,
            label: pricingUnits[k].label,
          }))}
        />
      </Field>
      <Field
        label={`Price ${unit.per}`}
        htmlFor="trip-price"
        hint={`Similar trips charge ${formatUsd(range.low, range.decimals)} – ${formatUsd(range.high, range.decimals)} ${unit.per}`}
      >
        <div className="max-w-xs">
          <UnitInput
            id="trip-price"
            prefix="$"
            unit={unit.per}
            decimal={draft.pricing === "cuft"}
            placeholder={String(
              range.decimals
                ? ((range.low + range.high) / 2).toFixed(2)
                : Math.round((range.low + range.high) / 2),
            )}
            value={draft.price}
            onChange={(price) => update({ price })}
          />
        </div>
      </Field>
      <Field label="Notes for shippers" optional htmlFor="shipper-notes">
        <Textarea
          id="shipper-notes"
          placeholder="Anything shippers should know?"
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="min-h-28"
        />
      </Field>
    </>
  );
}

/* ------------------------------ Step 6 ------------------------------ */

const timeLabel = (t: string) =>
  timesOfDay.find((x) => x.value === t)?.label.toLowerCase() ?? "";

export function TripReviewStep({
  draft,
  goTo,
}: {
  draft: TripDraft;
  goTo: (step: number) => void;
}) {
  const vehicle = currentVehicle(draft);
  const points = tripPoints(draft);
  return (
    <>
      <StepHeading
        title="Review your trip"
        description="This is how shippers will see it. Check the details, then post."
      />
      <div className="flex flex-col gap-3">
        <ReviewSection
          title="Vehicle"
          onEdit={() => goTo(1)}
          rows={[
            ["Vehicle", vehicle?.name ?? ""],
            ["Type", vehicle ? kindLabel(vehicle.kind) : ""],
          ]}
        />
        <ReviewSection
          title="Route"
          onEdit={() => goTo(2)}
          rows={[
            ["Distance", formatMiles(tripMiles(draft))],
            ["Off-route pickups", `Up to ${draft.detour} mi`],
          ]}
        >
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-2xl font-semibold tracking-tight">
            {points.map((p, i) => (
              <Fragment key={`${p.code}-${i}`}>
                {i > 0 && (
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                )}
                {p.code}
              </Fragment>
            ))}
          </p>
        </ReviewSection>
        <ReviewSection
          title="Schedule"
          onEdit={() => goTo(3)}
          rows={[
            [`Leaves ${draft.start?.label}`, formatDay(draft.departure)],
            ...draft.stops.map((s): [string, string] => [
              `Stops in ${s.place?.label}`,
              `${formatDay(s.date)}, ${timeLabel(s.time)}`,
            ]),
            [`Arrives ${draft.end?.label}`, formatDay(draft.arrival)],
          ]}
        />
        <ReviewSection
          title="Space"
          onEdit={() => goTo(4)}
          rows={[
            ["Open space", spaceLabel(draft).replace(" left", "")],
            [
              "Can carry",
              carryOptions
                .filter((o) => draft.carries.includes(o.value))
                .map((o) => o.label)
                .join(", "),
            ],
          ]}
        />
        <ReviewSection
          title="Price"
          onEdit={() => goTo(5)}
          rows={[
            ["Price", tripPriceLabel(draft)],
            ...(draft.notes.trim()
              ? [
                  [
                    "Notes",
                    <span
                      key="notes"
                      className="font-normal whitespace-pre-line"
                    >
                      {draft.notes.trim()}
                    </span>,
                  ] as [string, React.ReactNode],
                ]
              : []),
          ]}
        />
      </div>
    </>
  );
}
