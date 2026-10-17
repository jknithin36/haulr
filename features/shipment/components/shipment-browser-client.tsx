"use client";

import {
  Calendar03Icon,
  Cancel01Icon,
  FilterHorizontalIcon,
  GridViewIcon,
  ListViewIcon,
  Location01Icon,
  MapsIcon,
  PackageSearchIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { RouteLabel } from "@/components/ui/route-label";
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
import {
  Countdown,
  SaveButton,
  ShipmentTicket,
  Tag,
  Ticket,
} from "@/features/shipment/components/shipment-ticket";
import { useSessionRole } from "@/features/user/hooks/use-session-role";
import {
  categoryBadge,
  formatPickup,
  parseDay,
  type Shipment,
  type ShipmentCategory,
  shipmentCategories,
} from "@/lib/demo-data/shipments";
import {
  formatMiles,
  formatNumber,
  formatShortDay,
  formatUsd,
} from "@/lib/format";
import { cn } from "@/lib/utils";

// The map pulls in MapLibre, which needs the browser.
const ShipmentsMap = dynamic(
  () =>
    import("@/features/shipment/components/shipment-map").then(
      (m) => m.ShipmentsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[640px] animate-pulse rounded-2xl bg-muted/50" />
    ),
  },
);

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const MAX_DISTANCE = 3000;
const MAX_BUDGET = 5000;
const PAGE_SIZE = 6;

const pickupOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "2weeks", label: "Next 2 weeks" },
] as const;

const offerOptions = [
  { value: "none", label: "No offers yet" },
  { value: "under5", label: "Under 5" },
  { value: "any", label: "Any" },
] as const;

const closingOptions = [
  { value: "6h", label: "In 6 hours" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
] as const;

const sortOptions = [
  { value: "closing", label: "Closing soon" },
  { value: "newest", label: "Newest" },
  { value: "budget", label: "Highest budget" },
  { value: "offers", label: "Fewest offers" },
  { value: "distance", label: "Shortest distance" },
] as const;

type Sort = (typeof sortOptions)[number]["value"];
type View = "grid" | "list" | "map";

type Filters = {
  categories: ShipmentCategory[];
  pickup: "" | (typeof pickupOptions)[number]["value"] | "date";
  pickupDate?: Date;
  distance: [number, number];
  budget: [number, number];
  offers: (typeof offerOptions)[number]["value"];
  closing: "" | (typeof closingOptions)[number]["value"];
  verifiedOnly: boolean;
};

type Search = { from: string; to: string; date?: Date };

const defaultFilters: Filters = {
  categories: [],
  pickup: "",
  distance: [0, MAX_DISTANCE],
  budget: [0, MAX_BUDGET],
  offers: "any",
  closing: "",
  verifiedOnly: false,
};

function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function toUtcDay(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

/** True when the pickup window overlaps [start, end]. */
function pickupOverlaps(s: Shipment, start: Date, end: Date) {
  return parseDay(s.pickupFrom) <= end && parseDay(s.pickupTo) >= start;
}

function pickupRange(filters: Filters): [Date, Date] | null {
  if (filters.pickup === "date" && filters.pickupDate) {
    const d = toUtcDay(filters.pickupDate);
    return [d, d];
  }
  if (!filters.pickup || filters.pickup === "date") return null;
  const today = startOfToday();
  const days = { today: 0, week: 6, "2weeks": 13 }[filters.pickup];
  return [today, new Date(today.getTime() + days * DAY)];
}

function closingLimit(closing: Filters["closing"]) {
  if (closing === "6h") return 6 * HOUR;
  if (closing === "week") return 7 * DAY;
  if (closing === "today") {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }
  return null;
}

function matches(s: Shipment, filters: Filters, search: Search) {
  const query = (text: string) => text.trim().toLowerCase();
  const fromQ = query(search.from);
  const toQ = query(search.to);
  if (fromQ && !`${s.from.label} ${s.from.code}`.toLowerCase().includes(fromQ))
    return false;
  if (toQ && !`${s.to.label} ${s.to.code}`.toLowerCase().includes(toQ))
    return false;
  if (search.date) {
    const d = toUtcDay(search.date);
    if (!pickupOverlaps(s, d, d)) return false;
  }

  if (filters.categories.length && !filters.categories.includes(s.category))
    return false;

  const range = pickupRange(filters);
  if (range && !pickupOverlaps(s, ...range)) return false;

  const [minMiles, maxMiles] = filters.distance;
  if (s.miles < minMiles) return false;
  if (maxMiles < MAX_DISTANCE && s.miles > maxMiles) return false;

  const [minBudget, maxBudget] = filters.budget;
  if (s.budget < minBudget) return false;
  if (maxBudget < MAX_BUDGET && s.budget > maxBudget) return false;

  if (filters.offers === "none" && s.offers > 0) return false;
  if (filters.offers === "under5" && s.offers >= 5) return false;

  const limit = closingLimit(filters.closing);
  if (limit !== null && s.closesInMs > limit) return false;

  if (filters.verifiedOnly && !s.verifiedShipper) return false;
  return true;
}

const sorters: Record<Sort, (a: Shipment, b: Shipment) => number> = {
  closing: (a, b) => a.closesInMs - b.closesInMs,
  newest: (a, b) => a.postedHoursAgo - b.postedHoursAgo,
  budget: (a, b) => b.budget - a.budget,
  offers: (a, b) => a.offers - b.offers,
  distance: (a, b) => a.miles - b.miles,
};

function rangeLabel(
  [min, max]: [number, number],
  limit: number,
  format: (n: number) => string,
) {
  if (min === 0) return `Under ${format(max)}`;
  if (max >= limit) return `${format(min)}+`;
  return `${format(min)} – ${format(max)}`;
}

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
      label: `From ${search.from}`,
      clear: () => setSearch({ ...search, from: "" }),
    });
  if (search.to)
    chips.push({
      key: "to",
      label: `To ${search.to}`,
      clear: () => setSearch({ ...search, to: "" }),
    });
  if (search.date)
    chips.push({
      key: "search-date",
      label: `Pickup ${formatShortDay(search.date)}`,
      clear: () => setSearch({ ...search, date: undefined }),
    });
  for (const c of filters.categories) {
    chips.push({
      key: `cat-${c}`,
      label: shipmentCategories.find((x) => x.value === c)?.label ?? c,
      clear: () =>
        setFilters({
          ...filters,
          categories: filters.categories.filter((x) => x !== c),
        }),
    });
  }
  if (filters.pickup) {
    chips.push({
      key: "pickup",
      label:
        filters.pickup === "date" && filters.pickupDate
          ? `Pickup ${formatShortDay(filters.pickupDate)}`
          : `Pickup ${pickupOptions.find((o) => o.value === filters.pickup)?.label.toLowerCase()}`,
      clear: () =>
        setFilters({ ...filters, pickup: "", pickupDate: undefined }),
    });
  }
  if (filters.distance[0] > 0 || filters.distance[1] < MAX_DISTANCE)
    chips.push({
      key: "distance",
      label: rangeLabel(filters.distance, MAX_DISTANCE, formatMiles),
      clear: () =>
        setFilters({ ...filters, distance: defaultFilters.distance }),
    });
  if (filters.budget[0] > 0 || filters.budget[1] < MAX_BUDGET)
    chips.push({
      key: "budget",
      label: rangeLabel(filters.budget, MAX_BUDGET, formatUsd),
      clear: () => setFilters({ ...filters, budget: defaultFilters.budget }),
    });
  if (filters.offers !== "any")
    chips.push({
      key: "offers",
      label: filters.offers === "none" ? "No offers yet" : "Under 5 offers",
      clear: () => setFilters({ ...filters, offers: "any" }),
    });
  if (filters.closing)
    chips.push({
      key: "closing",
      label: `Closing ${closingOptions.find((o) => o.value === filters.closing)?.label.toLowerCase()}`,
      clear: () => setFilters({ ...filters, closing: "" }),
    });
  if (filters.verifiedOnly)
    chips.push({
      key: "verified",
      label: "Verified shippers",
      clear: () => setFilters({ ...filters, verifiedOnly: false }),
    });
  return chips;
}

function ClearAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      Clear all
    </button>
  );
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

function OptionChips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  options: readonly { value: T; label: string }[];
  onChange: (value: T | "") => void;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      variant="outline"
      size="sm"
      value={value ? [value] : []}
      onValueChange={(next) => onChange((next[0] as T | undefined) ?? "")}
      className="flex-wrap"
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value}>
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
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
      <FilterGroup title="Category">
        {shipmentCategories.map((c) => (
          <Label key={c.value} className="font-normal">
            <Checkbox
              checked={filters.categories.includes(c.value)}
              onCheckedChange={(checked) =>
                set(
                  "categories",
                  checked
                    ? [...filters.categories, c.value]
                    : filters.categories.filter((x) => x !== c.value),
                )
              }
            />
            {c.label}
          </Label>
        ))}
      </FilterGroup>

      <FilterGroup title="Pickup date">
        <OptionChips
          label="Pickup date"
          value={filters.pickup === "date" ? "" : filters.pickup}
          options={pickupOptions}
          onChange={(v) =>
            setFilters({ ...filters, pickup: v, pickupDate: undefined })
          }
        />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant={filters.pickup === "date" ? "secondary" : "outline"}
                size="sm"
                className="w-fit"
              />
            }
          >
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
            {filters.pickup === "date" && filters.pickupDate
              ? formatShortDay(filters.pickupDate)
              : "Pick a date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.pickupDate}
              onSelect={(date) =>
                setFilters({
                  ...filters,
                  pickup: date ? "date" : "",
                  pickupDate: date,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </FilterGroup>

      <FilterGroup title="Distance">
        <Slider
          aria-label="Distance"
          min={0}
          max={MAX_DISTANCE}
          step={50}
          value={filters.distance}
          onValueChange={(v) => set("distance", v as [number, number])}
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatMiles(filters.distance[0])} –{" "}
          {filters.distance[1] >= MAX_DISTANCE
            ? "3,000+ mi"
            : formatMiles(filters.distance[1])}
        </p>
      </FilterGroup>

      <FilterGroup title="Budget">
        <Slider
          aria-label="Budget"
          min={0}
          max={MAX_BUDGET}
          step={50}
          value={filters.budget}
          onValueChange={(v) => set("budget", v as [number, number])}
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatUsd(filters.budget[0])} –{" "}
          {filters.budget[1] >= MAX_BUDGET
            ? "$5,000+"
            : formatUsd(filters.budget[1])}
        </p>
      </FilterGroup>

      <FilterGroup title="Offers so far">
        <OptionChips
          label="Offers so far"
          value={filters.offers}
          options={offerOptions}
          onChange={(v) => set("offers", v || "any")}
        />
      </FilterGroup>

      <FilterGroup title="Closing">
        <OptionChips
          label="Closing"
          value={filters.closing}
          options={closingOptions}
          onChange={(v) => set("closing", v)}
        />
      </FilterGroup>

      <FilterGroup title="Shipper">
        <Label className="justify-between font-normal">
          Verified shippers only
          <Switch
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => set("verifiedOnly", checked)}
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
      <InputGroup className="h-10 bg-background">
        <InputGroupAddon>
          <HugeiconsIcon icon={Location01Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="From"
          placeholder="From: City or zip"
          value={draft.from}
          onChange={(e) => setDraft({ ...draft, from: e.target.value })}
        />
      </InputGroup>
      <InputGroup className="h-10 bg-background">
        <InputGroupAddon>
          <HugeiconsIcon icon={Location01Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="To"
          placeholder="To: City or zip"
          value={draft.to}
          onChange={(e) => setDraft({ ...draft, to: e.target.value })}
        />
      </InputGroup>
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
          {draft.date ? formatShortDay(draft.date) : "Any date"}
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

function ShipmentRow({
  shipment: s,
  saved,
  onToggleSave,
}: {
  shipment: Shipment;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <Ticket href={`/shipments/${s.id}`} label={`View shipment: ${s.item}`}>
      <div className="grid items-center gap-x-6 gap-y-3 p-4 sm:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Tag>{categoryBadge(s.category)}</Tag>
            <h3 className="truncate text-base font-semibold">{s.item}</h3>
          </div>
          <RouteLabel
            from={s.from.label}
            to={s.to.label}
            truncate
            className="text-muted-foreground"
          />
        </div>
        <div className="text-muted-foreground max-lg:hidden">
          <p>{formatMiles(s.miles)}</p>
          <p>Pickup {formatPickup(s)}</p>
        </div>
        <div className="text-muted-foreground max-lg:hidden">
          <p>{s.offers === 0 ? "No offers" : `${s.offers} offers`}</p>
          <p>{s.lowestOffer ? `Lowest ${formatUsd(s.lowestOffer)}` : "—"}</p>
        </div>
        <div className="flex items-center gap-4 sm:justify-end">
          <div className="text-right">
            <p className="font-heading text-lg font-semibold tabular-nums">
              {formatUsd(s.budget)}
            </p>
            <p className="text-xs text-muted-foreground">
              Closes in <Countdown ms={s.closesInMs} />
            </p>
          </div>
        </div>
        <div className="max-sm:absolute max-sm:top-3 max-sm:right-3">
          <SaveButton saved={saved} onToggle={onToggleSave} item={s.item} />
        </div>
      </div>
    </Ticket>
  );
}

/** Search, filters, and results for the shipments marketplace. */
export function ShipmentBrowserClient({
  shipments,
}: {
  shipments: Shipment[];
}) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [search, setSearch] = useState<Search>({ from: "", to: "" });
  const [sort, setSort] = useState<Sort>("closing");
  const [view, setView] = useState<View>("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [showNotice, setShowNotice] = useState(true);
  // Only nudge people who aren't signed in.
  const signedOut = useSessionRole() === null;

  const results = useMemo(
    () =>
      shipments.filter((s) => matches(s, filters, search)).sort(sorters[sort]),
    [shipments, filters, search, sort],
  );

  const chips = activeChips(filters, search, setFilters, setSearch);
  const clearAll = () => {
    setFilters(defaultFilters);
    setSearch({ from: "", to: "" });
  };
  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const shown = view === "map" ? results : results.slice(0, visible);
  const count = `${formatNumber(results.length)} ${results.length === 1 ? "shipment" : "shipments"}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-6 pb-16 md:pb-24">
      {showNotice && signedOut && (
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 py-2 pr-2 pl-4 text-sm">
          <p className="flex-1 text-pretty">
            Want to send offers?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Log in
            </Link>{" "}
            or{" "}
            <Link
              href="/signup"
              className="font-medium underline underline-offset-4"
            >
              create a free account
            </Link>{" "}
            and add your vehicle.
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dismiss"
            onClick={() => setShowNotice(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>
      )}

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Marketplace
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Shipments looking for drivers
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Find jobs on your route, send your best offer, and get booked.
          </p>
        </div>
        <Link
          href="/shipments/new"
          className={cn(buttonVariants({ size: "lg" }), "w-fit")}
        >
          Post a shipment
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
              {chips.length > 0 && <ClearAllButton onClick={clearAll} />}
            </div>
            <FiltersPanel filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium">{count}</p>

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
                  {chips.length > 0 && <ClearAllButton onClick={clearAll} />}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <FiltersPanel filters={filters} setFilters={setFilters} />
                </div>
                <SheetFooter className="border-t">
                  <SheetClose render={<Button size="lg" />}>
                    Show {count}
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
            <Empty className="rounded-2xl bg-muted/50 py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={PackageSearchIcon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>No shipments match your search</EmptyTitle>
                <EmptyDescription>
                  Try a wider date range, a bigger distance, or fewer filters.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="lg" onClick={clearAll}>
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : view === "map" ? (
            <ShipmentsMap shipments={shown} />
          ) : view === "list" ? (
            <ul className="flex flex-col gap-3">
              {shown.map((s) => (
                <li key={s.id}>
                  <ShipmentRow
                    shipment={s}
                    saved={saved.has(s.id)}
                    onToggleSave={() => toggleSave(s.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((s) => (
                <li key={s.id}>
                  <ShipmentTicket
                    shipment={s}
                    saved={saved.has(s.id)}
                    onToggleSave={() => toggleSave(s.id)}
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
              Load more shipments
            </Button>
          )}
        </div>
      </div>

      <CtaBand>
        <p className="text-pretty">
          <span className="font-medium">Need something moved?</span>{" "}
          <span className="text-muted-foreground">
            Post a shipment and let drivers come to you.
          </span>
        </p>
      </CtaBand>
    </div>
  );
}
