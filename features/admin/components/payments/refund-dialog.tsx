"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatUsdCents,
  refundApprovalLimit,
  type Transaction,
} from "@/lib/demo-data/admin/payments";

const reasons = [
  "Job cancelled",
  "Item damaged",
  "Late delivery",
  "Charged twice",
  "Other",
];

export function RefundDialog({
  source,
  open,
  onOpenChange,
  onConfirm,
}: {
  source: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (source: Transaction, amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Start each refund from the full amount of the payment it comes from.
  useEffect(() => {
    if (open && source) {
      setAmount(String(source.amount));
      setReason(null);
      setNote("");
    }
  }, [open, source]);

  if (!source) return null;

  const value = Number(amount);
  const tooMuch = value > source.amount;
  const valid = value > 0 && !tooMuch && reason !== null;
  const needsApproval = value > refundApprovalLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            onConfirm(source, value);
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Issue refund</DialogTitle>
            <DialogDescription>
              To {source.user} for {source.job} · paid{" "}
              {formatUsdCents(source.amount)} on {source.date}
            </DialogDescription>
          </DialogHeader>

          <Field data-invalid={tooMuch}>
            <FieldLabel htmlFor="refund-amount">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="refund-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d.]/g, ""))
                }
                aria-invalid={tooMuch}
                className="tabular-nums"
              />
            </InputGroup>
            {tooMuch && (
              <FieldError>
                Can’t be more than {formatUsdCents(source.amount)}.
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="refund-reason">Reason</FieldLabel>
            <Select
              items={reasons.map((r) => ({ value: r, label: r }))}
              value={reason}
              onValueChange={(v) => setReason(v as string)}
            >
              <SelectTrigger id="refund-reason" className="w-full">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="refund-note">Note for the user</FieldLabel>
            <Textarea
              id="refund-note"
              rows={3}
              placeholder="Optional. Included in the refund email."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>

          {needsApproval && !tooMuch && (
            <p className="flex items-start gap-2.5 rounded-xl bg-amber-500/15 p-3 text-sm text-amber-900 dark:text-amber-300">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                strokeWidth={2}
                className="mt-0.5 size-4 shrink-0"
              />
              Needs a second admin to approve. It goes to Pending approval until
              then.
            </p>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!valid}>
              {needsApproval
                ? `Send ${formatUsdCents(value)} for approval`
                : value > 0 && !tooMuch
                  ? `Refund ${formatUsdCents(value)}`
                  : "Refund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
