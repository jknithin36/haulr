"use client";

import {
  BankIcon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  File01Icon,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/data-display";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  formatMoney,
  type PayoutSettingsData,
} from "@/lib/demo-data/dashboard/payments";

function SettingRow({
  icon,
  label,
  value,
  action,
}: {
  icon: typeof BankIcon;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
      {action}
    </div>
  );
}

function ChangeBankDialog({ onSave }: { onSave: (last4: string) => void }) {
  const [open, setOpen] = useState(false);
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const routingError = /^\d{9}$/.test(routing)
    ? null
    : "Routing numbers are 9 digits.";
  const accountError = /^\d{4,17}$/.test(account)
    ? null
    : "Enter the account number from your checks or bank app.";

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setRouting("");
      setAccount("");
      setSubmitted(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (routingError || accountError) return;
    onSave(account.slice(-4));
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Change
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Change payout account</DialogTitle>
            <DialogDescription>
              Payouts go to this bank account from now on.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={submitted && !!routingError}>
            <FieldLabel htmlFor="routing">Routing number</FieldLabel>
            <Input
              id="routing"
              inputMode="numeric"
              autoComplete="off"
              value={routing}
              onChange={(e) => setRouting(e.target.value.trim())}
              aria-invalid={submitted && !!routingError}
            />
            {submitted && routingError && (
              <FieldError>{routingError}</FieldError>
            )}
          </Field>
          <Field data-invalid={submitted && !!accountError}>
            <FieldLabel htmlFor="account">Account number</FieldLabel>
            <Input
              id="account"
              inputMode="numeric"
              autoComplete="off"
              value={account}
              onChange={(e) => setAccount(e.target.value.trim())}
              aria-invalid={submitted && !!accountError}
            />
            {submitted && accountError && (
              <FieldError>{accountError}</FieldError>
            )}
          </Field>
          <DialogFooter className="mt-2">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PayoutSettings({
  settings,
  available,
  onWithdraw,
}: {
  settings: PayoutSettingsData;
  available: number;
  onWithdraw: () => void;
}) {
  const [bankLast4, setBankLast4] = useState(settings.bankLast4);
  const [withdrawn, setWithdrawn] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Keeps the dialog copy steady while it animates out after a withdrawal.
  const dialogAmount = withdrawn ?? available;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Panel className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Available for payout</p>
          <p className="font-heading text-3xl font-semibold tracking-tight">
            {formatMoney(available)}
          </p>
        </div>

        {withdrawn !== null ? (
          <output className="flex items-start gap-2.5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              strokeWidth={2}
              className="mt-0.5 size-4 shrink-0"
            />
            On its way. {formatMoney(withdrawn)} should reach your bank in 1–2
            business days.
          </output>
        ) : null}

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger
            render={<Button size="lg" className="w-full sm:w-fit" />}
            disabled={available <= 0}
          >
            {available > 0
              ? `Withdraw ${formatMoney(available)} now`
              : "Nothing to withdraw"}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Withdraw {formatMoney(dialogAmount)}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                We’ll send it to your bank account ending in {bankLast4}. It
                usually arrives in 1–2 business days.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not now</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setConfirmOpen(false);
                  setWithdrawn(available);
                  onWithdraw();
                }}
              >
                Withdraw {formatMoney(dialogAmount)}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Panel>

      <Panel className="flex flex-col divide-y divide-border/60">
        <SettingRow
          icon={BankIcon}
          label="Payout method"
          value={<>Bank account ending in •••• {bankLast4}</>}
          action={<ChangeBankDialog onSave={setBankLast4} />}
        />
        <SettingRow
          icon={Calendar03Icon}
          label="Payout schedule"
          value={settings.schedule}
        />
        <SettingRow
          icon={File01Icon}
          label="Tax info"
          value={settings.taxInfo}
        />
      </Panel>
    </div>
  );
}
