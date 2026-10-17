"use client";

import {
  Add01Icon,
  Cancel01Icon,
  Car01Icon,
  Delete02Icon,
  ForkliftIcon,
  Idea01Icon,
  ImageAdd01Icon,
  KettlebellIcon,
  Route01Icon,
  Sofa01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { RouteLabel } from "@/components/ui/route-label";
import { Textarea } from "@/components/ui/textarea";
import {
  Chips,
  DateField,
  DimensionsInput,
  Field,
  FieldSection,
  MultiChips,
  OptionCards,
  ReviewSection,
  SelectField,
  Stepper,
  Tip,
  UnitInput,
} from "@/components/wizard/wizard-fields";
import { StepHeading } from "@/components/wizard/wizard-shell";
import { PlacePicker } from "@/features/place/components/place-picker";
import {
  type Access,
  autoTitle,
  type CloseWindow,
  type Dims,
  draftEstimate,
  draftMiles,
  draftTitle,
  type Flexibility,
  type FurnitureItem,
  isValidCarYear,
  type LocationType,
  MAX_CAR_YEAR,
  MIN_CAR_YEAR,
  needsAccess,
  type ShipmentDraft,
} from "@/features/shipment/shipment-draft";
import {
  categoryBadge,
  type ShipmentCategory,
} from "@/lib/demo-data/shipments";
import { formatMiles, formatNumber, formatUsd } from "@/lib/format";
import { formatDay, uid } from "@/lib/wizard";

// MapLibre needs the browser.
const RouteMap = dynamic(
  () => import("@/components/maps/route-map").then((m) => m.RouteMap),
  { ssr: false, loading: () => <div className="size-full bg-muted/50" /> },
);

export type Patch =
  | Partial<ShipmentDraft>
  | ((draft: ShipmentDraft) => Partial<ShipmentDraft>);
export type Update = (patch: Patch) => void;
export type Photo = { id: string; url: string; name: string };

type StepProps = { draft: ShipmentDraft; update: Update };

/* ------------------------------ Step 1 ------------------------------ */

const categoryOptions = [
  {
    value: "car",
    label: "Car",
    description: "Cars, trucks, motorcycles, boats",
    icon: Car01Icon,
  },
  {
    value: "furniture",
    label: "Furniture",
    description: "Sofas, beds, tables, and household items",
    icon: Sofa01Icon,
  },
  {
    value: "heavy",
    label: "Heavy item",
    description: "Pianos, pool tables, safes, equipment",
    icon: KettlebellIcon,
  },
  {
    value: "freight",
    label: "Freight",
    description: "Pallets, crates, and business shipments",
    icon: ForkliftIcon,
  },
] as const;

export function CategoryStep({ draft, update }: StepProps) {
  return (
    <>
      <StepHeading
        title="What would you like to ship?"
        description="Pick the closest match. You can add the details next."
      />
      <OptionCards<ShipmentCategory>
        label="What would you like to ship?"
        value={draft.category}
        onChange={(category) => update({ category })}
        options={categoryOptions}
      />
    </>
  );
}

/* ------------------------------ Step 2 ------------------------------ */

/** Newest first, so recent cars are at the top of the list. */
const carYears = Array.from(
  { length: MAX_CAR_YEAR - MIN_CAR_YEAR + 1 },
  (_, i) => String(MAX_CAR_YEAR - i),
);

const vehicleTypes = [
  "Sedan",
  "Coupe",
  "SUV",
  "Pickup truck",
  "Minivan",
  "Motorcycle",
  "Boat",
  "Other",
] as const;
const heavyTypes = [
  "Piano",
  "Pool table",
  "Safe",
  "Hot tub",
  "Gym equipment",
  "Machinery",
  "Other",
] as const;
const handlingOptions = [
  { value: "dolly", label: "Piano board or dolly" },
  { value: "liftgate", label: "Liftgate" },
  { value: "helpers", label: "Extra helpers" },
  { value: "crating", label: "Crating" },
  { value: "disassembly", label: "Disassembly" },
] as const;

function CarDetails({ draft, update }: StepProps) {
  const car = draft.car;
  const set = (patch: Partial<ShipmentDraft["car"]>) =>
    update((d) => ({ car: { ...d.car, ...patch } }));
  const yearError = car.year.length === 4 && !isValidCarYear(car.year);
  return (
    <FieldSection title="Vehicle">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Year"
          htmlFor="car-year"
          hint={
            yearError ? (
              <span id="car-year-error" className="text-destructive">
                Enter a year from {MIN_CAR_YEAR} to {MAX_CAR_YEAR}.
              </span>
            ) : undefined
          }
        >
          <Combobox
            items={carYears}
            value={car.year || null}
            onValueChange={(year) =>
              set({ year: (year as string | null) ?? "" })
            }
          >
            <ComboboxInput
              id="car-year"
              inputMode="numeric"
              placeholder="Type or pick"
              aria-invalid={yearError || undefined}
              aria-describedby={yearError ? "car-year-error" : undefined}
              className="h-10 w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>
                Enter a year from {MIN_CAR_YEAR} to {MAX_CAR_YEAR}.
              </ComboboxEmpty>
              <ComboboxList>
                {(year: string) => (
                  <ComboboxItem key={year} value={year}>
                    {year}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <Field label="Make" htmlFor="car-make">
          <Input
            id="car-make"
            placeholder="Honda"
            value={car.make}
            onChange={(e) => set({ make: e.target.value })}
            className="h-10"
          />
        </Field>
        <Field label="Model" htmlFor="car-model">
          <Input
            id="car-model"
            placeholder="Civic"
            value={car.model}
            onChange={(e) => set({ model: e.target.value })}
            className="h-10"
          />
        </Field>
      </div>
      <Field label="Vehicle type" htmlFor="car-type">
        <SelectField
          id="car-type"
          value={car.vehicleType}
          onChange={(vehicleType) => set({ vehicleType })}
          options={vehicleTypes}
          placeholder="Choose a type"
        />
      </Field>
      <Field label="Does it run?">
        <Chips
          label="Does it run?"
          value={car.runs}
          onChange={(runs) => set({ runs })}
          options={[
            { value: "yes", label: "Runs and drives" },
            { value: "no", label: "Doesn’t run" },
          ]}
        />
      </Field>
      <Field label="Trailer">
        <OptionCards
          label="Trailer"
          size="sm"
          value={car.trailer}
          onChange={(trailer) => set({ trailer })}
          options={[
            {
              value: "open",
              label: "Open trailer",
              description: "Most common and the lowest price.",
            },
            {
              value: "enclosed",
              label: "Enclosed trailer",
              description: "Covered, for classic or high-value cars.",
            },
          ]}
        />
      </Field>
    </FieldSection>
  );
}

function FurnitureRow({
  item,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  item: FurnitureItem;
  index: number;
  canRemove: boolean;
  onChange: (item: FurnitureItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4">
      <div className="flex items-end gap-3">
        <Field
          label={`Item ${index + 1}`}
          htmlFor={`item-${item.id}`}
          className="flex-1"
        >
          <Input
            id={`item-${item.id}`}
            placeholder={index === 0 ? "3-seat sofa" : "Dining table"}
            value={item.name}
            onChange={(e) => onChange({ ...item, name: e.target.value })}
            className="h-10 bg-background"
          />
        </Field>
        <Stepper
          label={`of ${item.name || "this item"}`}
          min={1}
          value={item.qty}
          onChange={(qty) => onChange({ ...item, qty })}
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="icon-lg"
            className="size-10 hover:bg-background"
            aria-label={`Remove item ${index + 1}`}
            onClick={onRemove}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Chips
          label="Size"
          value={item.size}
          onChange={(size) => onChange({ ...item, size })}
          options={[
            { value: "S", label: "Small" },
            { value: "M", label: "Medium" },
            { value: "L", label: "Large" },
            { value: "custom", label: "Enter dimensions" },
          ]}
        />
        {item.size === "custom" && (
          <DimensionsInput
            value={item.dims}
            onChange={(dims) => onChange({ ...item, dims })}
          />
        )}
      </div>
    </div>
  );
}

function FurnitureDetails({ draft, update }: StepProps) {
  const { items, packed } = draft.furniture;
  const setItems = (next: FurnitureItem[]) =>
    update((d) => ({ furniture: { ...d.furniture, items: next } }));
  return (
    <FieldSection
      title="Items"
      description="Small fits in a car, medium needs two people, large needs a truck."
    >
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <FurnitureRow
            key={item.id}
            item={item}
            index={i}
            canRemove={items.length > 1}
            onChange={(next) =>
              setItems(items.map((x) => (x.id === item.id ? next : x)))
            }
            onRemove={() => setItems(items.filter((x) => x.id !== item.id))}
          />
        ))}
        <div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              setItems([
                ...items,
                {
                  id: uid(),
                  name: "",
                  qty: 1,
                  size: "M",
                  dims: { l: "", w: "", h: "" },
                },
              ])
            }
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Add item
          </Button>
        </div>
      </div>
      <Field label="Is everything packed?">
        <Chips
          label="Is everything packed?"
          value={packed}
          onChange={(next) =>
            update((d) => ({ furniture: { ...d.furniture, packed: next } }))
          }
          options={[
            { value: "yes", label: "Packed and ready" },
            { value: "no", label: "Needs packing" },
          ]}
        />
      </Field>
    </FieldSection>
  );
}

function HeavyDetails({ draft, update }: StepProps) {
  const heavy = draft.heavy;
  const set = (patch: Partial<ShipmentDraft["heavy"]>) =>
    update((d) => ({ heavy: { ...d.heavy, ...patch } }));
  return (
    <FieldSection title="Item">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Item type" htmlFor="heavy-type">
          <SelectField
            id="heavy-type"
            value={heavy.itemType}
            onChange={(itemType) => set({ itemType })}
            options={heavyTypes}
            placeholder="Choose a type"
          />
        </Field>
        <Field label="Weight" htmlFor="heavy-weight">
          <UnitInput
            id="heavy-weight"
            unit="lb"
            placeholder="500"
            value={heavy.weight}
            onChange={(weight) => set({ weight })}
          />
        </Field>
      </div>
      <Field label="Dimensions" optional>
        <DimensionsInput
          value={heavy.dims}
          onChange={(dims) => set({ dims })}
        />
      </Field>
      <Field label="Special handling needed" optional>
        <MultiChips
          label="Special handling needed"
          value={heavy.handling}
          onChange={(handling) => set({ handling })}
          options={handlingOptions}
        />
      </Field>
    </FieldSection>
  );
}

function FreightDetails({ draft, update }: StepProps) {
  const f = draft.freight;
  const set = (patch: Partial<ShipmentDraft["freight"]>) =>
    update((d) => ({ freight: { ...d.freight, ...patch } }));
  return (
    <FieldSection title="Pallets">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of pallets">
          <div>
            <Stepper
              label="pallets"
              min={1}
              max={26}
              value={f.pallets}
              onChange={(pallets) => set({ pallets })}
            />
          </div>
        </Field>
        <Field label="Weight per pallet" htmlFor="freight-weight">
          <UnitInput
            id="freight-weight"
            unit="lb"
            placeholder="800"
            value={f.weightPerPallet}
            onChange={(weightPerPallet) => set({ weightPerPallet })}
          />
        </Field>
      </div>
      <Field
        label="Dimensions"
        optional
        hint="A standard pallet is 48 × 40 in."
      >
        <DimensionsInput value={f.dims} onChange={(dims) => set({ dims })} />
      </Field>
      <Field label="Stackable?">
        <Chips
          label="Stackable?"
          value={f.stackable}
          onChange={(stackable) => set({ stackable })}
          options={[
            { value: "yes", label: "Stackable" },
            { value: "no", label: "Don’t stack" },
          ]}
        />
      </Field>
    </FieldSection>
  );
}

function Photos({
  photos,
  onAdd,
  onRemove,
}: {
  photos: Photo[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <FieldSection
      title="Photos"
      description="Shipments with photos get up to 3× more offers."
    >
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            {/* biome-ignore lint/performance/noImgElement: local blob preview. */}
            <img src={p.url} alt={p.name} className="size-full object-cover" />
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={`Remove ${p.name}`}
              onClick={() => onRemove(p.id)}
              className="absolute top-1.5 right-1.5 rounded-full bg-background/90 shadow-sm hover:bg-background"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <HugeiconsIcon
            icon={ImageAdd01Icon}
            strokeWidth={2}
            className="size-5"
          />
          Add photos
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          // Copy first: clearing the input empties the live FileList.
          const files = Array.from(e.target.files ?? []);
          if (files.length) onAdd(files);
          e.target.value = "";
        }}
      />
    </FieldSection>
  );
}

export function DetailsStep({
  draft,
  update,
  photos,
  onAddPhotos,
  onRemovePhoto,
}: StepProps & {
  photos: Photo[];
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (id: string) => void;
}) {
  const suggested = autoTitle(draft);
  return (
    <>
      <StepHeading
        title="Tell us about your item"
        description="Drivers use these details to plan space and price their offer."
      />
      {draft.category === "car" && <CarDetails draft={draft} update={update} />}
      {draft.category === "furniture" && (
        <FurnitureDetails draft={draft} update={update} />
      )}
      {draft.category === "heavy" && (
        <HeavyDetails draft={draft} update={update} />
      )}
      {draft.category === "freight" && (
        <FreightDetails draft={draft} update={update} />
      )}
      <Photos photos={photos} onAdd={onAddPhotos} onRemove={onRemovePhoto} />
      <FieldSection title="Title">
        <Field
          label="Shown to drivers"
          htmlFor="shipment-title"
          hint={
            draft.titleEdited && suggested && suggested !== draft.title ? (
              <button
                type="button"
                className="underline-offset-4 hover:text-foreground hover:underline"
                onClick={() => update({ title: "", titleEdited: false })}
              >
                Use “{suggested}”
              </button>
            ) : (
              "Filled in from your details. You can change it."
            )
          }
        >
          <Input
            id="shipment-title"
            placeholder={
              draft.category === "car"
                ? "2019 Honda Civic"
                : "Name your shipment"
            }
            value={draftTitle(draft)}
            onChange={(e) =>
              update({
                title: e.target.value,
                titleEdited: e.target.value !== "",
              })
            }
            className="h-10"
          />
        </Field>
      </FieldSection>
    </>
  );
}

/* ------------------------------ Step 3 ------------------------------ */

const locationTypes: { value: LocationType; label: string }[] = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "business", label: "Business" },
  { value: "storage", label: "Storage" },
];

const accessOptions: { value: Access; label: string }[] = [
  { value: "ground", label: "Ground floor" },
  { value: "stairs", label: "Stairs" },
  { value: "elevator", label: "Elevator" },
];

function Stop({
  title,
  id,
  place,
  onPlace,
  type,
  onType,
}: {
  title: string;
  id: string;
  place: ShipmentDraft["pickup"];
  onPlace: (place: ShipmentDraft["pickup"]) => void;
  type: LocationType | "";
  onType: (type: LocationType) => void;
}) {
  return (
    <FieldSection title={title}>
      <Field label="City or zip" htmlFor={id}>
        <PlacePicker id={id} value={place} onChange={onPlace} />
      </Field>
      <Field label="Location type">
        <Chips
          label={`${title} location type`}
          value={type}
          onChange={onType}
          options={locationTypes}
        />
      </Field>
    </FieldSection>
  );
}

export function RouteStep({ draft, update }: StepProps) {
  const miles = draftMiles(draft);
  const same =
    draft.pickup && draft.dropoff && draft.pickup.code === draft.dropoff.code;
  return (
    <>
      <StepHeading
        title="Where is it going?"
        description="Drivers see the city now and the full address once you book."
      />
      <Stop
        title="Pickup"
        id="pickup-city"
        place={draft.pickup}
        onPlace={(pickup) => update({ pickup })}
        type={draft.pickupType}
        onType={(pickupType) => update({ pickupType })}
      />
      <Stop
        title="Dropoff"
        id="dropoff-city"
        place={draft.dropoff}
        onPlace={(dropoff) => update({ dropoff })}
        type={draft.dropoffType}
        onType={(dropoffType) => update({ dropoffType })}
      />
      {needsAccess(draft) && (
        <FieldSection
          title="Stairs or elevator?"
          description="Helps drivers bring the right crew and equipment."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="At pickup">
              <Chips
                label="Stairs or elevator at pickup"
                value={draft.pickupAccess}
                onChange={(pickupAccess) => update({ pickupAccess })}
                options={accessOptions}
              />
            </Field>
            <Field label="At dropoff">
              <Chips
                label="Stairs or elevator at dropoff"
                value={draft.dropoffAccess}
                onChange={(dropoffAccess) => update({ dropoffAccess })}
                options={accessOptions}
              />
            </Field>
          </div>
        </FieldSection>
      )}
      <div className="relative h-72 overflow-hidden rounded-2xl bg-muted/50 md:h-80">
        {draft.pickup && draft.dropoff && !same ? (
          <>
            <RouteMap from={draft.pickup} to={draft.dropoff} />
            <span className="pointer-events-none absolute top-3 left-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-background px-3 text-sm font-medium shadow-sm">
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={2}
                className="size-4"
              />
              {formatMiles(miles)}
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
                ? "Pickup and dropoff need to be different cities."
                : "Choose both cities to see the route."}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------ Step 4 ------------------------------ */

const flexibilityOptions: {
  value: Flexibility;
  label: string;
  description: string;
}[] = [
  {
    value: "exact",
    label: "Exact dates",
    description: "Pickup and delivery must match.",
  },
  {
    value: "few-days",
    label: "Within a few days",
    description: "A day or two either side is fine.",
  },
  {
    value: "flexible",
    label: "I’m flexible",
    description: "Whatever works for the driver.",
  },
];

export function DatesStep({
  draft,
  update,
  today,
}: StepProps & { today: string }) {
  return (
    <>
      <StepHeading
        title="When do you need it moved?"
        description="Give drivers a window to pick up and a date to deliver by."
      />
      <FieldSection title="Pickup window">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateField
            id="pickup-from"
            label="From"
            value={draft.pickupFrom}
            min={today}
            onChange={(pickupFrom) =>
              update((d) => ({
                pickupFrom,
                pickupTo:
                  d.pickupTo && d.pickupTo < pickupFrom ? "" : d.pickupTo,
                deliverBy:
                  d.deliverBy && d.deliverBy < pickupFrom ? "" : d.deliverBy,
              }))
            }
          />
          <DateField
            id="pickup-to"
            label="To"
            value={draft.pickupTo}
            min={draft.pickupFrom || today}
            onChange={(pickupTo) =>
              update((d) => ({
                pickupTo,
                deliverBy:
                  d.deliverBy && d.deliverBy < pickupTo ? "" : d.deliverBy,
              }))
            }
          />
        </div>
      </FieldSection>
      <FieldSection title="Deliver by">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateField
            id="deliver-by"
            label="Date"
            value={draft.deliverBy}
            min={draft.pickupTo || draft.pickupFrom || today}
            onChange={(deliverBy) => update({ deliverBy })}
          />
        </div>
      </FieldSection>
      <FieldSection title="Flexibility">
        <OptionCards
          label="Flexibility"
          size="sm"
          columns={3}
          value={draft.flexibility}
          onChange={(flexibility) => update({ flexibility })}
          options={flexibilityOptions}
        />
      </FieldSection>
      <Tip icon={Idea01Icon}>
        Flexible dates usually get more offers and lower prices.
      </Tip>
    </>
  );
}

/* ------------------------------ Step 5 ------------------------------ */

const closeWindows: { value: CloseWindow; label: string }[] = [
  { value: "24", label: "24 hours" },
  { value: "48", label: "48 hours" },
  { value: "72", label: "3 days" },
  { value: "120", label: "5 days" },
];

export function OffersStep({ draft, update }: StepProps) {
  const estimate = draftEstimate(draft);
  return (
    <>
      <StepHeading
        title="How do you want to receive offers?"
        description="Drivers send offers until the window closes. You pick the one you like."
      />
      <Field
        label="Target budget"
        optional
        htmlFor="budget"
        hint={
          estimate ? (
            <>
              Our estimate:{" "}
              <span className="font-medium text-foreground tabular-nums">
                {formatUsd(estimate.low)} – {formatUsd(estimate.high)}
              </span>
            </>
          ) : undefined
        }
      >
        <div className="max-w-xs">
          <UnitInput
            id="budget"
            prefix="$"
            placeholder={estimate ? String(estimate.mid) : "0"}
            value={draft.budget}
            onChange={(budget) => update({ budget })}
          />
        </div>
      </Field>
      <Field label="Offers close in">
        <Chips
          label="Offers close in"
          value={draft.closesIn}
          onChange={(closesIn) => update({ closesIn })}
          options={closeWindows}
        />
      </Field>
      <Field label="Who can see offer amounts">
        <OptionCards
          label="Who can see offer amounts"
          size="sm"
          value={draft.visibility}
          onChange={(visibility) => update({ visibility })}
          options={[
            {
              value: "everyone",
              label: "Everyone",
              description:
                "Drivers see the lowest offer, which keeps prices sharp.",
            },
            {
              value: "me",
              label: "Only me",
              description: "Drivers only see their own offer.",
            },
          ]}
        />
      </Field>
      <Field label="Notes for drivers" optional htmlFor="driver-notes">
        <Textarea
          id="driver-notes"
          placeholder="Anything drivers should know?"
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="min-h-28"
        />
      </Field>
    </>
  );
}

/* ------------------------------ Step 6 ------------------------------ */

const dims = (d: Dims) =>
  d.l && d.w && d.h ? `${d.l} × ${d.w} × ${d.h} in` : "";

function itemRows(d: ShipmentDraft): [string, string][] {
  switch (d.category) {
    case "car":
      return [
        ["Vehicle", `${d.car.year} ${d.car.make} ${d.car.model}`.trim()],
        ["Type", d.car.vehicleType],
        ["Condition", d.car.runs === "yes" ? "Runs and drives" : "Doesn’t run"],
        [
          "Trailer",
          d.car.trailer === "enclosed" ? "Enclosed trailer" : "Open trailer",
        ],
      ];
    case "furniture":
      return [
        ...d.furniture.items
          .filter((i) => i.name.trim())
          .map((i): [string, string] => [
            `${i.qty} × ${i.name.trim()}`,
            i.size === "custom"
              ? dims(i.dims) || "Custom size"
              : { S: "Small", M: "Medium", L: "Large" }[i.size],
          ]),
        [
          "Packing",
          d.furniture.packed === "yes" ? "Packed and ready" : "Needs packing",
        ],
      ];
    case "heavy":
      return [
        ["Item", d.heavy.itemType],
        ["Weight", `${formatNumber(Number(d.heavy.weight))} lb`],
        ...(dims(d.heavy.dims)
          ? [["Dimensions", dims(d.heavy.dims)] as [string, string]]
          : []),
        ...(d.heavy.handling.length
          ? [
              [
                "Handling",
                d.heavy.handling
                  .map((h) => handlingOptions.find((o) => o.value === h)?.label)
                  .join(", "),
              ] as [string, string],
            ]
          : []),
      ];
    case "freight":
      return [
        ["Pallets", String(d.freight.pallets)],
        [
          "Weight per pallet",
          `${formatNumber(Number(d.freight.weightPerPallet))} lb`,
        ],
        ...(dims(d.freight.dims)
          ? [["Dimensions", dims(d.freight.dims)] as [string, string]]
          : []),
        ["Stackable", d.freight.stackable === "yes" ? "Yes" : "No"],
      ];
    default:
      return [];
  }
}

const label = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | "",
) => options.find((o) => o.value === value)?.label ?? "";

export function ReviewStep({
  draft,
  photos,
  goTo,
}: {
  draft: ShipmentDraft;
  photos: Photo[];
  goTo: (step: number) => void;
}) {
  const estimate = draftEstimate(draft);
  const miles = draftMiles(draft);
  return (
    <>
      <StepHeading
        title="Review your shipment"
        description="This is how drivers will see it. Check the details, then post."
      />
      <div className="flex flex-col gap-3">
        <ReviewSection
          title={draftTitle(draft)}
          onEdit={() => goTo(2)}
          rows={[
            ["Category", draft.category ? categoryBadge(draft.category) : ""],
            ...itemRows(draft),
          ]}
        >
          {photos.length > 0 && (
            <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5">
              {photos.map((p) => (
                // biome-ignore lint/performance/noImgElement: local blob preview.
                <img
                  key={p.id}
                  src={p.url}
                  alt={p.name}
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </ReviewSection>
        <ReviewSection
          title="Route"
          onEdit={() => goTo(3)}
          rows={[
            [
              "Pickup",
              `${draft.pickup?.label} · ${label(locationTypes, draft.pickupType)}${needsAccess(draft) ? ` · ${label(accessOptions, draft.pickupAccess)}` : ""}`,
            ],
            [
              "Dropoff",
              `${draft.dropoff?.label} · ${label(locationTypes, draft.dropoffType)}${needsAccess(draft) ? ` · ${label(accessOptions, draft.dropoffAccess)}` : ""}`,
            ],
            ["Distance", formatMiles(miles)],
          ]}
        >
          <RouteLabel
            from={draft.pickup?.code ?? ""}
            to={draft.dropoff?.code ?? ""}
            className="gap-2 font-heading text-2xl font-semibold tracking-tight"
            arrowClassName="size-5"
          />
        </ReviewSection>
        <ReviewSection
          title="Dates"
          onEdit={() => goTo(4)}
          rows={[
            [
              "Pickup window",
              draft.pickupFrom === draft.pickupTo
                ? formatDay(draft.pickupFrom)
                : `${formatDay(draft.pickupFrom)} – ${formatDay(draft.pickupTo)}`,
            ],
            ["Deliver by", formatDay(draft.deliverBy)],
            ["Flexibility", label(flexibilityOptions, draft.flexibility)],
          ]}
        />
        <ReviewSection
          title="Offers"
          onEdit={() => goTo(5)}
          rows={[
            [
              "Target budget",
              draft.budget
                ? formatUsd(Number(draft.budget))
                : estimate
                  ? `Not set · estimate ${formatUsd(estimate.low)} – ${formatUsd(estimate.high)}`
                  : "Not set",
            ],
            ["Offers close in", label(closeWindows, draft.closesIn)],
            [
              "Offer amounts",
              draft.visibility === "everyone"
                ? "Visible to everyone"
                : "Only you",
            ],
            ...(draft.notes.trim()
              ? [
                  [
                    "Notes",
                    <span
                      key="notes"
                      className="whitespace-pre-line font-normal"
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
