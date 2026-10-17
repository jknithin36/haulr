"use client";

import {
  Calendar03Icon,
  Cancel01Icon,
  FilterHorizontalIcon,
  GridViewIcon,
  ListViewIcon,
  MapsIcon,
  Search01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { CtaBand } from "@/components/ui/cta-band";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PlacePicker } from "@/features/place/components/place-picker";
import { TripRow, TripTicket } from "@/features/trip/components/trip-card";
import type { Place } from "@/lib/demo-data/places";
import {
  type CargoType,
  cargoTypes,
  origin,
  parseDay,
  type Trip,
  typicalPrice,
  type VehicleType,
  vehicleTypes,
} from "@/lib/demo-data/trips";
import { formatNumber, formatShortDay, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

// The map pulls in MapLibre, which needs the browser.
const TripsMap = dynamic(
  () => import("@/features/trip/components/trips-map").then((m) => m.TripsMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[640px] animate-pulse rounded-2xl bg-muted/50" />
    ),
  },
);

const DAY = 24 * 60 * 60 * 1000;
const MAX_PRICE = 1500;
const PAGE_SIZE = 9;

const departureOptions = [
  { value: "week", label: "This week" },
  { value: "2weeks", label: "Next 2 weeks" },
] as const;

const spaceOptions = [
  { value: "car", label: "At least 1 car spot" },
  { value: "cuft", label: "At least 100 cu ft" },
] as const;

const sortOptions = [
  { value: "departing", label: "Departing soon" },
  { value: "price", label: "Lowest price" },
  { value: "space", label: "Most space" },
  { value: "rating", label: "Top rated" },
] as const;

type Sort = (typeof sortOptions)[number]["value"];
type View = "grid" | "list" | "map";
type SpaceOption = (typeof spaceOptions)[number]["value"];

type Filters = {
  vehicles: VehicleType[];
  carries: CargoType[];
  departure: "" | (typeof departureOptions)[number]["value"] | "date";
  departureDate?: Date;
  space: SpaceOption[];
  maxPrice: number;
  verifiedOnly: boolean;
  topRated: boolean;
};

type Search = { from: Place | null; to: Place | null; date?: Date };

const emptySearch: Search = { from: null, to: null };

const defaultFilters: Filters = {
  vehicles: [],
  carries: [],
  departure: "",
  space: [],
  maxPrice: MAX_PRICE,
  verifiedOnly: false,
  topRated: false,
};

function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function toUtcDay(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function departs(trip: Trip) {
  return parseDay(origin(trip).date);
}

/**
 * Pickups and dropoffs work at any stop, so "From" can match any stop but the
 * last, and "To" any stop after it. Returns the pickup stop index, or -1.
 */
function pickupIndex(trip: Trip, search: Search) {
  const last = trip.stops.length - 1;
  const from = search.from
    ? trip.stops.findIndex(
        (s, i) => i < last && s.place.code === search.from?.code,
      )
    : 0;
  if (from === -1) return -1;
  if (
    search.to &&
    !trip.stops.some((s, i) => i > from && s.place.code === search.to?.code)
  )
    return -1;
  return from;
}

function departureRange(filters: Filters): [Date, Date] | null {
  if (filters.departure === "date" && filters.departureDate) {
    const d = toUtcDay(filters.departureDate);
    return [d, d];
  }
  if (!filters.departure || filters.departure === "date") return null;
  const today = startOfToday();
  const days = filters.departure === "week" ? 6 : 13;
  return [today, new Date(today.getTime() + days * DAY)];
}

function matches(trip: Trip, filters: Filters, search: Search) {
  const pickup = pickupIndex(trip, search);
  if (pickup === -1) return false;
  // Ready by: the item is ready on that date, so the truck must reach the
  // pickup stop on or after it.
  if (search.date && parseDay(trip.stops[pickup].date) < toUtcDay(search.date))
    return false;

  if (filters.vehicles.length && !filters.vehicles.includes(trip.vehicle))
    return false;
  if (
    filters.carries.length &&
    !filters.carries.some((c) => trip.carries.includes(c))
  )
    return false;

  const range = departureRange(filters);
  if (range) {
    const d = departs(trip);
    if (d < range[0] || d > range[1]) return false;
  }

  if (filters.space.length) {
    const fits = filters.space.some((s) =>
      s === "car"
        ? trip.unit === "car" && trip.left >= 1
        : trip.unit === "cuft" && trip.left >= 100,
    );
    if (!fits) return false;
  }

  if (filters.maxPrice < MAX_PRICE && typicalPrice(trip) > filters.maxPrice)
    return false;
  if (filters.verifiedOnly && !trip.verified) return false;
  if (filters.topRated && trip.rating < 4.5) return false;
  return true;
}

const sorters: Record<Sort, (a: Trip, b: Trip) => number> = {
  departing: (a, b) => departs(a).getTime() - departs(b).getTime(),
  price: (a, b) => typicalPrice(a) - typicalPrice(b),
  space: (a, b) => b.left / b.capacity - a.left / a.capacity,
  rating: (a, b) => b.rating - a.rating,
};

/** "$750", or "$1,500+" at the top of the slider. */
const formatMaxPrice = (n: number) =>
  `${formatUsd(n)}${n >= MAX_PRICE ? "+" : ""}`;

/** One chip per active filter, each with a way to clear just that filter. */
function activeChips(
  filters: Filters,
  search: Search,
  setFilters: (f: Filters) => void,
  setSearch: (s: Search) => void,
) {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (search.from)
    chips.push({
      key: "from",
      label: `From ${search.from.label}`,
      clear: () => setSearch({ ...search, from: null }),
    });
  if (search.to)
    chips.push({
      key: "to",
      label: `To ${search.to.label}`,
      clear: () => setSearch({ ...search, to: null }),
    });
  if (search.date)
    chips.push({
      key: "ready",
      label: `Ready by ${formatShortDay(search.date)}`,
      clear: () => setSearch({ ...search, date: undefined }),
    });
  for (const v of filters.vehicles) {
    chips.push({
      key: `vehicle-${v}`,
      label: vehicleTypes.find((x) => x.value === v)?.label ?? v,
      clear: () =>
        setFilters({
          ...filters,
          vehicles: filters.vehicles.filter((x) => x !== v),
        }),
    });
  }
  for (const c of filters.carries) {
    chips.push({
      key: `carries-${c}`,
      label: `Carries ${cargoTypes.find((x) => x.value === c)?.label.toLowerCase()}`,
      clear: () =>
        setFilters({
          ...filters,
          carries: filters.carries.filter((x) => x !== c),
        }),
    });
  }
  if (filters.departure) {
    chips.push({
      key: "departure",
      label:
        filters.departure === "date" && filters.departureDate
          ? `Departs ${formatShortDay(filters.departureDate)}`
          : `Departs ${departureOptions.find((o) => o.value === filters.departure)?.label.toLowerCase()}`,
      clear: () =>
        setFilters({ ...filters, departure: "", departureDate: undefined }),
    });
  }
  for (const s of filters.space) {
    chips.push({
      key: `space-${s}`,
      label: spaceOptions.find((x) => x.value === s)?.label ?? s,
      clear: () =>
        setFilters({ ...filters, space: filters.space.filter((x) => x !== s) }),
    });
  }
  if (filters.maxPrice < MAX_PRICE)
    chips.push({
      key: "price",
      label: `Up to ${formatMaxPrice(filters.maxPrice)}`,
      clear: () => setFilters({ ...filters, maxPrice: MAX_PRICE }),
    });
  if (filters.verifiedOnly)
    chips.push({
      key: "verified",
      label: "Verified drivers",
      clear: () => setFilters({ ...filters, verifiedOnly: false }),
    });
  if (filters.topRated)
    chips.push({
      key: "rated",
      label: "4.5★ and up",
      clear: () => setFilters({ ...filters, topRated: false }),
    });
  return chips;
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-medium">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckList<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T[];
  onChange: (value: T[]) => void;
}) {
  return options.map((o) => (
    <Label key={o.value} className="font-normal">
      <Checkbox
        checked={value.includes(o.value)}
        onCheckedChange={(checked) =>
          onChange(
            checked ? [...value, o.value] : value.filter((x) => x !== o.value),
          )
        }
      />
      {o.label}
    </Label>
  ));
}

function FiltersPanel({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-8">
      <FilterGroup title="Vehicle type">
        <CheckList
          options={vehicleTypes}
          value={filters.vehicles}
          onChange={(v) => set("vehicles", v)}
        />
      </FilterGroup>

      <FilterGroup title="Can carry">
        <CheckList
          options={cargoTypes}
          value={filters.carries}
          onChange={(v) => set("carries", v)}
        />
      </FilterGroup>

      <FilterGroup title="Departure">
        <ToggleGroup
          aria-label="Departure"
          variant="outline"
          size="sm"
          value={
            filters.departure && filters.departure !== "date"
              ? [filters.departure]
              : []
          }
          onValueChange={(next) =>
            setFilters({
              ...filters,
              departure: (next[0] as Filters["departure"] | undefined) ?? "",
              departureDate: undefined,
            })
          }
          className="flex-wrap"
        >
          {departureOptions.map((o) => (
            <ToggleGroupItem key={o.value} value={o.value}>
              {o.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant={filters.departure === "date" ? "secondary" : "outline"}
                size="sm"
                className="w-fit"
              />
            }
          >
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
            {filters.departure === "date" && filters.departureDate
              ? formatShortDay(filters.departureDate)
              : "Pick a date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.departureDate}
              onSelect={(date) =>
                setFilters({
                  ...filters,
                  departure: date ? "date" : "",
                  departureDate: date,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </FilterGroup>

      <FilterGroup title="Space left">
        <CheckList
          options={spaceOptions}
          value={filters.space}
          onChange={(v) => set("space", v)}
        />
      </FilterGroup>

      <FilterGroup title="Price">
        <Slider
          aria-label="Maximum price"
          min={50}
          max={MAX_PRICE}
          step={50}
          value={[filters.maxPrice]}
          onValueChange={(v) =>
            set("maxPrice", typeof v === "number" ? v : v[0])
          }
        />
        <div className="flex flex-col gap-0.5 text-sm">
          <p className="tabular-nums">
            {filters.maxPrice >= MAX_PRICE
              ? "Any price"
              : `Up to ${formatMaxPrice(filters.maxPrice)}`}
          </p>
          <p className="text-xs text-muted-foreground">
            For one car, one pallet, or 100 cu ft
          </p>
        </div>
      </FilterGroup>

      <FilterGroup title="Driver">
        <Label className="justify-between font-normal">
          Verified only
          <Switch
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => set("verifiedOnly", checked)}
          />
        </Label>
        <Label className="justify-between font-normal">
          4.5★ and up
          <Switch
            checked={filters.topRated}
            onCheckedChange={(checked) => set("topRated", checked)}
          />
        </Label>
      </FilterGroup>
    </div>
  );
}

function SearchBar({
  search,
  onSearch,
}: {
  search: Search;
  onSearch: (s: Search) => void;
}) {
  const [draft, setDraft] = useState(search);
  const [synced, setSynced] = useState(search);
  // Clearing a chip updates the search from outside; mirror it in the inputs.
  if (synced !== search) {
    setSynced(search);
    setDraft(search);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(draft);
      }}
      className="grid gap-2 rounded-2xl bg-muted/50 p-2 md:grid-cols-[1fr_1fr_auto_auto]"
    >
      <PlacePicker
        aria-label="From"
        placeholder="From: City or zip"
        value={draft.from}
        onChange={(from) => setDraft({ ...draft, from })}
      />
      <PlacePicker
        aria-label="To"
        placeholder="To: City or zip"
        value={draft.to}
        onChange={(to) => setDraft({ ...draft, to })}
      />
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-10 justify-start bg-background md:w-40",
                !draft.date && "text-muted-foreground",
              )}
            />
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          {draft.date ? `Ready ${formatShortDay(draft.date)}` : "Ready by"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={draft.date}
            onSelect={(date) => setDraft({ ...draft, date })}
          />
        </PopoverContent>
      </Popover>
      <Button type="submit" size="lg" className="h-10 px-5">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        Search
      </Button>
    </form>
  );
}

/** Search, filters, and results for the trip marketplace. */
export function TripBrowserClient({ trips }: { trips: Trip[] }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [search, setSearch] = useState<Search>(emptySearch);
  const [sort, setSort] = useState<Sort>("departing");
  const [view, setView] = useState<View>("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());

  const results = useMemo(
    () =>
      trips
        .filter((trip) => matches(trip, filters, search))
        .sort(sorters[sort]),
    [trips, filters, search, sort],
  );

  const chips = activeChips(filters, search, setFilters, setSearch);
  const clearAll = () => {
    setFilters(defaultFilters);
    setSearch(emptySearch);
  };
  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const shown = view === "map" ? results : results.slice(0, visible);
  const count = `${formatNumber(results.length)} ${results.length === 1 ? "trip" : "trips"} with open space`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-6 pb-16 md:pb-24">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Marketplace
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Book space on a driver’s trip
            </h1>
            <p className="text-pretty text-muted-foreground md:text-lg">
              These drivers are already heading your way. Reserve a spot and
              often pay less.
            </p>
          </div>
          <Link
            href="/loads/new"
            className={cn(buttonVariants({ size: "lg" }), "w-fit")}
          >
            Share your truck space
          </Link>
        </header>

        <SearchBar
          search={search}
          onSearch={(s) => {
            setSearch(s);
            setVisible(PAGE_SIZE);
          }}
        />

        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="max-lg:hidden">
            <div className="sticky top-20 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Filters</h2>
                {chips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <FiltersPanel filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-medium max-sm:w-full">{count}</p>

              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="lg" className="lg:hidden" />
                  }
                >
                  <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={2} />
                  Filters
                  {chips.length > 0 && (
                    <span className="rounded-full bg-foreground px-1.5 text-xs text-background tabular-nums">
                      {chips.length}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-sm">
                  <SheetHeader className="flex-row items-center justify-between pr-12">
                    <SheetTitle>Filters</SheetTitle>
                    {chips.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <FiltersPanel filters={filters} setFilters={setFilters} />
                  </div>
                  <SheetFooter className="border-t">
                    <SheetClose render={<Button size="lg" />}>
                      Show {results.length}{" "}
                      {results.length === 1 ? "trip" : "trips"}
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <div className="ml-auto flex items-center gap-2">
                <Select
                  items={sortOptions}
                  value={sort}
                  onValueChange={(v) => setSort(v as Sort)}
                >
                  <SelectTrigger aria-label="Sort by" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {sortOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ToggleGroup
                  aria-label="View"
                  variant="outline"
                  value={[view]}
                  onValueChange={(next) => next[0] && setView(next[0] as View)}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <HugeiconsIcon icon={ListViewIcon} strokeWidth={2} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Map view">
                    <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {chips.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={chip.clear}
                      aria-label={`Remove filter: ${chip.label}`}
                      className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted pr-2 pl-3 text-xs font-medium transition-colors hover:bg-muted/70"
                    >
                      {chip.label}
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        strokeWidth={2}
                        className="size-3.5 text-muted-foreground"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {results.length === 0 ? (
              <Empty className="flex-none rounded-2xl bg-muted/50 py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={TruckIcon} strokeWidth={2} />
                  </EmptyMedia>
                  <EmptyTitle>No trips on this route yet</EmptyTitle>
                  <EmptyDescription>
                    Post your shipment instead, and drivers will send you
                    offers.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center">
                  <Link
                    href="/shipments/new"
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    Post a shipment
                  </Link>
                  <Button variant="outline" size="lg" onClick={clearAll}>
                    Clear filters
                  </Button>
                </EmptyContent>
              </Empty>
            ) : view === "map" ? (
              <TripsMap trips={shown} />
            ) : view === "list" ? (
              <ul className="flex flex-col gap-3">
                {shown.map((trip) => (
                  <li key={trip.id}>
                    <TripRow
                      trip={trip}
                      saved={saved.has(trip.id)}
                      onToggleSave={() => toggleSave(trip.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((trip) => (
                  <li key={trip.id}>
                    <TripTicket
                      trip={trip}
                      saved={saved.has(trip.id)}
                      onToggleSave={() => toggleSave(trip.id)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {view !== "map" && results.length > visible && (
              <Button
                variant="outline"
                size="lg"
                className="mx-auto mt-2"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Load more trips
              </Button>
            )}
          </div>
        </div>

        <CtaBand>
          <p className="text-pretty">
            <span className="font-medium">Can’t find the right trip?</span>{" "}
            <span className="text-muted-foreground">
              Post your shipment and let drivers come to you.
            </span>
          </p>
        </CtaBand>
      </div>
    </MotionConfig>
  );
}
