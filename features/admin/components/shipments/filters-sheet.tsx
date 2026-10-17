"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { OptionSelect } from "@/features/admin/components/marketplace/option-select";
import {
  type AdminShipment,
  adminShipments,
  shipmentCategories,
  TODAY,
} from "@/lib/demo-data/admin/shipments";
import { formatUsd } from "@/lib/format";

const BUDGET_MAX = 2000;

export type ShipmentFilters = {
  category: string;
  state: string;
  posted: string;
  budget: [number, number];
  offers: string;
  flaggedOnly: boolean;
};

export const defaultFilters: ShipmentFilters = {
  category: "any",
  state: "any",
  posted: "any",
  budget: [0, BUDGET_MAX],
  offers: "any",
  flaggedOnly: false,
};

const stateCode = (place: string) => place.split(", ").at(-1) ?? "";

const states = [
  ...new Set(adminShipments.flatMap((s) => [s.from, s.to].map(stateCode))),
].sort();

const categoryOptions = [
  { value: "any", label: "Any category" },
  ...shipmentCategories.map((c) => ({ value: c, label: c })),
];
const stateOptions = [
  { value: "any", label: "Any state" },
  ...states.map((s) => ({ value: s, label: s })),
];
const postedOptions = [
  { value: "any", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];
const offerOptions = [
  { value: "any", label: "Any number" },
  { value: "none", label: "No offers yet" },
  { value: "1-5", label: "1 to 5" },
  { value: "6-10", label: "6 to 10" },
  { value: "11+", label: "More than 10" },
];

export function countActive(f: ShipmentFilters) {
  return [
    f.category !== "any",
    f.state !== "any",
    f.posted !== "any",
    f.budget[0] > 0 || f.budget[1] < BUDGET_MAX,
    f.offers !== "any",
    f.flaggedOnly,
  ].filter(Boolean).length;
}

export function matchesFilters(s: AdminShipment, f: ShipmentFilters) {
  if (f.category !== "any" && s.category !== f.category) return false;
  if (
    f.state !== "any" &&
    stateCode(s.from) !== f.state &&
    stateCode(s.to) !== f.state
  )
    return false;
  if (f.posted !== "any" && TODAY - s.postedDay > Number(f.posted))
    return false;
  if (f.budget[0] > 0 || f.budget[1] < BUDGET_MAX) {
    if (s.amount === null) return false;
    if (s.amount < f.budget[0]) return false;
    if (f.budget[1] < BUDGET_MAX && s.amount > f.budget[1]) return false;
  }
  const n = s.offers ?? 0;
  if (f.offers === "none" && n !== 0) return false;
  if (f.offers === "1-5" && (n < 1 || n > 5)) return false;
  if (f.offers === "6-10" && (n < 6 || n > 10)) return false;
  if (f.offers === "11+" && n < 11) return false;
  if (f.flaggedOnly && s.status !== "Flagged") return false;
  return true;
}

export function FiltersSheet({
  open,
  onOpenChange,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ShipmentFilters;
  onApply: (f: ShipmentFilters) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [wasOpen, setWasOpen] = useState(open);
  // Start from the applied filters each time the sheet opens.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }

  const set = (patch: Partial<ShipmentFilters>) =>
    setDraft((d) => ({ ...d, ...patch }));
  const [lo, hi] = draft.budget;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-sm">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="font-heading text-xl font-semibold">
            Filters
          </SheetTitle>
          <SheetDescription>Narrow down the shipments list.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-2">
          <Field id="f-category" label="Category">
            <OptionSelect
              id="f-category"
              value={draft.category}
              onChange={(category) => set({ category })}
              options={categoryOptions}
            />
          </Field>
          <Field id="f-state" label="State">
            <OptionSelect
              id="f-state"
              value={draft.state}
              onChange={(state) => set({ state })}
              options={stateOptions}
            />
          </Field>
          <Field id="f-posted" label="Date posted">
            <OptionSelect
              id="f-posted"
              value={draft.posted}
              onChange={(posted) => set({ posted })}
              options={postedOptions}
            />
          </Field>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <Label>Budget or price</Label>
              <span className="text-sm text-muted-foreground tabular-nums">
                {formatUsd(lo)} –{" "}
                {hi >= BUDGET_MAX ? `${formatUsd(BUDGET_MAX)}+` : formatUsd(hi)}
              </span>
            </div>
            <Slider
              value={draft.budget}
              min={0}
              max={BUDGET_MAX}
              step={50}
              minStepsBetweenValues={1}
              onValueChange={(v) => set({ budget: v as [number, number] })}
              aria-label="Budget range"
            />
          </div>
          <Field id="f-offers" label="Offers">
            <OptionSelect
              id="f-offers"
              value={draft.offers}
              onChange={(offers) => set({ offers })}
              options={offerOptions}
            />
          </Field>
          <label
            htmlFor="f-flagged"
            className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3"
          >
            <span className="flex flex-col">
              <span className="font-medium">Flagged only</span>
              <span className="text-sm text-muted-foreground">
                Shipments our checks marked for review
              </span>
            </span>
            <Switch
              id="f-flagged"
              checked={draft.flaggedOnly}
              onCheckedChange={(flaggedOnly) => set({ flaggedOnly })}
            />
          </label>
        </div>

        <SheetFooter className="flex-row gap-2 px-6 py-5">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => setDraft(defaultFilters)}
          >
            Reset
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
          >
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
