/**
 * Display formatters shared across the app. Everything is US English,
 * since the marketplace and its demo data are US-only.
 */

const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormat = new Intl.NumberFormat("en-US");

const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const shortDayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/** A date in the viewer's time zone → "Mar 14" */
export function formatShortDay(date: Date | number) {
  return shortDayFormat.format(date);
}

/** 1250 → "$1,250"; pass `decimals` for unit prices like "$1.10". */
export function formatUsd(value: number, decimals = 0) {
  if (decimals === 0) return usdFormat.format(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** 12500 → "12,500" */
export function formatNumber(value: number) {
  return numberFormat.format(value);
}

/** 12500 → "12.5K" */
export function formatCompact(value: number) {
  return compactFormat.format(value);
}

/** 1240 → "1,240 mi" */
export function formatMiles(value: number) {
  return `${numberFormat.format(value)} mi`;
}

/** "Sarah Miller" → "Sarah" */
export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** "Sarah Miller" → "SM" */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
