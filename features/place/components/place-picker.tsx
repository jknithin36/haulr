"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { type Place, places } from "@/lib/demo-data/places";
import { cn } from "@/lib/utils";

/** City search backed by the known places list. */
export function PlacePicker({
  value,
  onChange,
  placeholder = "City or zip",
  id,
  className,
  "aria-label": ariaLabel,
}: {
  value: Place | null;
  onChange: (place: Place | null) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Combobox
      items={places}
      value={value}
      onValueChange={(next) => onChange((next as Place | null) ?? null)}
      itemToStringLabel={(place: Place) => place.label}
      isItemEqualToValue={(a: Place, b: Place) => a.code === b.code}
    >
      <ComboboxInput
        id={id}
        aria-label={ariaLabel}
        placeholder={placeholder}
        className={cn("h-10 w-full bg-background", className)}
      />
      <ComboboxContent>
        <ComboboxEmpty>No matching cities</ComboboxEmpty>
        <ComboboxList>
          {(place: Place) => (
            <ComboboxItem key={place.code} value={place}>
              {place.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
