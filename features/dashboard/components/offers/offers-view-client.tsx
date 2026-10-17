"use client";

import {
  Alert02Icon,
  MoreHorizontalIcon,
  TagsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MotionConfig, motion } from "motion/react";
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
import {
  EmptyState,
  StatCard,
  StatusBadge,
} from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { MutedTableHead } from "@/features/dashboard/components/dashboard-table";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import {
  isOpen,
  type Offer,
  type OfferTab,
  offerTabs,
  offerTone,
} from "@/lib/demo-data/dashboard/offers";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OffersViewClient({
  initialOffers,
}: {
  initialOffers: Offer[];
}) {
  const [offers, setOffers] = useState(initialOffers);
  const [tab, setTab] = useState<OfferTab>("All");
  const [editing, setEditing] = useState<Offer | null>(null);
  const [withdrawing, setWithdrawing] = useState<Offer | null>(null);

  const shown = tab === "All" ? offers : offers.filter((o) => o.status === tab);
  const outbid = offers.find((o) => o.status === "Outbid");

  function saveOffer(id: string, amount: number) {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const rival = o.rivalLowest ?? amount;
        return {
          ...o,
          amount,
          lowest: Math.min(amount, rival),
          status:
            o.status === "Pending"
              ? "Pending"
              : amount < rival
                ? "Winning"
                : "Outbid",
        };
      }),
    );
  }

  function withdraw(id: string) {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Offers this month"
            value="5"
            className="max-sm:p-4"
          />
          <StatCard label="Won" value="2" className="max-sm:p-4" />
          <StatCard label="Win rate" value="40%" className="max-sm:p-4" />
        </div>

        {offers.length === 0 ? (
          <EmptyState
            icon={TagsIcon}
            title="No offers yet"
            description="You haven’t sent any offers yet. Add a vehicle and start finding jobs."
            action={
              <Link href="/shipments" className={cn(buttonVariants())}>
                Browse shipments
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-5">
            {outbid && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-2xl bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:pl-5"
              >
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    strokeWidth={2}
                    className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400"
                  />
                  <p className="text-pretty">
                    You’ve been outbid on{" "}
                    <span className="font-medium">{outbid.shipment}</span>. The
                    lowest offer is now {formatUsd(outbid.lowest ?? 0)}.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 bg-background max-sm:ml-7 max-sm:w-fit"
                  onClick={() => setEditing(outbid)}
                >
                  Update offer
                </Button>
              </motion.div>
            )}

            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
              <Tabs value={tab} onValueChange={(v) => setTab(v as OfferTab)}>
                <DashboardTabsList>
                  {offerTabs.map((t) => (
                    <TabsTrigger key={t} value={t} className="px-3">
                      {t}
                    </TabsTrigger>
                  ))}
                </DashboardTabsList>
              </Tabs>
            </div>

            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {shown.length === 0 ? (
                <p className="rounded-2xl bg-muted/50 px-5 py-10 text-center text-muted-foreground">
                  No {tab.toLowerCase()} offers right now.
                </p>
              ) : (
                <>
                  <OffersTable
                    offers={shown}
                    onEdit={setEditing}
                    onWithdraw={setWithdrawing}
                  />
                  <div className="flex flex-col gap-3 md:hidden">
                    {shown.map((o) => (
                      <OfferCard
                        key={o.id}
                        offer={o}
                        onEdit={setEditing}
                        onWithdraw={setWithdrawing}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      <EditOfferDialog
        offer={editing}
        onClose={() => setEditing(null)}
        onSave={saveOffer}
      />

      <AlertDialog
        open={!!withdrawing}
        onOpenChange={(open) => !open && setWithdrawing(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this offer?</AlertDialogTitle>
            <AlertDialogDescription>
              {withdrawing &&
                `Your ${formatUsd(withdrawing.amount)} offer on ${withdrawing.shipment} will be removed. You can send a new one while the shipment is still open.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep offer</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (withdrawing) withdraw(withdrawing.id);
                setWithdrawing(null);
              }}
            >
              Withdraw offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MotionConfig>
  );
}

type RowHandlers = {
  onEdit: (o: Offer) => void;
  onWithdraw: (o: Offer) => void;
};

function OffersTable({
  offers,
  ...handlers
}: { offers: Offer[] } & RowHandlers) {
  return (
    <Table className="max-md:hidden">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <MutedTableHead className="pl-0">Shipment</MutedTableHead>
          <MutedTableHead>Route</MutedTableHead>
          <MutedTableHead className="text-right">Your offer</MutedTableHead>
          <MutedTableHead className="text-right">Lowest</MutedTableHead>
          <MutedTableHead className="pl-6">Status</MutedTableHead>
          <MutedTableHead>Closes</MutedTableHead>
          <MutedTableHead className="w-10 pr-0">
            <span className="sr-only">Actions</span>
          </MutedTableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((o) => (
          <TableRow key={o.id} className="hover:bg-transparent">
            <TableCell className="py-4 pl-0 font-medium">
              {o.shipment}
            </TableCell>
            <TableCell className="py-4 text-muted-foreground">
              <RouteLabel
                from={o.from}
                to={o.to}
                truncate
                arrowClassName="opacity-60"
              />
            </TableCell>
            <TableCell className="py-4 text-right font-medium tabular-nums">
              {formatUsd(o.amount)}
            </TableCell>
            <TableCell className="py-4 text-right tabular-nums text-muted-foreground">
              {o.lowest === null ? "—" : formatUsd(o.lowest)}
            </TableCell>
            <TableCell className="py-4 pl-6">
              <StatusBadge tone={offerTone[o.status]}>{o.status}</StatusBadge>
            </TableCell>
            <TableCell
              className={cn(
                "py-4 tabular-nums",
                o.closes === "Closed" && "text-muted-foreground",
              )}
            >
              {o.closes}
            </TableCell>
            <TableCell className="py-4 pr-0 text-right">
              <OfferActions offer={o} {...handlers} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OfferCard({ offer: o, ...handlers }: { offer: Offer } & RowHandlers) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge tone={offerTone[o.status]}>{o.status}</StatusBadge>
          <div className="-my-1 -mr-1">
            <OfferActions offer={o} {...handlers} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-medium">{o.shipment}</p>
          <RouteLabel
            from={o.from}
            to={o.to}
            truncate
            arrowClassName="opacity-60"
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Your offer</dt>
          <dd className="font-medium tabular-nums">{formatUsd(o.amount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Lowest</dt>
          <dd className="tabular-nums">
            {o.lowest === null ? "—" : formatUsd(o.lowest)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Closes</dt>
          <dd className="tabular-nums">{o.closes}</dd>
        </div>
      </dl>
    </div>
  );
}

function OfferActions({
  offer: o,
  onEdit,
  onWithdraw,
}: { offer: Offer } & RowHandlers) {
  const open = isOpen(o);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${o.shipment}`}
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem render={<Link href="/shipments" />}>
          View shipment
        </DropdownMenuItem>
        {o.status === "Won" && (
          <DropdownMenuItem render={<Link href="/dashboard/jobs" />}>
            View job
          </DropdownMenuItem>
        )}
        {open && (
          <>
            <DropdownMenuItem onClick={() => onEdit(o)}>
              Edit offer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onWithdraw(o)}
            >
              Withdraw
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditOfferDialog({
  offer,
  onClose,
  onSave,
}: {
  offer: Offer | null;
  onClose: () => void;
  onSave: (id: string, amount: number) => void;
}) {
  const [value, setValue] = useState("");
  const [current, setCurrent] = useState<Offer | null>(null);

  // Reset the field whenever a different offer is opened.
  if (offer && offer !== current) {
    setCurrent(offer);
    setValue(String(offer.amount));
  }

  const amount = Number(value);
  const valid = value !== "" && amount > 0;
  const shown = offer ?? current;

  return (
    <Dialog open={!!offer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit offer</DialogTitle>
          {shown && (
            <DialogDescription>
              {shown.shipment} ·{" "}
              <RouteLabel
                from={shown.from}
                to={shown.to}
                truncate
                arrowClassName="opacity-60"
              />
            </DialogDescription>
          )}
        </DialogHeader>
        <form
          id="edit-offer"
          className="grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!shown || !valid) return;
            onSave(shown.id, amount);
            onClose();
          }}
        >
          <Label htmlFor="offer-amount">Your price</Label>
          <InputGroup className="h-10">
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput
              id="offer-amount"
              inputMode="numeric"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
            />
          </InputGroup>
          {shown?.lowest != null && (
            <p className="text-sm text-muted-foreground">
              The lowest offer right now is {formatUsd(shown.lowest)}.
            </p>
          )}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-offer" disabled={!valid}>
            Save offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
