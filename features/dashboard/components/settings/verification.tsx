"use client";

import { CheckmarkBadge01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import type { VerificationItem } from "@/lib/demo-data/dashboard/settings";

function AddBusinessDialog({ onAdded }: { onAdded: () => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ein, setEin] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim() ? null : "Enter your business name.";
  const einError = /^\d{2}-?\d{7}$/.test(ein.trim())
    ? null
    : "An EIN has 9 digits, like 12-3456789.";

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSubmitted(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (nameError || einError) return;
    onAdded();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Add
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Add business info</DialogTitle>
            <DialogDescription>
              We check this against public records, usually within a day.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={submitted && !!nameError}>
            <FieldLabel htmlFor={`${id}-name`}>Business name</FieldLabel>
            <Input
              id={`${id}-name`}
              autoComplete="organization"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={submitted && !!nameError}
            />
            {submitted && nameError && <FieldError>{nameError}</FieldError>}
          </Field>
          <Field data-invalid={submitted && !!einError}>
            <FieldLabel htmlFor={`${id}-ein`}>EIN</FieldLabel>
            <Input
              id={`${id}-ein`}
              inputMode="numeric"
              placeholder="12-3456789"
              value={ein}
              onChange={(e) => setEin(e.target.value)}
              aria-invalid={submitted && !!einError}
            />
            {submitted && einError && <FieldError>{einError}</FieldError>}
          </Field>
          <DialogFooter className="mt-2">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Verification({ items }: { items: VerificationItem[] }) {
  const [businessInReview, setBusinessInReview] = useState(false);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <SettingsSection title="Verification">
        <Panel className="flex flex-col divide-y divide-border/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="font-medium">{item.label}</p>
                {item.detail && (
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                )}
              </div>
              {item.verified ? (
                <StatusBadge tone="success">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                  Verified
                </StatusBadge>
              ) : businessInReview ? (
                <StatusBadge tone="info">In review</StatusBadge>
              ) : (
                <div className="flex items-center gap-3">
                  <StatusBadge tone="muted">Not added</StatusBadge>
                  <AddBusinessDialog
                    onAdded={() => setBusinessInReview(true)}
                  />
                </div>
              )}
            </div>
          ))}
        </Panel>
      </SettingsSection>

      <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <HugeiconsIcon
          icon={CheckmarkBadge01Icon}
          strokeWidth={2}
          className="size-4 shrink-0 text-foreground"
        />
        Verified users get up to 2× more bookings.
      </p>
    </div>
  );
}
