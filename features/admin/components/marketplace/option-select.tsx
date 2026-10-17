"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Select with separate values and labels, e.g. "7" shown as "Last 7 days". */
export function OptionSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select
      items={options}
      value={value || null}
      onValueChange={(v) => onChange((v as string | null) ?? "")}
    >
      <SelectTrigger
        id={id}
        className={cn("w-full data-[size=default]:h-9", className)}
      >
        <SelectValue placeholder={placeholder} />
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
