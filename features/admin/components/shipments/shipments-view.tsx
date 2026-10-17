"use client";

import {
  Download04Icon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadFile, toCsv } from "@/features/admin/admin-download";
import { ConfirmDialog } from "@/features/admin/components/marketplace/detail-kit";
import {
  EmptyRows,
  MobileCard,
  RowMenu,
  StatusTabs,
  TableFooterBar,
  TablePanel,
  Th,
} from "@/features/admin/components/marketplace/table-kit";
import {
  countActive,
  defaultFilters,
  FiltersSheet,
  matchesFilters,
  type ShipmentFilters,
} from "@/features/admin/components/shipments/filters-sheet";
import {
  type AdminShipment,
  adminShipments,
  priceLabel,
  type ShipmentTab,
  shipmentTabs,
  shipmentTone,
} from "@/lib/demo-data/admin/shipments";

function inTab(s: AdminShipment, tab: ShipmentTab) {
  return tab === "all" || s.status === tab;
}

function shipmentsCsv(rows: AdminShipment[]) {
  const head = [
    "ID",
    "Item",
    "Shipper",
    "From",
    "To",
    "Status",
    "Offers",
    "Price",
    "Posted",
  ];
  return toCsv([
    head,
    ...rows.map((s) => [
      s.id,
      s.item.replace(/[“”]/g, ""),
      s.shipper,
      s.from,
      s.to,
      s.status,
      s.offers,
      priceLabel(s),
      s.posted,
    ]),
  ]);
}

export function ShipmentsView() {
  const router = useRouter();
  const [rows, setRows] = useState(adminShipments);
  const [tab, setTab] = useState<ShipmentTab>("all");
  const [filters, setFilters] = useState<ShipmentFilters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [removing, setRemoving] = useState<AdminShipment | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const active = countActive(filters);
  const shown = rows.filter((s) => inTab(s, tab) && matchesFilters(s, filters));
  const total = shipmentTabs.find((t) => t.value === tab)?.count ?? 0;

  const open = (s: AdminShipment) => router.push(`/admin/shipments/${s.id}`);

  function exportCsv() {
    downloadFile(
      shipmentsCsv(shown),
      "haulr-shipments.csv",
      "text/csv;charset=utf-8",
    );
  }

  const menu = (s: AdminShipment) => (
    <RowMenu label={`Actions for ${s.id}`}>
      <DropdownMenuItem render={<Link href={`/admin/shipments/${s.id}`} />}>
        View details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(s.id)}>
        Copy ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        onClick={() => {
          setRemoving(s);
          setConfirmOpen(true);
        }}
      >
        Remove listing
      </DropdownMenuItem>
    </RowMenu>
  );

  return (
    <>
      <PageHeader
        title="Shipments"
        description="Every shipment posted on Haulr."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <HugeiconsIcon
                icon={Download04Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => setFiltersOpen(true)}>
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Filters
              {active > 0 && (
                <span className="ml-0.5 grid size-5 place-items-center rounded-full bg-foreground text-[11px] text-background tabular-nums">
                  {active}
                </span>
              )}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        <StatusTabs tabs={shipmentTabs} value={tab} onChange={setTab} />

        {active > 0 && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {active} {active === 1 ? "filter" : "filters"} applied
            </span>
            <Button
              variant="link"
              size="sm"
              className="h-auto px-0 text-foreground"
              onClick={() => setFilters(defaultFilters)}
            >
              Clear
            </Button>
          </div>
        )}

        {shown.length === 0 ? (
          <EmptyRows>
            No shipments here match{active > 0 ? " these filters" : " yet"}.
          </EmptyRows>
        ) : (
          <>
            <TablePanel>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <Th>ID</Th>
                    <Th>Item</Th>
                    <Th>Shipper</Th>
                    <Th>Route</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Offers</Th>
                    <Th className="text-right">Price</Th>
                    <Th>Posted</Th>
                    <Th className="w-10">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((s) => (
                    <TableRow
                      key={s.id}
                      onClick={() => open(s)}
                      className="cursor-pointer hover:bg-background/60"
                    >
                      <TableCell className="py-3 text-muted-foreground tabular-nums">
                        <Link
                          href={`/admin/shipments/${s.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-foreground hover:underline"
                        >
                          {s.id}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-48 truncate py-3 font-medium">
                        {s.item}
                      </TableCell>
                      <TableCell className="py-3">{s.shipper}</TableCell>
                      <TableCell className="py-3 text-muted-foreground">
                        <RouteLabel
                          from={s.from}
                          to={s.to}
                          truncate
                          arrowClassName="opacity-60"
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <StatusBadge tone={shipmentTone[s.status]}>
                          {s.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="py-3 text-right tabular-nums">
                        {s.offers ?? "—"}
                      </TableCell>
                      <TableCell className="py-3 text-right tabular-nums">
                        {s.priceKind === "budget" ? (
                          <span className="text-muted-foreground">
                            {priceLabel(s)}
                          </span>
                        ) : (
                          priceLabel(s)
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-muted-foreground tabular-nums">
                        {s.posted}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {menu(s)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TablePanel>

            <div className="flex flex-col gap-3 md:hidden">
              {shown.map((s) => (
                <MobileCard key={s.id} onOpen={() => open(s)} menu={menu(s)}>
                  <div className="flex items-center gap-2 pr-8">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {s.id} · {s.posted}
                    </span>
                    <StatusBadge tone={shipmentTone[s.status]}>
                      {s.status}
                    </StatusBadge>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="font-medium">{s.item}</p>
                    <RouteLabel
                      truncate
                      arrowClassName="opacity-60"
                      from={s.from}
                      to={s.to}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                  <dl className="grid grid-cols-3 gap-3 text-sm">
                    <MiniFact label="Shipper" value={s.shipper} />
                    <MiniFact label="Price" value={priceLabel(s)} />
                    <MiniFact label="Offers" value={String(s.offers ?? "—")} />
                  </dl>
                </MobileCard>
              ))}
            </div>
          </>
        )}

        <TableFooterBar key={tab} shown={shown.length} total={total} />
      </div>

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onApply={setFilters}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove ${removing?.id ?? "listing"}?`}
        description={
          removing &&
          `“${removing.item.replace(/[“”]/g, "")}” will be taken off Haulr and ${removing.shipper} will be told why. Any open offers are closed.`
        }
        confirmLabel="Remove listing"
        onConfirm={() =>
          removing && setRows((r) => r.filter((x) => x.id !== removing.id))
        }
      />
    </>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate tabular-nums">{value}</dd>
    </div>
  );
}
