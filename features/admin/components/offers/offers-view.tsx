"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { StatCard, StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ConfirmDialog,
  FlagChips,
} from "@/features/admin/components/marketplace/detail-kit";
import {
  EmptyRows,
  MobileCard,
  RowMenu,
  StatusTabs,
  TablePanel,
  Th,
} from "@/features/admin/components/marketplace/table-kit";
import { OfferSheet } from "@/features/admin/components/offers/offer-sheet";
import {
  type AdminOffer,
  adminOffers,
  type OfferTab,
  offerStats,
  offerTabs,
  offerTone,
} from "@/lib/demo-data/admin/offers";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export type OfferAction = "remove" | "warn" | "suspend";

export type Moderation = {
  warned: Set<string>;
  suspended: Set<string>;
};

const confirmCopy: Record<
  OfferAction,
  {
    title: (o: AdminOffer) => string;
    body: (o: AdminOffer, count: number) => string;
    label: string;
  }
> = {
  remove: {
    title: (o) => `Remove offer ${o.id}?`,
    body: (o) =>
      `The ${formatUsd(o.amount)} offer on ${o.shipmentId} is taken down and the shipper won’t see it. ${o.driver} is told why.`,
    label: "Remove offer",
  },
  warn: {
    title: (o) => `Warn ${o.driver}?`,
    body: () =>
      "They get a warning by email and in the app. A second warning blocks them from sending offers for 7 days.",
    label: "Send warning",
  },
  suspend: {
    title: (o) => `Suspend ${o.driver}?`,
    body: (_o, count) =>
      `They can’t sign in or send offers until an admin lifts it. ${count === 1 ? "Their open offer is" : `All ${count} of their open offers are`} removed.`,
    label: "Suspend user",
  },
};

function footer(tab: OfferTab, n: number) {
  if (tab === "All") return `Showing ${n} of 14,382 offers this month`;
  if (tab === "Flagged") return `Showing ${n} of 38 flagged offers`;
  return `Showing ${n} ${tab.toLowerCase()} ${n === 1 ? "offer" : "offers"}`;
}

export function OffersView() {
  const [offers, setOffers] = useState(adminOffers);
  const [tab, setTab] = useState<OfferTab>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [mod, setMod] = useState<Moderation>({
    warned: new Set(),
    suspended: new Set(),
  });
  const [pending, setPending] = useState<{
    action: OfferAction;
    offer: AdminOffer;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const shown = offers.filter((o) => tab === "All" || o.status === tab);
  const openOffer = offers.find((o) => o.id === openId) ?? null;

  const isOpen = (o: AdminOffer) =>
    o.status === "Active" || o.status === "Flagged";
  const openCount = (userId: string) =>
    offers.filter((o) => o.userId === userId && isOpen(o)).length;

  function ask(action: OfferAction, offer: AdminOffer) {
    setPending({ action, offer });
    setConfirmOpen(true);
  }

  function apply() {
    if (!pending) return;
    const { action, offer } = pending;
    if (action === "remove") {
      setOffers((os) =>
        os.map((o) => (o.id === offer.id ? { ...o, status: "Removed" } : o)),
      );
    } else if (action === "warn") {
      setMod((m) => ({ ...m, warned: new Set(m.warned).add(offer.userId) }));
    } else {
      setMod((m) => ({
        ...m,
        suspended: new Set(m.suspended).add(offer.userId),
      }));
      setOffers((os) =>
        os.map((o) =>
          o.userId === offer.userId && isOpen(o)
            ? { ...o, status: "Removed" }
            : o,
        ),
      );
    }
  }

  const menu = (o: AdminOffer) => {
    const suspended = mod.suspended.has(o.userId);
    return (
      <RowMenu label={`Actions for ${o.id}`}>
        <DropdownMenuItem onClick={() => setOpenId(o.id)}>
          View details
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href={`/admin/shipments/${o.shipmentId}`} />}
        >
          View shipment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!isOpen(o)}
          onClick={() => ask("remove", o)}
        >
          Remove offer
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={mod.warned.has(o.userId) || suspended}
          onClick={() => ask("warn", o)}
        >
          Warn user
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={suspended}
          onClick={() => ask("suspend", o)}
        >
          Suspend user
        </DropdownMenuItem>
      </RowMenu>
    );
  };

  const driverTags = (o: AdminOffer) => (
    <>
      {mod.suspended.has(o.userId) ? (
        <StatusBadge tone="danger" className="h-5 px-2">
          Suspended
        </StatusBadge>
      ) : mod.warned.has(o.userId) ? (
        <StatusBadge tone="warning" className="h-5 px-2">
          Warned
        </StatusBadge>
      ) : null}
    </>
  );

  return (
    <>
      <PageHeader title="Offers" description="All offers sent by drivers." />

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {offerStats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <StatusTabs tabs={offerTabs} value={tab} onChange={setTab} />

          {shown.length === 0 ? (
            <EmptyRows>No {tab.toLowerCase()} offers to show.</EmptyRows>
          ) : (
            <>
              <TablePanel>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <Th>ID</Th>
                      <Th>Driver</Th>
                      <Th>Shipment</Th>
                      <Th className="text-right">Offer</Th>
                      <Th className="text-right">Budget</Th>
                      <Th className="pl-6">Status</Th>
                      <Th>Sent</Th>
                      <Th className="w-10">
                        <span className="sr-only">Actions</span>
                      </Th>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shown.map((o) => {
                      const flagged = o.status === "Flagged" && o.flags;
                      return (
                        <Fragment key={o.id}>
                          <TableRow
                            onClick={() => setOpenId(o.id)}
                            className={cn(
                              "group/row cursor-pointer hover:bg-background/60",
                              flagged && "border-b-0",
                            )}
                          >
                            <TableCell className="py-3 text-muted-foreground tabular-nums">
                              {o.id}
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="flex items-center gap-2.5">
                                <GradientAvatar
                                  seed={o.driver}
                                  className="size-6"
                                />
                                <span className="font-medium">{o.driver}</span>
                                {driverTags(o)}
                              </span>
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="text-muted-foreground tabular-nums">
                                {o.shipmentId}
                              </span>{" "}
                              {o.shipment}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "py-3 text-right font-medium tabular-nums",
                                o.status === "Removed" &&
                                  "text-muted-foreground line-through",
                              )}
                            >
                              {formatUsd(o.amount)}
                            </TableCell>
                            <TableCell className="py-3 text-right text-muted-foreground tabular-nums">
                              {formatUsd(o.budget)}
                            </TableCell>
                            <TableCell className="py-3 pl-6">
                              <StatusBadge tone={offerTone[o.status]}>
                                {o.status}
                              </StatusBadge>
                            </TableCell>
                            <TableCell className="py-3 text-muted-foreground tabular-nums">
                              {o.sent}
                            </TableCell>
                            <TableCell className="py-3 text-right">
                              {menu(o)}
                            </TableCell>
                          </TableRow>
                          {flagged && (
                            <TableRow
                              onClick={() => setOpenId(o.id)}
                              className="cursor-pointer hover:bg-transparent"
                            >
                              <TableCell />
                              <TableCell colSpan={7} className="pt-0 pb-3.5">
                                <FlagChips flags={o.flags ?? []} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TablePanel>

              <div className="flex flex-col gap-3 md:hidden">
                {shown.map((o) => (
                  <MobileCard
                    key={o.id}
                    onOpen={() => setOpenId(o.id)}
                    menu={menu(o)}
                  >
                    <div className="flex items-center gap-2 pr-8">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {o.id}
                      </span>
                      <StatusBadge tone={offerTone[o.status]}>
                        {o.status}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <GradientAvatar seed={o.driver} className="size-7" />
                      <div className="flex min-w-0 flex-col leading-tight">
                        <span className="flex items-center gap-2 font-medium">
                          {o.driver}
                          {driverTags(o)}
                        </span>
                        <span className="truncate text-sm text-muted-foreground">
                          {o.shipmentId} {o.shipment} · {o.sent}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      <span className="font-heading text-lg font-semibold text-foreground">
                        {formatUsd(o.amount)}
                      </span>{" "}
                      of {formatUsd(o.budget)} budget
                    </p>
                    {o.status === "Flagged" && o.flags && (
                      <FlagChips flags={o.flags} />
                    )}
                  </MobileCard>
                ))}
              </div>
            </>
          )}

          <p className="pt-1 text-sm text-muted-foreground tabular-nums">
            {footer(tab, shown.length)}
          </p>
        </div>
      </div>

      <OfferSheet
        offer={openOffer}
        mod={mod}
        onOpenChange={(o) => !o && setOpenId(null)}
        onAction={ask}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pending ? confirmCopy[pending.action].title(pending.offer) : ""}
        description={
          pending
            ? confirmCopy[pending.action].body(
                pending.offer,
                openCount(pending.offer.userId),
              )
            : ""
        }
        confirmLabel={pending ? confirmCopy[pending.action].label : ""}
        destructive={pending?.action !== "warn"}
        onConfirm={apply}
      />
    </>
  );
}
