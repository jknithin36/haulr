"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminRange,
  adminRanges,
  useAdminRange,
} from "@/features/admin/components/admin-range";
import { analyticsFilters } from "@/lib/demo-data/admin/analytics";

function FilterSelect({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  icon?: boolean;
}) {
  return (
    <Select
      items={options.map((o) => ({ value: o, label: o }))}
      value={value}
      onValueChange={(next) => onChange(next as string)}
    >
      <SelectTrigger aria-label={label} className="h-9 w-full sm:w-auto">
        {icon && <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />}
        <SelectValue />
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

/**
 * One filter row above everything it scopes. The date range shares state with
 * the top bar; the rest are local (sample data is fixed).
 */
export function AnalyticsFilters() {
  const { range, setRange } = useAdminRange();
  const [category, setCategory] = useState<string>(
    analyticsFilters.category[0],
  );
  const [state, setState] = useState<string>(analyticsFilters.state[0]);
  const [userType, setUserType] = useState<string>(
    analyticsFilters.userType[0],
  );

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <FilterSelect
        label="Date range"
        icon
        options={adminRanges}
        value={range}
        onChange={(value) => setRange(value as AdminRange)}
      />
      <FilterSelect
        label="Category"
        options={analyticsFilters.category}
        value={category}
        onChange={setCategory}
      />
      <FilterSelect
        label="State"
        options={analyticsFilters.state}
        value={state}
        onChange={setState}
      />
      <FilterSelect
        label="User type"
        options={analyticsFilters.userType}
        value={userType}
        onChange={setUserType}
      />
    </div>
  );
}
