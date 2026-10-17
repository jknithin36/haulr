"use client";

import { createContext, useContext, useState } from "react";

export const adminRanges = [
  "Last 7 days",
  "Month to date",
  "Last 30 days",
  "Custom",
] as const;

export type AdminRange = (typeof adminRanges)[number];

const RangeContext = createContext<{
  range: AdminRange;
  setRange: (range: AdminRange) => void;
}>({ range: "Month to date", setRange: () => {} });

/** Shares the top-bar date range with admin pages. Sample data is month to date. */
export function AdminRangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [range, setRange] = useState<AdminRange>("Month to date");
  return (
    <RangeContext.Provider value={{ range, setRange }}>
      {children}
    </RangeContext.Provider>
  );
}

export function useAdminRange() {
  return useContext(RangeContext);
}
