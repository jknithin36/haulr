"use client";

import {
  InformationCircleIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Button } from "@/components/ui/button";
import { Panel, StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "@/components/ui/toast";
import { EmptyRows } from "@/features/admin/components/marketplace/table-kit";
import { tablePanelPadding } from "@/features/admin/components/table-styles";
import { UserCell } from "@/features/admin/components/users/user-cell";
import {
  type AdminVehicle,
  adminVehicles,
  inVehicleTab,
  type VehicleTab,
  vehicleStatusTone,
  vehicleTabs,
  vehicleTotals,
} from "@/lib/demo-data/admin/vehicles";

type Handlers = {
  onApprove: (v: AdminVehicle) => void;
  onReject: (v: AdminVehicle) => void;
  onRemind: (v: AdminVehicle) => void;
  onDisable: (v: AdminVehicle) => void;
};

function ownerHref(v: AdminVehicle) {
  return v.ownerId ? `/admin/users/${v.ownerId}` : undefined;
}

export function VehiclesView() {
  const [vehicles, setVehicles] = useState(adminVehicles);
  const [tab, setTab] = useState<VehicleTab>("all");
  const [disabling, setDisabling] = useState<AdminVehicle | null>(null);

  const shown = vehicles.filter((v) => inVehicleTab(v, tab));

  function update(id: string, patch: Partial<AdminVehicle>) {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  }

  const handlers: Handlers = {
    onApprove: (v) => {
      update(v.id, { status: "Verified" });
      toast.add({
        type: "success",
        title: `${v.status === "Disabled" ? "Enabled" : "Approved"} ${v.name}`,
        description: `${v.owner} can use it for offers and trips now.`,
      });
    },
    onReject: (v) => {
      update(v.id, { status: "Rejected" });
      toast.add({
        type: "success",
        title: `Rejected ${v.name}`,
        description: `We let ${v.owner} know what to fix.`,
      });
    },
    onRemind: (v) => {
      update(v.id, { reminderSent: true });
      toast.add({
        type: "success",
        title: `Reminder sent to ${v.owner}`,
        description: `Insurance on the ${v.name} ${v.insurance.split(" · ")[1] ?? "is expiring"}.`,
      });
    },
    onDisable: setDisabling,
  };

  return (
    <Toaster>
      <PageHeader
        title="Vehicles"
        description={`${vehicleTotals.total} vehicles · ${vehicleTotals.verified} verified`}
      />

      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4 text-sm md:px-5">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <p className="text-pretty">
            <span className="font-medium">Auto rule:</span> vehicles with
            expired insurance can’t be used for new offers or trips.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
          <Tabs value={tab} onValueChange={(v) => setTab(v as VehicleTab)}>
            <TabsList className="group-data-horizontal/tabs:h-9">
              {vehicleTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="px-3">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {shown.length === 0 ? (
          <EmptyRows>No vehicles in this view right now.</EmptyRows>
        ) : (
          <>
            <Panel className={tablePanelPadding}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {[
                      "Vehicle",
                      "Owner",
                      "Type",
                      "Capacity",
                      "Insurance",
                      "Status",
                    ].map((c) => (
                      <TableHead
                        key={c}
                        className="font-normal text-muted-foreground"
                      >
                        {c}
                      </TableHead>
                    ))}
                    <TableHead className="w-10">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((v) => (
                    <TableRow key={v.id} className="hover:bg-transparent">
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{v.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {v.plate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <UserCell name={v.owner} href={ownerHref(v)} />
                      </TableCell>
                      <TableCell className="py-3">{v.type}</TableCell>
                      <TableCell className="py-3 tabular-nums">
                        {v.capacity}
                      </TableCell>
                      <TableCell className="py-3">
                        <Insurance vehicle={v} />
                      </TableCell>
                      <TableCell className="py-3">
                        <StatusBadge tone={vehicleStatusTone[v.status]}>
                          {v.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <VehicleActions vehicle={v} {...handlers} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>

            <div className="flex flex-col gap-3 md:hidden">
              {shown.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="font-medium">{v.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {v.type} · {v.capacity}
                      </p>
                    </div>
                    <div className="-my-1 -mr-1">
                      <VehicleActions vehicle={v} {...handlers} />
                    </div>
                  </div>
                  <UserCell name={v.owner} href={ownerHref(v)} sub={v.plate} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Insurance vehicle={v} />
                    <StatusBadge tone={vehicleStatusTone[v.status]}>
                      {v.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog
        open={!!disabling}
        onOpenChange={(open) => !open && setDisabling(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable {disabling?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {disabling?.owner} won’t be able to use it for new offers or
              trips. Jobs already booked with it stay as they are.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (disabling) {
                  update(disabling.id, { status: "Disabled" });
                  toast.add({
                    type: "success",
                    title: `Disabled ${disabling.name}`,
                  });
                }
                setDisabling(null);
              }}
            >
              Disable vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Toaster>
  );
}

function Insurance({ vehicle: v }: { vehicle: AdminVehicle }) {
  return (
    <div className="flex flex-col">
      <span
        className={
          v.insurance === "Under review"
            ? "text-muted-foreground"
            : "tabular-nums"
        }
      >
        {v.insurance}
      </span>
      {v.reminderSent && (
        <span className="text-xs text-muted-foreground">Reminder sent</span>
      )}
    </div>
  );
}

function VehicleActions({
  vehicle: v,
  onApprove,
  onReject,
  onRemind,
  onDisable,
}: { vehicle: AdminVehicle } & Handlers) {
  const pending = v.status === "Pending";
  const canRemind =
    v.status === "Expiring soon" || v.status === "Verified" || pending;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${v.name}`}
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {(pending || v.status === "Rejected") && (
          <DropdownMenuItem onClick={() => onApprove(v)}>
            Approve
          </DropdownMenuItem>
        )}
        {pending && (
          <DropdownMenuItem onClick={() => onReject(v)}>
            Reject
          </DropdownMenuItem>
        )}
        {canRemind && v.insurance !== "Under review" && (
          <DropdownMenuItem onClick={() => onRemind(v)}>
            {v.reminderSent ? "Send reminder again" : "Send expiry reminder"}
          </DropdownMenuItem>
        )}
        {v.status === "Disabled" ? (
          <DropdownMenuItem onClick={() => onApprove(v)}>
            Enable vehicle
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDisable(v)}
            >
              Disable vehicle
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
