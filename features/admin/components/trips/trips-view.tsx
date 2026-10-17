"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { PageHeader } from "@/components/ui/page-header";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ConfirmDialog,
  MessageDialog,
} from "@/features/admin/components/marketplace/detail-kit";
import { SpaceMeter } from "@/features/admin/components/marketplace/space-meter";
import {
  EmptyRows,
  MobileCard,
  RowMenu,
  StatusTabs,
  TableFooterBar,
  TablePanel,
  Th,
} from "@/features/admin/components/marketplace/table-kit";
import { TripSheet } from "@/features/admin/components/trips/trip-sheet";
import {
  type AdminTrip,
  adminTrips,
  spaceLabel,
  type TripStatus,
  tripTabs,
  tripTone,
} from "@/lib/demo-data/admin/trips";
import { firstName, formatUsd } from "@/lib/format";

export type TripState = AdminTrip & { paused?: boolean; refunded?: boolean };

export function TripsView() {
  const [trips, setTrips] = useState<TripState[]>(adminTrips);
  const [tab, setTab] = useState<TripStatus>("Upcoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [target, setTarget] = useState<TripState | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const shown = trips.filter((t) => t.status === tab);
  const total = tripTabs.find((t) => t.value === tab)?.count ?? 0;
  const openTrip = trips.find((t) => t.id === openId) ?? null;

  const update = (id: string, patch: Partial<TripState>) =>
    setTrips((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const actions = {
    togglePause: (t: TripState) =>
      update(t.id, {
        paused: !t.paused,
        activity: [
          ...t.activity,
          {
            label: t.paused ? "Bookings resumed" : "Bookings paused",
            time: "Just now",
            by: "Nithin Kumar",
          },
        ],
      }),
    cancel: (t: TripState) => {
      setTarget(t);
      setCancelOpen(true);
    },
    contact: (t: TripState) => {
      setTarget(t);
      setMessageOpen(true);
    },
  };

  const menu = (t: TripState) => (
    <RowMenu label={`Actions for ${t.id}`}>
      <DropdownMenuItem onClick={() => setOpenId(t.id)}>
        View details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => actions.contact(t)}>
        Contact driver
      </DropdownMenuItem>
      {(t.status === "Upcoming" || t.status === "In progress") && (
        <>
          <DropdownMenuItem onClick={() => actions.togglePause(t)}>
            {t.paused ? "Resume bookings" : "Pause bookings"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => actions.cancel(t)}
          >
            Cancel trip
          </DropdownMenuItem>
        </>
      )}
    </RowMenu>
  );

  return (
    <>
      <PageHeader
        title="Trips"
        description="Space shared by drivers on their routes."
      />

      <div className="flex flex-col gap-4">
        <StatusTabs tabs={tripTabs} value={tab} onChange={setTab} />

        {shown.length === 0 ? (
          <EmptyRows>No {tab.toLowerCase()} trips to show.</EmptyRows>
        ) : (
          <>
            <TablePanel>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <Th>ID</Th>
                    <Th>Driver</Th>
                    <Th>Vehicle</Th>
                    <Th>Route</Th>
                    <Th>Departs</Th>
                    <Th>Space used</Th>
                    <Th className="text-right">Booked value</Th>
                    <Th>Status</Th>
                    <Th className="w-10">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((t) => (
                    <TableRow
                      key={t.id}
                      onClick={() => setOpenId(t.id)}
                      className="cursor-pointer hover:bg-background/60"
                    >
                      <TableCell className="py-3 text-muted-foreground tabular-nums">
                        {t.id}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="flex items-center gap-2.5">
                          <GradientAvatar seed={t.driver} className="size-6" />
                          <span className="font-medium">{t.driver}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3">{t.vehicle}</TableCell>
                      <TableCell className="py-3 text-muted-foreground">
                        <RouteLabel
                          from={t.from}
                          to={t.to}
                          truncate
                          arrowClassName="opacity-60"
                        />
                      </TableCell>
                      <TableCell className="py-3 tabular-nums">
                        {t.departs}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="flex items-center gap-3">
                          <SpaceMeter used={t.used} capacity={t.capacity} />
                          <span className="text-muted-foreground tabular-nums">
                            {spaceLabel(t)}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right font-medium tabular-nums">
                        {formatUsd(t.bookedValue)}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="flex items-center gap-1.5">
                          <StatusBadge tone={tripTone[t.status]}>
                            {t.status}
                          </StatusBadge>
                          {t.paused && (
                            <StatusBadge tone="warning">Paused</StatusBadge>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {menu(t)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TablePanel>

            <div className="flex flex-col gap-3 md:hidden">
              {shown.map((t) => (
                <MobileCard
                  key={t.id}
                  onOpen={() => setOpenId(t.id)}
                  menu={menu(t)}
                >
                  <div className="flex items-center gap-2 pr-8">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {t.id}
                    </span>
                    <StatusBadge tone={tripTone[t.status]}>
                      {t.status}
                    </StatusBadge>
                    {t.paused && (
                      <StatusBadge tone="warning">Paused</StatusBadge>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <RouteLabel
                      truncate
                      arrowClassName="opacity-60"
                      from={t.from}
                      to={t.to}
                      className="font-medium"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t.driver} · {t.vehicle} · departs {t.departs}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2.5">
                      <SpaceMeter used={t.used} capacity={t.capacity} />
                      <span className="text-muted-foreground tabular-nums">
                        {spaceLabel(t)}
                      </span>
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatUsd(t.bookedValue)}
                    </span>
                  </div>
                </MobileCard>
              ))}
            </div>
          </>
        )}

        <TableFooterBar key={tab} shown={shown.length} total={total} />
      </div>

      <TripSheet
        trip={openTrip}
        onOpenChange={(o) => !o && setOpenId(null)}
        onTogglePause={actions.togglePause}
        onCancel={actions.cancel}
        onContact={actions.contact}
      />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={`Cancel ${target?.id ?? "trip"} and refund everyone?`}
        description={
          target &&
          `${target.bookings.length} ${target.bookings.length === 1 ? "shipper gets" : "shippers get"} a full refund, ${formatUsd(target.bookedValue)} in total. ${target.driver} is told the trip is off.`
        }
        confirmLabel="Cancel trip and refund all"
        cancelLabel="Keep trip"
        onConfirm={() => {
          if (!target) return;
          update(target.id, {
            status: "Cancelled",
            paused: false,
            refunded: true,
            activity: [
              ...target.activity,
              {
                label: `Cancelled, ${formatUsd(target.bookedValue)} refunded`,
                time: "Just now",
                by: "Nithin Kumar",
              },
            ],
          });
        }}
      />

      <MessageDialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        to={target && { name: target.driver, role: "Driver" }}
        placeholder={`Hi ${target ? firstName(target.driver) : ""}, `}
      />
    </>
  );
}
