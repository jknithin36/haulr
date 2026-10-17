"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Panel, StatusBadge } from "@/components/ui/data-display";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  tableCardClassName,
  tableCardHeadClassName,
  tableCardRowClassName,
} from "@/features/dashboard/components/dashboard-table";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import { formatMoney } from "@/lib/demo-data/dashboard/payments";
import type {
  BillingRecord,
  CurrentPlan,
  PlanOption,
} from "@/lib/demo-data/dashboard/settings";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const headCell = cn(tableCardHeadClassName, "px-3");

function ChangePlanDialog({
  plans,
  current,
  onChange,
}: {
  plans: PlanOption[];
  current: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(current);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSelected(current);
      }}
    >
      <DialogTrigger render={<Button />}>Change plan</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
          <DialogDescription>
            Changes start on your next billing date.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          aria-label="Plans"
          value={selected}
          onValueChange={(value) => setSelected(value as string)}
        >
          {plans.map((plan) => (
            <FieldLabel key={plan.name} htmlFor={`plan-${plan.name}`}>
              <Field orientation="horizontal">
                <RadioGroupItem value={plan.name} id={`plan-${plan.name}`} />
                <FieldContent>
                  <FieldTitle className="w-full justify-between">
                    <span>
                      {plan.name}
                      {plan.name === current && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          Current
                        </span>
                      )}
                    </span>
                    <span className="font-normal tabular-nums">
                      {plan.price === 0
                        ? "Free"
                        : `${formatUsd(plan.price)}/month`}
                    </span>
                  </FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            disabled={selected === current}
            onClick={() => {
              onChange(selected);
              setOpen(false);
            }}
          >
            Switch to {selected}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Plan({
  currentPlan,
  plans,
  billingHistory,
}: {
  currentPlan: CurrentPlan;
  plans: PlanOption[];
  billingHistory: BillingRecord[];
}) {
  const planName = currentPlan.name;
  const [scheduledChange, setScheduledChange] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <SettingsSection title="Current plan">
        <Panel className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-xl font-semibold tracking-tight">
                {planName}
              </p>
              <p className="tabular-nums">
                <span className="font-medium">
                  {formatUsd(currentPlan.price)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {canceled
                ? `Ends ${currentPlan.renews}`
                : `Renews ${currentPlan.renews}`}
            </p>
          </div>
          <p className="text-sm">{currentPlan.includes}.</p>

          {(scheduledChange || canceled) && (
            <output className="block rounded-xl bg-background p-3 text-sm text-muted-foreground">
              {canceled
                ? `Your plan is canceled. You keep Pro features until ${currentPlan.renews}.`
                : `You’ll switch to ${scheduledChange} on ${currentPlan.renews}.`}
            </output>
          )}

          <div className="flex flex-wrap gap-2">
            {canceled ? (
              <Button onClick={() => setCanceled(false)}>Keep my plan</Button>
            ) : (
              <>
                <ChangePlanDialog
                  plans={plans}
                  current={scheduledChange ?? planName}
                  onChange={(name) =>
                    setScheduledChange(name === planName ? null : name)
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="ghost" />}>
                    Cancel plan
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel {planName}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You keep unlimited offers and featured placement until{" "}
                        {currentPlan.renews}. After that you move to the Free
                        plan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep plan</AlertDialogCancel>
                      <AlertDialogCancel
                        variant="destructive"
                        onClick={() => {
                          setCanceled(true);
                          setScheduledChange(null);
                        }}
                      >
                        Cancel plan
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </Panel>
      </SettingsSection>

      <SettingsSection title="Billing history">
        <div className={tableCardClassName}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={headCell}>Date</TableHead>
                <TableHead className={cn(headCell, "text-right")}>
                  Amount
                </TableHead>
                <TableHead className={cn(headCell, "text-right")}>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((row) => (
                <TableRow key={row.id} className={tableCardRowClassName}>
                  <TableCell className="px-3 py-3.5">{row.date}</TableCell>
                  <TableCell className="px-3 py-3.5 text-right tabular-nums">
                    {formatMoney(row.amount)}
                  </TableCell>
                  <TableCell className="px-3 py-3.5 text-right">
                    <StatusBadge tone="success" className="ml-auto">
                      {row.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>
    </div>
  );
}
