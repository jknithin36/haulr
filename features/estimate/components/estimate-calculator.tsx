"use client";

import {
  Calendar03Icon,
  Car01Icon,
  ContainerTruck01Icon,
  Route01Icon,
  Sofa01Icon,
  WeightScaleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { type ReactNode, useId, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type Estimate,
  type EstimateCategory,
  estimatePrice,
  type FreightWeight,
  type FurnitureLoad,
  freightWeights,
  furnitureLoads,
  type HeavyType,
  type HeavyWeight,
  heavyTypes,
  heavyWeights,
  type ItemDetails,
  type Pallets,
  palletOptions,
  type Stairs,
  stairOptions,
  type Timing,
  type Trailer,
  trailers,
  type VehicleSize,
  vehicleSizes,
} from "@/features/estimate/estimate-model";
import { PlacePicker } from "@/features/place/components/place-picker";
import type { Place } from "@/lib/demo-data/places";
import { formatMiles, formatShortDay, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const categories: {
  value: EstimateCategory;
  label: string;
  icon: typeof Car01Icon;
}[] = [
  { value: "car", label: "Car", icon: Car01Icon },
  { value: "furniture", label: "Furniture", icon: Sofa01Icon },
  { value: "heavy", label: "Heavy item", icon: WeightScaleIcon },
  { value: "freight", label: "Freight", icon: ContainerTruck01Icon },
];

const timings: { value: Timing; label: string }[] = [
  { value: "exact", label: "Exact date" },
  { value: "week", label: "Within a week" },
  { value: "flexible", label: "I’m flexible" },
];

const runsOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

type Details = {
  car: { size: VehicleSize; trailer: Trailer; runs: boolean };
  furniture: { load: FurnitureLoad; stairs: Stairs };
  heavy: { type: HeavyType; weight: HeavyWeight };
  freight: { pallets: Pallets; weight: FreightWeight };
};

const defaultDetails: Details = {
  car: { size: "sedan", trailer: "open", runs: true },
  furniture: { load: "room", stairs: "none" },
  heavy: { type: "motorcycle", weight: "under500" },
  freight: { pallets: "1", weight: "under1000" },
};

function itemFor(category: EstimateCategory, details: Details): ItemDetails {
  switch (category) {
    case "car":
      return { category, ...details.car };
    case "furniture":
      return { category, ...details.furniture };
    case "heavy":
      return { category, ...details.heavy };
    case "freight":
      return { category, ...details.freight };
  }
}

/* -------------------------------------------------------------------------- */
/* Form building blocks                                                        */
/* -------------------------------------------------------------------------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-4">
      <legend className="mb-4 text-lg font-semibold tracking-tight">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  const Tag = htmlFor ? "label" : "p";
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Tag htmlFor={htmlFor} className="text-sm text-muted-foreground">
        {label}
      </Tag>
      {children}
    </div>
  );
}

function Chips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      variant="outline"
      value={[value]}
      onValueChange={(next) => next[0] && onChange(next[0] as T)}
      className="flex-wrap"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className="h-10 px-4 aria-pressed:border-foreground aria-pressed:bg-background"
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function Choice<T extends string>({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
    >
      <SelectTrigger
        id={id}
        className="w-full bg-background data-[size=default]:h-10"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Mounted only while the popover is open, so "today" is read in the browser. */
function FutureCalendar({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date?: Date) => void;
}) {
  const [today] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={{ before: today }}
      defaultMonth={selected ?? today}
    />
  );
}

function ItemDetailsFields({
  category,
  details,
  setDetails,
}: {
  category: EstimateCategory;
  details: Details;
  setDetails: (d: Details) => void;
}) {
  const id = useId();

  if (category === "car") {
    const car = details.car;
    const set = (patch: Partial<Details["car"]>) =>
      setDetails({ ...details, car: { ...car, ...patch } });
    return (
      <div className="flex flex-col gap-5">
        <FieldRow label="Vehicle size">
          <Chips
            label="Vehicle size"
            value={car.size}
            options={vehicleSizes}
            onChange={(size) => set({ size })}
          />
        </FieldRow>
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          <FieldRow label="Trailer">
            <Chips
              label="Trailer"
              value={car.trailer}
              options={trailers}
              onChange={(trailer) => set({ trailer })}
            />
          </FieldRow>
          <FieldRow label="Does it run?">
            <Chips
              label="Does it run?"
              value={car.runs ? "yes" : "no"}
              options={runsOptions}
              onChange={(v) => set({ runs: v === "yes" })}
            />
          </FieldRow>
        </div>
      </div>
    );
  }

  if (category === "furniture") {
    const furniture = details.furniture;
    const set = (patch: Partial<Details["furniture"]>) =>
      setDetails({ ...details, furniture: { ...furniture, ...patch } });
    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldRow label="How much are you moving?" htmlFor={`${id}-load`}>
            <Choice
              id={`${id}-load`}
              value={furniture.load}
              options={furnitureLoads}
              onChange={(load) => set({ load })}
            />
          </FieldRow>
        </div>
        <FieldRow label="Stairs at pickup or drop-off">
          <Chips
            label="Stairs at pickup or drop-off"
            value={furniture.stairs}
            options={stairOptions}
            onChange={(stairs) => set({ stairs })}
          />
        </FieldRow>
      </div>
    );
  }

  if (category === "heavy") {
    const heavy = details.heavy;
    const set = (patch: Partial<Details["heavy"]>) =>
      setDetails({ ...details, heavy: { ...heavy, ...patch } });
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldRow label="What is it?" htmlFor={`${id}-type`}>
          <Choice
            id={`${id}-type`}
            value={heavy.type}
            options={heavyTypes}
            onChange={(type) => set({ type })}
          />
        </FieldRow>
        <FieldRow label="Approximate weight" htmlFor={`${id}-weight`}>
          <Choice
            id={`${id}-weight`}
            value={heavy.weight}
            options={heavyWeights}
            onChange={(weight) => set({ weight })}
          />
        </FieldRow>
      </div>
    );
  }

  const freight = details.freight;
  const set = (patch: Partial<Details["freight"]>) =>
    setDetails({ ...details, freight: { ...freight, ...patch } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FieldRow label="Number of pallets" htmlFor={`${id}-pallets`}>
        <Choice
          id={`${id}-pallets`}
          value={freight.pallets}
          options={palletOptions}
          onChange={(pallets) => set({ pallets })}
        />
      </FieldRow>
      <FieldRow label="Total weight" htmlFor={`${id}-weight`}>
        <Choice
          id={`${id}-weight`}
          value={freight.weight}
          options={freightWeights}
          onChange={(weight) => set({ weight })}
        />
      </FieldRow>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Result panel                                                                */
/* -------------------------------------------------------------------------- */

function PriceRange({ low, high }: { low: number; high: number }) {
  const text = `${formatUsd(low)} – ${formatUsd(high)}`;
  return (
    <div className="flex h-12 items-end overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={text}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl font-semibold tracking-tight whitespace-nowrap tabular-nums"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function ResultPanel({
  estimate,
  from,
  to,
}: {
  estimate: Estimate | null;
  from: Place | null;
  to: Place | null;
}) {
  if (!estimate || !from || !to) {
    const sameCity = from && to && from.code === to.code;
    return (
      <div className="flex flex-col gap-6 rounded-2xl bg-muted/50 p-6 md:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          Estimated price
        </p>
        <div className="flex flex-col items-start gap-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-background">
            <HugeiconsIcon
              icon={Route01Icon}
              strokeWidth={2}
              className="size-5 text-muted-foreground"
            />
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="text-balance text-xl font-semibold tracking-tight">
              {sameCity
                ? "Pick two different cities"
                : "Choose where it’s going to see a price"}
            </p>
            <p className="text-pretty text-muted-foreground">
              {sameCity
                ? "Your pickup and drop-off are the same place."
                : "Add a pickup and drop-off city. Your price updates as you change the details."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [fastest, slowest] = estimate.transitDays;
  const [fewest, most] = estimate.offers;

  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-muted/50 p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Estimated price
        </p>
        <PriceRange low={estimate.low} high={estimate.high} />
        <RouteLabel
          from={from.label}
          to={to.label}
          className="text-sm text-muted-foreground"
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          Transit time: {fastest} – {slowest} days · Distance:{" "}
          {formatMiles(estimate.miles)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">What affects your price</h2>
        <dl className="flex flex-col divide-y divide-foreground/5 text-sm">
          {estimate.factors.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="font-medium">{f.label}</dt>
              <dd className="text-pretty text-muted-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Ways to ship it</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 rounded-xl bg-background p-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Get offers from drivers</p>
              <p className="text-pretty text-sm text-muted-foreground">
                Drivers usually send {fewest}–{most} offers for shipments like
                this.
              </p>
            </div>
            <Link
              href="/shipments/new"
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Post this shipment
            </Link>
          </div>
          <div className="flex flex-col gap-4 rounded-xl bg-background p-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Book space on a trip</p>
              <p className="text-pretty text-sm text-muted-foreground">
                {estimate.tripsSoon} drivers have space on this route soon.
              </p>
            </div>
            <Link
              href="/loads"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full",
              )}
            >
              See available trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Calculator                                                                  */
/* -------------------------------------------------------------------------- */

export function EstimateCalculator() {
  const id = useId();
  const [category, setCategory] = useState<EstimateCategory>("car");
  const [details, setDetails] = useState<Details>(defaultDetails);
  const [from, setFrom] = useState<Place | null>(null);
  const [to, setTo] = useState<Place | null>(null);
  const [timing, setTiming] = useState<Timing>("flexible");
  const [date, setDate] = useState<Date | undefined>();
  const [dateOpen, setDateOpen] = useState(false);

  const estimate = useMemo(
    () =>
      from && to && from.code !== to.code
        ? estimatePrice({ item: itemFor(category, details), from, to, timing })
        : null,
    [category, details, from, to, timing],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
        <form
          className="flex min-w-0 flex-col gap-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <Section title="What are you shipping?">
            <ToggleGroup
              aria-label="What are you shipping?"
              variant="outline"
              value={[category]}
              onValueChange={(next) =>
                next[0] && setCategory(next[0] as EstimateCategory)
              }
              className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {categories.map((c) => (
                <ToggleGroupItem
                  key={c.value}
                  value={c.value}
                  className="h-auto flex-col gap-2 rounded-xl py-4 aria-pressed:border-foreground aria-pressed:bg-background"
                >
                  <HugeiconsIcon
                    icon={c.icon}
                    strokeWidth={2}
                    className="size-6"
                  />
                  {c.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Section>

          <Section title="Item details">
            <ItemDetailsFields
              category={category}
              details={details}
              setDetails={setDetails}
            />
          </Section>

          <Section title="Where is it going?">
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldRow label="From" htmlFor={`${id}-from`}>
                <PlacePicker
                  id={`${id}-from`}
                  value={from}
                  onChange={setFrom}
                  placeholder="City or zip"
                />
              </FieldRow>
              <FieldRow label="To" htmlFor={`${id}-to`}>
                <PlacePicker
                  id={`${id}-to`}
                  value={to}
                  onChange={setTo}
                  placeholder="City or zip"
                />
              </FieldRow>
            </div>
          </Section>

          <Section title="When?">
            <div className="flex flex-wrap items-center gap-2">
              <Chips
                label="When?"
                value={timing}
                options={timings}
                onChange={(next) => {
                  setTiming(next);
                  if (next === "exact" && !date) setDateOpen(true);
                }}
              />
              {timing === "exact" && (
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        size="lg"
                        className={cn(
                          "h-10 bg-background",
                          !date && "text-muted-foreground",
                        )}
                      />
                    }
                  >
                    <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
                    {date ? formatShortDay(date) : "Pick a date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <FutureCalendar
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        if (d) setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </Section>
        </form>

        <aside
          aria-label="Your estimate"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <ResultPanel estimate={estimate} from={from} to={to} />
        </aside>
      </div>
    </MotionConfig>
  );
}
