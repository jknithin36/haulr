"use client";

import {
  Cancel01Icon,
  Copy01Icon,
  Delete02Icon,
  Location01Icon,
  MoreHorizontalIcon,
  PackageIcon,
  PencilEdit02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import { ShipmentPanel } from "@/features/dashboard/components/shipments/shipment-panel";
import {
  emptyCopy,
  inTab,
  type MyShipment,
  type ShipmentOffer,
  type ShipmentTab,
  shipmentTabs,
  statusLabel,
  statusTone,
} from "@/lib/demo-data/dashboard/shipments";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

type RowActions = {
  onView: (s: MyShipment) => void;
  onDuplicate: (s: MyShipment) => void;
  onCancel: (s: MyShipment) => void;
};

function StatusCell({ shipment }: { shipment: MyShipment }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <StatusBadge tone={statusTone[shipment.status]}>
        {statusLabel[shipment.status]}
      </StatusBadge>
      {shipment.statusNote && (
        <span className="text-xs text-muted-foreground">
          {shipment.statusNote}
        </span>
      )}
    </div>
  );
}

function RowMenu({
  shipment,
  actions,
}: {
  shipment: MyShipment;
  actions: RowActions;
}) {
  const { status } = shipment;
  const editable = status === "draft" || status === "open";
  const cancellable = editable || status === "booked";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${shipment.id}`}
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => actions.onView(shipment)}>
          <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
          View
        </DropdownMenuItem>
        {editable && (
          <DropdownMenuItem render={<Link href="/shipments/new" />}>
            <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
            Edit
          </DropdownMenuItem>
        )}
        {status === "in-transit" && (
          <DropdownMenuItem render={<Link href="/dashboard/tracking" />}>
            <HugeiconsIcon icon={Location01Icon} strokeWidth={2} />
            Track
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => actions.onDuplicate(shipment)}>
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          Duplicate
        </DropdownMenuItem>
        {cancellable && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => actions.onCancel(shipment)}
            >
              <HugeiconsIcon
                icon={status === "draft" ? Delete02Icon : Cancel01Icon}
                strokeWidth={2}
              />
              {status === "draft" ? "Delete draft" : "Cancel"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShipmentsTable({
  rows,
  actions,
}: {
  rows: MyShipment[];
  actions: RowActions;
}) {
  return (
    <div className="rounded-2xl bg-muted/50 px-3 py-1 max-md:hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            {["ID", "Item", "Route", "Status", "Price", "Date"].map((h) => (
              <TableHead
                key={h}
                className="h-11 px-3 text-xs font-normal text-muted-foreground"
              >
                {h}
              </TableHead>
            ))}
            <TableHead className="w-10 px-3">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s) => (
            <TableRow
              key={s.id}
              onClick={() => actions.onView(s)}
              className="cursor-pointer border-border/60 hover:bg-background/60"
            >
              <TableCell className="px-3 py-4 text-muted-foreground tabular-nums">
                {s.id}
              </TableCell>
              <TableCell className="px-3 py-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onView(s);
                  }}
                  className="max-w-44 text-left font-medium whitespace-normal outline-none hover:underline focus-visible:underline"
                >
                  {s.item}
                </button>
              </TableCell>
              <TableCell className="px-3 py-4 whitespace-normal text-muted-foreground">
                <RouteLabel from={s.from} to={s.to} />
              </TableCell>
              <TableCell className="px-3 py-4">
                <StatusCell shipment={s} />
              </TableCell>
              <TableCell className="px-3 py-4 tabular-nums">
                {s.price}
              </TableCell>
              <TableCell className="px-3 py-4 text-muted-foreground">
                {s.date}
              </TableCell>
              {/* Menu clicks bubble through the portal; keep them off the row. */}
              <TableCell
                className="px-3 py-4 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <RowMenu shipment={s} actions={actions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ShipmentCards({
  rows,
  actions,
}: {
  rows: MyShipment[];
  actions: RowActions;
}) {
  return (
    <ul className="flex flex-col gap-2 md:hidden">
      {rows.map((s) => (
        <li key={s.id} className="relative rounded-2xl bg-muted/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => actions.onView(s)}
              className="flex min-w-0 flex-1 flex-col gap-1 text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              <span className="text-xs text-muted-foreground tabular-nums">
                {s.id}
              </span>
              <span className="font-medium">{s.item}</span>
              <RouteLabel
                from={s.from}
                to={s.to}
                className="text-sm text-muted-foreground"
              />
            </button>
            <div className="relative z-10 -mt-1 -mr-1">
              <RowMenu shipment={s} actions={actions} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <StatusCell shipment={s} />
            <div className="text-right text-sm">
              {s.price !== "—" && (
                <p className="font-medium tabular-nums">{s.price}</p>
              )}
              <p className="text-muted-foreground">{s.date}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ShipmentsViewClient({
  initialShipments,
}: {
  initialShipments: MyShipment[];
}) {
  const [shipments, setShipments] = useState(initialShipments);
  const [tab, setTab] = useState<ShipmentTab>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [cancelling, setCancelling] = useState<MyShipment | null>(null);

  const opened = shipments.find((s) => s.id === openId) ?? null;

  const actions: RowActions = {
    onView: (s) => {
      setOpenId(s.id);
      setPanelOpen(true);
    },
    onDuplicate: (s) => {
      const next = Math.max(...shipments.map((x) => Number(x.id.slice(4)))) + 1;
      const copy: MyShipment = {
        id: `SHP-${next}`,
        item: s.item,
        from: s.from,
        to: s.to,
        status: "draft",
        price: "—",
        date: "Not posted",
      };
      setShipments((list) => [copy, ...list]);
    },
    onCancel: setCancelling,
  };

  const accept = (id: string, offer: ShipmentOffer) =>
    setShipments((list) =>
      list.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "booked",
              statusNote: `with ${offer.driver}`,
              price: formatUsd(offer.price),
              acceptedOfferId: offer.id,
              driver: {
                name: offer.driver,
                rating: offer.rating,
                vehicle: offer.vehicle,
              },
            }
          : s,
      ),
    );

  const confirmCancel = () => {
    if (!cancelling) return;
    const target = cancelling;
    setShipments((list) =>
      target.status === "draft"
        ? list.filter((s) => s.id !== target.id)
        : list.map((s) =>
            s.id === target.id
              ? {
                  ...s,
                  status: "cancelled",
                  statusNote: undefined,
                  price: "—",
                  date: "Just now",
                }
              : s,
          ),
    );
    setCancelling(null);
  };

  const isDraft = cancelling?.status === "draft";

  return (
    <>
      <Tabs value={tab} onValueChange={(v) => setTab(v as ShipmentTab)}>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
          <DashboardTabsList>
            {shipmentTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3">
                {t.label} ({shipments.filter((s) => inTab(s, t.value)).length})
              </TabsTrigger>
            ))}
          </DashboardTabsList>
        </div>
        {shipmentTabs.map((t) => {
          const rows = shipments.filter((s) => inTab(s, t.value));
          const copy = emptyCopy[t.value];
          return (
            <TabsContent key={t.value} value={t.value} className="pt-3">
              {rows.length === 0 ? (
                <EmptyState
                  icon={PackageIcon}
                  title={copy.title}
                  description={copy.description}
                  action={
                    <Link
                      href="/shipments/new"
                      className={cn(buttonVariants())}
                    >
                      {copy.action}
                    </Link>
                  }
                />
              ) : (
                <>
                  <ShipmentsTable rows={rows} actions={actions} />
                  <ShipmentCards rows={rows} actions={actions} />
                </>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <ShipmentPanel
        shipment={opened}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        onAccept={accept}
      />

      <AlertDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDraft ? "Delete this draft?" : "Cancel this shipment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDraft
                ? `${cancelling?.item} will be removed. This can’t be undone.`
                : `Drivers who sent offers for ${cancelling?.item} will be told it’s no longer available.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isDraft ? "Keep draft" : "Keep shipment"}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmCancel}>
              {isDraft ? "Delete draft" : "Cancel shipment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
