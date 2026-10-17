"use client";

import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Upload04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Chips,
  DateField,
  Field,
  SelectField,
  UnitInput,
} from "@/components/wizard/wizard-fields";
import { PhotoRemoveButton } from "@/features/dashboard/components/photo-remove-button";
import { kindIcon } from "@/features/dashboard/components/vehicles/vehicle-icons";
import {
  monthYear,
  usStates,
  type Vehicle,
  type VehicleKind,
  vehicleKinds,
} from "@/lib/demo-data/dashboard/vehicles";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toIso } from "@/lib/wizard";

const photoSlots = ["Front", "Side", "Back", "Inside"] as const;
type Slot = (typeof photoSlots)[number];

type Form = {
  kind: VehicleKind | "";
  year: string;
  make: string;
  model: string;
  plate: string;
  state: string;
  cuft: string;
  weight: string;
  cars: string;
  coverage: string;
  expires: string;
};

const emptyForm: Form = {
  kind: "",
  year: "",
  make: "",
  model: "",
  plate: "",
  state: "Texas",
  cuft: "",
  weight: "",
  cars: "",
  coverage: "",
  expires: "",
};

let vehicleSeq = 0;

export function AddVehicleSheet({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vehicle: Vehicle) => void;
}) {
  const [form, setForm] = useState<Form>(emptyForm);
  const [photos, setPhotos] = useState<Partial<Record<Slot, string>>>({});
  const [doc, setDoc] = useState<string | null>(null);

  const updateForm = (patch: Partial<Form>) =>
    setForm((f) => ({ ...f, ...patch }));
  const kind = vehicleKinds.find((k) => k.value === form.kind);

  const capacityOk =
    kind?.capacity === "cuft"
      ? !!form.cuft && !!form.weight
      : kind?.capacity === "weight"
        ? !!form.weight
        : kind?.capacity === "cars"
          ? !!form.cars
          : false;

  const valid =
    !!kind &&
    form.year.length === 4 &&
    !!form.make.trim() &&
    !!form.model.trim() &&
    !!form.plate.trim() &&
    !!form.state &&
    capacityOk &&
    photoSlots.every((s) => photos[s]) &&
    !!doc &&
    !!form.coverage &&
    !!form.expires;

  function reset() {
    setForm(emptyForm);
    setPhotos({});
    setDoc(null);
  }

  function save() {
    if (!valid || !kind) return;
    const abbr = usStates.find(([, name]) => name === form.state)?.[0] ?? "";
    const capacity =
      kind.capacity === "cuft"
        ? `${formatNumber(Number(form.cuft))} cu ft · ${formatNumber(Number(form.weight))} lb`
        : kind.capacity === "weight"
          ? `${formatNumber(Number(form.weight))} lb`
          : `${form.cars} ${form.cars === "1" ? "car" : "cars"}`;
    onSave({
      id: `VEH-new-${++vehicleSeq}`,
      name: `${form.year} ${form.make.trim()} ${form.model.trim()}`,
      kind: kind.value,
      type: kind.label,
      capacity,
      plate: `${abbr} ${form.plate.trim().toUpperCase()}`,
      insurance: `Up to $${formatNumber(Number(form.coverage))} · expires ${monthYear(form.expires)}`,
      status: "Pending review",
      photo: photos.Front,
    });
    // The front photo lives on in the card; release the rest.
    for (const s of photoSlots) {
      if (s !== "Front" && photos[s]) URL.revokeObjectURL(photos[s]);
    }
    reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-xl font-semibold">
            Add a vehicle
          </SheetTitle>
          <SheetDescription>
            Tell us what you drive so shippers know what fits.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-vehicle"
          className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Field label="Vehicle type">
            <Chips
              label="Vehicle type"
              value={form.kind}
              onChange={(v) => updateForm({ kind: v })}
              options={vehicleKinds}
            />
          </Field>

          <div className="grid grid-cols-[5.5rem_1fr_1fr] gap-3">
            <Field label="Year" htmlFor="v-year">
              <Input
                id="v-year"
                inputMode="numeric"
                placeholder="2021"
                maxLength={4}
                className="h-10"
                value={form.year}
                onChange={(e) =>
                  updateForm({ year: e.target.value.replace(/[^\d]/g, "") })
                }
              />
            </Field>
            <Field label="Make" htmlFor="v-make">
              <Input
                id="v-make"
                placeholder="Ford"
                className="h-10"
                value={form.make}
                onChange={(e) => updateForm({ make: e.target.value })}
              />
            </Field>
            <Field label="Model" htmlFor="v-model">
              <Input
                id="v-model"
                placeholder="Transit 250"
                className="h-10"
                value={form.model}
                onChange={(e) => updateForm({ model: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="License plate" htmlFor="v-plate">
              <Input
                id="v-plate"
                placeholder="ABC-1234"
                className="h-10 uppercase placeholder:normal-case"
                value={form.plate}
                onChange={(e) => updateForm({ plate: e.target.value })}
              />
            </Field>
            <Field label="State" htmlFor="v-state">
              <SelectField
                id="v-state"
                value={form.state}
                onChange={(state) => updateForm({ state })}
                options={usStates.map(([, name]) => name)}
                placeholder="Choose a state"
              />
            </Field>
          </div>

          <Field
            label="Capacity"
            hint={kind ? undefined : "Pick a vehicle type first."}
          >
            {kind?.capacity === "cuft" && (
              <div className="grid grid-cols-2 gap-3">
                <UnitInput
                  aria-label="Cargo space"
                  unit="cu ft"
                  value={form.cuft}
                  onChange={(cuft) => updateForm({ cuft })}
                />
                <UnitInput
                  aria-label="Weight limit"
                  unit="lb"
                  value={form.weight}
                  onChange={(weight) => updateForm({ weight })}
                />
              </div>
            )}
            {kind?.capacity === "weight" && (
              <UnitInput
                aria-label="Weight limit"
                unit="lb"
                value={form.weight}
                onChange={(weight) => updateForm({ weight })}
              />
            )}
            {kind?.capacity === "cars" && (
              <UnitInput
                aria-label="Car spots"
                unit="cars"
                value={form.cars}
                onChange={(cars) => updateForm({ cars })}
              />
            )}
          </Field>

          <section className="flex flex-col gap-3">
            <div>
              <h3 className="font-medium">Photos</h3>
              <p className="text-sm text-muted-foreground">
                Front, side, back, and inside. Clear daylight photos get
                approved fastest.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photoSlots.map((slot) => (
                <PhotoSlot
                  key={slot}
                  slot={slot}
                  url={photos[slot]}
                  icon={kind ? kindIcon[kind.value] : undefined}
                  onPick={(url) => {
                    if (photos[slot]) URL.revokeObjectURL(photos[slot]);
                    setPhotos((p) => ({ ...p, [slot]: url }));
                  }}
                  onRemove={() => {
                    if (photos[slot]) URL.revokeObjectURL(photos[slot]);
                    setPhotos((p) => ({ ...p, [slot]: undefined }));
                  }}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="font-medium">Insurance</h3>
            <DocumentInput name={doc} onChange={setDoc} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Coverage amount" htmlFor="v-coverage">
                <UnitInput
                  id="v-coverage"
                  prefix="$"
                  placeholder="100,000"
                  value={form.coverage}
                  onChange={(coverage) => updateForm({ coverage })}
                />
              </Field>
              <DateField
                id="v-expires"
                label="Expiry date"
                value={form.expires}
                onChange={(expires) => updateForm({ expires })}
                min={open ? toIso(new Date()) : undefined}
              />
            </div>
          </section>
        </form>

        <SheetFooter className="gap-3 border-t px-6 py-4">
          <Button type="submit" form="add-vehicle" size="lg" disabled={!valid}>
            Save vehicle
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Our team reviews new vehicles within 24 hours.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function PhotoSlot({
  slot,
  url,
  icon,
  onPick,
  onRemove,
}: {
  slot: Slot;
  url?: string;
  icon?: typeof Camera01Icon;
  onPick: (url: string) => void;
  onRemove: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/60">
        {url ? (
          <>
            {/* biome-ignore lint/performance/noImgElement: local blob preview. */}
            <img
              src={url}
              alt={`${slot} of vehicle`}
              className="size-full object-cover"
            />
            <PhotoRemoveButton
              label={`Remove ${slot.toLowerCase()} photo`}
              onClick={onRemove}
            />
          </>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            aria-label={`Add ${slot.toLowerCase()} photo`}
            className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <HugeiconsIcon
              icon={icon ?? Camera01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          data-slot-name={slot}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file?.type.startsWith("image/"))
              onPick(URL.createObjectURL(file));
            e.target.value = "";
          }}
        />
      </div>
      <p
        className={cn(
          "flex items-center gap-1 text-xs",
          url ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {url && (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        )}
        {slot}
      </p>
    </div>
  );
}

function DocumentInput({
  name,
  onChange,
}: {
  name: string | null;
  onChange: (name: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background">
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-medium">{name ?? "Insurance document"}</p>
        <p className="text-xs text-muted-foreground">
          {name ? "Ready to upload" : "PDF or photo of your policy"}
        </p>
      </div>
      {name ? (
        <Button type="button" variant="ghost" onClick={() => onChange(null)}>
          Remove
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => input.current?.click()}
        >
          <HugeiconsIcon
            icon={Upload04Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Upload
        </Button>
      )}
      <input
        ref={input}
        type="file"
        accept="application/pdf,image/*"
        hidden
        data-testid="insurance-doc"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file.name);
          e.target.value = "";
        }}
      />
    </div>
  );
}
