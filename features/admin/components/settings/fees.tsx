"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/data-display";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumberInput } from "@/features/admin/components/settings/number-input";
import {
  isDirty,
  SaveBar,
} from "@/features/admin/components/settings/save-bar";
import { recordTable } from "@/features/admin/components/table-styles";
import {
  SettingsRow,
  SettingsSection,
} from "@/features/dashboard/components/settings/section";
import {
  type FeePlan,
  feePlans,
  paymentDefaults,
  payoutOptions,
} from "@/lib/demo-data/admin/settings";

const headCell = "h-11 px-2 md:px-4 text-xs font-medium text-muted-foreground";
const bodyCell = "px-2 py-3 md:px-4";

export function Fees() {
  const [saved, setSaved] = useState({
    plans: feePlans,
    ...paymentDefaults,
  });
  const [values, setValues] = useState(saved);

  function updatePlan(id: string, patch: Partial<FeePlan>) {
    setValues((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <SettingsSection
        title="Plans"
        description="Booking fees are taken from each booking and shown to drivers before they send an offer."
      >
        <div className="rounded-2xl bg-muted/50 px-2 py-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={headCell}>Plan</TableHead>
                <TableHead className={headCell}>Price</TableHead>
                <TableHead className={headCell}>Booking fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.plans.map((plan) => (
                <TableRow key={plan.id} className={recordTable.row}>
                  <TableCell className={`${bodyCell} font-medium`}>
                    {plan.name}
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <NumberInput
                      label={`${plan.name} price per month`}
                      value={plan.price}
                      onChange={(price) => updatePlan(plan.id, { price })}
                      prefix="$"
                      suffix="/month"
                      className="w-30"
                    />
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <NumberInput
                      label={`${plan.name} booking fee`}
                      value={plan.fee}
                      onChange={(fee) => updatePlan(plan.id, { fee })}
                      suffix="%"
                      max={100}
                      className="w-20"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>

      <SettingsSection title="Payments">
        <Panel className="divide-y divide-border/60">
          <SettingsRow
            label="Deposit"
            value="Charged when the customer books"
            action={
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <NumberInput
                  label="Deposit percent"
                  value={values.depositPercent}
                  onChange={(depositPercent) =>
                    setValues((prev) => ({ ...prev, depositPercent }))
                  }
                  suffix="%"
                  max={100}
                  className="w-20"
                />
                of the booking price
              </span>
            }
          />
          <SettingsRow
            label="Driver payout"
            value="Counted from the customer confirming delivery"
            action={
              <Select
                items={payoutOptions}
                value={values.payoutDays}
                onValueChange={(v) =>
                  v &&
                  setValues((prev) => ({ ...prev, payoutDays: v as string }))
                }
              >
                <SelectTrigger
                  aria-label="Driver payout"
                  className="bg-background data-[size=default]:h-9 dark:bg-background"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {payoutOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            label="Refund approval"
            value="Second admin required above"
            action={
              <NumberInput
                label="Refund amount needing a second admin"
                value={values.refundApprovalAbove}
                onChange={(refundApprovalAbove) =>
                  setValues((prev) => ({ ...prev, refundApprovalAbove }))
                }
                prefix="$"
              />
            }
          />
        </Panel>
      </SettingsSection>

      <SaveBar dirty={isDirty(values, saved)} onSave={() => setSaved(values)} />
    </div>
  );
}
