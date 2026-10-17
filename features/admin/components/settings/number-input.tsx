"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/** Small numeric input with an optional unit before or after ("$", "%"). */
export function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  label,
  id,
  className,
  min = 0,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  label?: string;
  id?: string;
  className?: string;
  min?: number;
  max?: number;
}) {
  return (
    <InputGroup
      className={cn(
        "h-9 w-28 bg-background text-foreground dark:bg-background",
        className,
      )}
    >
      {prefix && (
        <InputGroupAddon>
          <InputGroupText>{prefix}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        id={id}
        aria-label={label}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
