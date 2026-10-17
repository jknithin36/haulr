"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableHead } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabScroller } from "@/features/admin/components/table-styles";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Soft panel that holds a desktop table. Hidden below md, where cards take over. */
export function TablePanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-muted/50 px-3 pt-1 pb-2 max-md:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Quiet column header. */
export function Th({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      className={cn("font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

/** "…" menu at the end of a row. Clicks inside never reach the row. */
export function RowMenu({
  label,
  children,
  className,
  menuClassName,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
}) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: only stops the row click.
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users open the menu directly.
    <div className={cn("inline-flex", className)} onClick={stop}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={label} />}
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cn("w-48", menuClassName)}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function stop(e: React.MouseEvent) {
  e.stopPropagation();
}

/** Tabs that scroll sideways on small screens. */
export function StatusTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly { value: T; label: string; count?: number | string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={tabScroller}>
      <Tabs value={value} onValueChange={(v) => onChange(v as T)}>
        <TabsList className="group-data-horizontal/tabs:h-9">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="px-3">
              {t.label}
              {t.count !== undefined && (
                <span className="font-normal text-muted-foreground tabular-nums">
                  {typeof t.count === "number"
                    ? formatNumber(t.count)
                    : t.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

/** "Showing 8 of 24,318" with previous / next. Only the first page is loaded here. */
export function TableFooterBar({
  shown,
  total,
  pageSize = 25,
}: {
  shown: number;
  total: number;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between gap-4 pt-4 text-sm text-muted-foreground">
      <p className="tabular-nums">
        Showing {formatNumber(shown)} of {formatNumber(total)}
      </p>
      <div className="flex items-center gap-1">
        <span className="mr-2 tabular-nums max-sm:hidden">
          Page {formatNumber(page)} of {formatNumber(pages)}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={page === pages}
          onClick={() => setPage((p) => p + 1)}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

/** Shown when a tab has no sample rows. */
export function EmptyRows({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl bg-muted/50 px-5 py-12 text-center text-muted-foreground">
      {children}
    </p>
  );
}

/** Stacked card used instead of the table below md. */
export function MobileCard({
  onOpen,
  children,
  menu,
}: {
  onOpen: () => void;
  children: React.ReactNode;
  menu?: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl bg-muted/50 p-4 transition-colors has-[>button:hover]:bg-muted/70">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Open details"
      />
      <div className="pointer-events-none relative flex flex-col gap-3">
        {children}
      </div>
      {menu && <div className="absolute top-2.5 right-2.5">{menu}</div>}
    </div>
  );
}
