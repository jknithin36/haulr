"use client";

import {
  Calendar03Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { formatDay, fromIso, toIso } from "@/lib/wizard";

/** Label above a control, with an optional hint underneath. */
export function Field({
  label,
  htmlFor,
  hint,
  optional,
  className,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Group heading for a cluster of fields. */
export function FieldSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: IconSvgElement;
};

/** Large single-choice cards: soft panels that turn solid when chosen. */
export function OptionCards<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 2,
  size = "default",
}: {
  label: string;
  value: T | null | "";
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  columns?: 1 | 2 | 3;
  size?: "default" | "sm";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: styled radio cards.
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex items-start gap-4 rounded-2xl text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              size === "default" ? "p-5" : "px-4 py-3.5",
              selected
                ? "bg-foreground text-background"
                : "bg-muted/50 hover:bg-muted",
            )}
          >
            {o.icon && (
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  selected ? "bg-background/15" : "bg-background",
                )}
              >
                <HugeiconsIcon icon={o.icon} strokeWidth={2} />
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-semibold">{o.label}</span>
              {o.description && (
                <span
                  className={cn(
                    "text-sm text-pretty",
                    selected ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  {o.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const chipClass =
  "h-9 rounded-full bg-muted/60 px-4 hover:bg-muted aria-pressed:bg-foreground aria-pressed:text-background data-pressed:bg-foreground data-pressed:text-background";

/** Pill-shaped single choice. */
export function Chips<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | null | "";
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={value ? [value] : []}
      onValueChange={(next) => next[0] && onChange(next[0] as T)}
      className="flex-wrap"
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} className={chipClass}>
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** Pill-shaped multiple choice. */
export function MultiChips<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  options: readonly { value: T; label: string; icon?: IconSvgElement }[];
}) {
  return (
    <ToggleGroup
      multiple
      aria-label={label}
      value={value}
      onValueChange={(next) => onChange(next as T[])}
      className="flex-wrap"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className={cn(chipClass, o.icon && "pl-3")}
        >
          {o.icon && (
            <HugeiconsIcon
              icon={o.icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
          )}
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <Select
      items={options.map((o) => ({ value: o, label: o }))}
      value={value || null}
      onValueChange={(v) => onChange((v as string | null) ?? "")}
    >
      <SelectTrigger id={id} className="w-full data-[size=default]:h-10">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Number input with a unit addon, e.g. "lb" or "in". */
export function UnitInput({
  id,
  value,
  onChange,
  unit,
  prefix,
  placeholder = "0",
  decimal,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  prefix?: string;
  placeholder?: string;
  decimal?: boolean;
  "aria-label"?: string;
}) {
  return (
    <InputGroup className="h-10">
      {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
      <InputGroupInput
        id={id}
        aria-label={ariaLabel}
        inputMode={decimal ? "decimal" : "numeric"}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(
            decimal
              ? e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1")
              : e.target.value.replace(/[^\d]/g, ""),
          )
        }
      />
      {unit && <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>}
    </InputGroup>
  );
}

/** Length × width × height in inches. */
export function DimensionsInput({
  value,
  onChange,
  label = "Dimensions",
}: {
  value: { l: string; w: string; h: string };
  onChange: (value: { l: string; w: string; h: string }) => void;
  label?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["l", "w", "h"] as const).map((k) => (
        <UnitInput
          key={k}
          aria-label={`${label}: ${k === "l" ? "length" : k === "w" ? "width" : "height"}`}
          placeholder={k === "l" ? "Length" : k === "w" ? "Width" : "Height"}
          unit="in"
          value={value[k]}
          onChange={(v) => onChange({ ...value, [k]: v })}
        />
      ))}
    </div>
  );
}

/** Minus / count / plus. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="inline-flex h-10 items-center gap-1 rounded-lg bg-muted/60 p-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Fewer ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="hover:bg-background"
      >
        <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
      </Button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-sm font-medium tabular-nums"
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`More ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="hover:bg-background"
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
      </Button>
    </div>
  );
}

/** Popover calendar storing yyyy-mm-dd. */
export function DateField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  placeholder = "Choose a date",
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? fromIso(value) : undefined;
  const before = min ? fromIso(min) : undefined;
  const after = max ? fromIso(max) : undefined;
  return (
    <Field label={label}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          render={
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-10 w-full justify-start font-normal",
                !value && "text-muted-foreground",
              )}
            />
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          {value ? formatDay(value) : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? toIso(date) : "");
              setOpen(false);
            }}
            defaultMonth={selected ?? before}
            disabled={[
              ...(before ? [{ before }] : []),
              ...(after ? [{ after }] : []),
            ]}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

/** Small muted callout with an icon, for tips. */
export function Tip({
  icon,
  children,
}: {
  icon: IconSvgElement;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="mt-px size-4 shrink-0"
      />
      <p className="text-pretty">{children}</p>
    </div>
  );
}

/** One block of a review step: a heading with an Edit link, then label/value rows. */
export function ReviewSection({
  title,
  onEdit,
  rows,
  children,
}: {
  title: string;
  onEdit: () => void;
  rows: [string, React.ReactNode][];
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">{title}</h2>
        <Button
          variant="link"
          size="sm"
          className="h-auto px-0 text-foreground underline"
          onClick={onEdit}
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          Edit
        </Button>
      </div>
      {children}
      <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[10rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="-mt-2 font-medium sm:mt-0">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
