"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSessionRole } from "@/features/user/hooks/use-session-role";
import {
  type CargoType,
  cargoTypes,
  cityName,
  estimatePrice,
  formatPrice,
  scarcityLabel,
  type Trip,
  unitName,
} from "@/lib/demo-data/trips";
import { firstName } from "@/lib/format";
import { cn } from "@/lib/utils";

type Request = {
  summary: string;
  route: string;
  estimate: number;
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function StopSelect({
  label,
  items,
  value,
  onChange,
  isDisabled,
}: {
  label: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  isDisabled?: (value: string) => boolean;
}) {
  return (
    <Field label={label}>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => onChange(v as string)}
      >
        <SelectTrigger aria-label={label} className="h-9 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={isDisabled?.(item.value)}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function BookingForm({
  trip,
  onSubmit,
}: {
  trip: Trip;
  onSubmit: (request: Request) => void;
}) {
  const driver = firstName(trip.driver);
  const last = trip.stops.length - 1;
  const cargoItems = cargoTypes
    .filter((c) => trip.carries.includes(c.value))
    .map((c) => ({ value: c.value, label: c.item }));

  const [cargo, setCargo] = useState<CargoType>(trip.carries[0]);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(
    trip.unit === "cuft" ? String(Math.min(100, trip.left)) : "1",
  );
  const [pickup, setPickup] = useState(0);
  const [dropoff, setDropoff] = useState(last);
  const [message, setMessage] = useState("");

  const isCar = cargo === "cars";
  const qty = isCar ? 1 : Number(quantity) || 0;
  const estimate = estimatePrice(trip, qty, pickup, dropoff);
  const valid = isCar
    ? year.length === 4 && !!make.trim() && !!model.trim()
    : !!item.trim() && qty > 0 && qty <= trip.left;

  const pickupItems = trip.stops
    .slice(0, -1)
    .map((s, i) => ({ value: String(i), label: cityName(s.place) }));
  const dropoffItems = trip.stops
    .slice(1)
    .map((s, i) => ({ value: String(i + 1), label: cityName(s.place) }));
  const route = `${cityName(trip.stops[pickup].place)} to ${cityName(trip.stops[dropoff].place)}`;

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSubmit({
          summary: isCar
            ? `${year} ${make.trim()} ${model.trim()}`
            : trip.unit === "cuft"
              ? `${item.trim()} · ${qty} cu ft`
              : `${item.trim()} · ${qty} ${qty === 1 ? "pallet" : "pallets"}`,
          route,
          estimate,
        });
      }}
    >
      <h3 className="font-semibold">Book a spot</h3>

      {cargoItems.length > 1 ? (
        <Field label="What are you shipping">
          <Select
            items={cargoItems}
            value={cargo}
            onValueChange={(v) => setCargo(v as CargoType)}
          >
            <SelectTrigger
              aria-label="What are you shipping"
              className="h-9 w-full bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cargoItems.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ) : (
        <Field label="What are you shipping">
          <p className="flex h-9 items-center rounded-lg bg-background px-3 text-sm">
            {cargoItems[0]?.label}
          </p>
        </Field>
      )}

      {isCar ? (
        <fieldset className="grid gap-1.5">
          <legend className="mb-1.5 text-sm font-medium">Vehicle</legend>
          <div className="grid grid-cols-[4.5rem_1fr_1fr] gap-2">
            <Input
              aria-label="Year"
              placeholder="Year"
              inputMode="numeric"
              maxLength={4}
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
              className="h-9 bg-background"
            />
            <Input
              aria-label="Make"
              placeholder="Make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="h-9 bg-background"
            />
            <Input
              aria-label="Model"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="h-9 bg-background"
            />
          </div>
        </fieldset>
      ) : (
        <>
          <Field label="What is it?" htmlFor="booking-item">
            <Input
              id="booking-item"
              placeholder={
                cargo === "pallets" ? "Boxed tiles" : "Sofa and two chairs"
              }
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="h-9 bg-background"
            />
          </Field>
          <Field
            label={trip.unit === "cuft" ? "Space needed" : "Pallets"}
            htmlFor="booking-qty"
          >
            <InputGroup className="h-9 bg-background">
              <InputGroupInput
                id="booking-qty"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
              />
              <InputGroupAddon align="inline-end">
                {trip.unit === "cuft" ? "cu ft" : `of ${trip.left}`}
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <StopSelect
          label="Pickup at"
          items={pickupItems}
          value={String(pickup)}
          onChange={(v) => {
            const next = Number(v);
            setPickup(next);
            if (dropoff <= next) setDropoff(next + 1);
          }}
        />
        <StopSelect
          label="Dropoff at"
          items={dropoffItems}
          value={String(dropoff)}
          onChange={(v) => setDropoff(Number(v))}
          isDisabled={(v) => Number(v) <= pickup}
        />
      </div>

      <div className="flex items-end justify-between gap-3 rounded-xl bg-background px-4 py-3">
        <div>
          <p className="text-sm font-medium">Estimated price</p>
          <p className="text-xs text-muted-foreground">{route}</p>
        </div>
        <p
          aria-live="polite"
          className="font-heading text-xl font-semibold tabular-nums"
        >
          {formatPrice(estimate)}
        </p>
      </div>

      <Field label={`Message to ${driver} (optional)`} htmlFor="booking-msg">
        <Textarea
          id="booking-msg"
          placeholder={`Anything ${driver} should know about pickup?`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-background"
        />
      </Field>

      <Button type="submit" size="lg" disabled={!valid}>
        Request a spot
      </Button>
    </form>
  );
}

export function BookingPanel({ trip }: { trip: Trip }) {
  const signedIn = Boolean(useSessionRole());
  const [request, setRequest] = useState<Request | null>(null);
  const driver = firstName(trip.driver);
  const scarcity = scarcityLabel(trip);
  const full = trip.left === 0;

  let body: React.ReactNode;
  if (full) {
    body = (
      <div className="flex flex-col gap-3 rounded-xl bg-background p-4 text-sm">
        <p className="font-medium">This trip is full</p>
        <Link
          href="#other-trips"
          className="w-fit underline underline-offset-4"
        >
          See other trips on this route
        </Link>
      </div>
    );
  } else if (!signedIn) {
    body = (
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        Log in to book
      </Link>
    );
  } else if (request) {
    body = (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 rounded-xl bg-background p-4 text-sm"
      >
        <p className="flex items-center gap-2 font-medium">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="size-4"
          />
          Waiting for {driver} to accept
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="text-right">{request.summary}</dd>
          <dt className="text-muted-foreground">Route</dt>
          <dd className="text-right">{request.route}</dd>
          <dt className="text-muted-foreground">Estimate</dt>
          <dd className="text-right font-medium tabular-nums">
            {formatPrice(request.estimate)}
          </dd>
        </dl>
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setRequest(null)}
        >
          Cancel request
        </Button>
      </motion.div>
    );
  } else {
    body = <BookingForm trip={trip} onSubmit={setRequest} />;
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-muted/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <p>
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {formatPrice(trip.price)}
          </span>{" "}
          <span className="text-muted-foreground">
            per {unitName(trip.unit)}
          </span>
        </p>
        {(full || scarcity) && (
          <span className="mt-1.5 inline-flex h-6 shrink-0 items-center rounded-full bg-background px-2.5 text-xs font-medium">
            {full ? "Full" : scarcity}
          </span>
        )}
      </div>
      {body}
      {!full && (
        <p className="text-center text-xs text-pretty text-muted-foreground">
          {driver} usually replies within {trip.repliesWithin}. You won’t be
          charged until {trip.pronoun} accepts.
        </p>
      )}
    </div>
  );
}
