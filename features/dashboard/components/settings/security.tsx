"use client";

import {
  LaptopIcon,
  SmartPhone01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  SettingsRow,
  SettingsSection,
} from "@/features/dashboard/components/settings/section";
import type { Session } from "@/lib/demo-data/dashboard/settings";

const emptyPasswords = { current: "", next: "", confirm: "" };

function passwordErrors(values: typeof emptyPasswords) {
  return {
    current: values.current ? null : "Enter your current password.",
    next:
      values.next.length < 8
        ? "Use at least 8 characters."
        : values.next === values.current
          ? "Pick a password you haven’t used here."
          : null,
    confirm:
      values.confirm && values.confirm === values.next
        ? null
        : "Passwords don’t match.",
  };
}

function ChangePasswordDialog({ onChanged }: { onChanged: () => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(emptyPasswords);
  const [submitted, setSubmitted] = useState(false);
  const errors = passwordErrors(values);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setValues(emptyPasswords);
      setSubmitted(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    onChanged();
    handleOpenChange(false);
  }

  const inputs = [
    {
      key: "current",
      label: "Current password",
      autoComplete: "current-password",
    },
    { key: "next", label: "New password", autoComplete: "new-password" },
    {
      key: "confirm",
      label: "Confirm new password",
      autoComplete: "new-password",
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Change password
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              You’ll stay logged in on this device.
            </DialogDescription>
          </DialogHeader>
          {inputs.map((input) => {
            const error = submitted ? errors[input.key] : null;
            return (
              <Field key={input.key} data-invalid={!!error}>
                <FieldLabel htmlFor={`${id}-${input.key}`}>
                  {input.label}
                </FieldLabel>
                <Input
                  id={`${id}-${input.key}`}
                  type="password"
                  autoComplete={input.autoComplete}
                  value={values[input.key]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [input.key]: e.target.value,
                    }))
                  }
                  aria-invalid={!!error}
                />
                {error ? (
                  <FieldError>{error}</FieldError>
                ) : input.key === "next" ? (
                  <FieldDescription>At least 8 characters.</FieldDescription>
                ) : null}
              </Field>
            );
          })}
          <DialogFooter className="mt-2">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Update password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TwoStepDialog({
  phone,
  enabled,
  onChange,
}: {
  phone: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const id = useId();
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Manage
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Two-step verification</DialogTitle>
          <DialogDescription>
            When you log in on a new device, we text a code to {phone}.
          </DialogDescription>
        </DialogHeader>
        <Field orientation="horizontal" className="rounded-xl bg-muted/50 p-3">
          <FieldLabel htmlFor={`${id}-2fa`} className="flex-1">
            Ask for a code at login
          </FieldLabel>
          <Switch
            id={`${id}-2fa`}
            checked={enabled}
            onCheckedChange={(on) => onChange(on)}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountDialog({ onConfirm }: { onConfirm: () => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const ready = typed === "DELETE";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTyped("");
      }}
    >
      <AlertDialogTrigger
        render={<Button variant="destructive" className="w-fit" />}
      >
        Delete account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            Your profile, reviews, and history will be removed. This can’t be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor={`${id}-confirm`}>
            Type DELETE to confirm
          </FieldLabel>
          <Input
            id={`${id}-confirm`}
            autoComplete="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep my account</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!ready}
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Security({
  initialSessions,
  contact,
}: {
  initialSessions: Session[];
  contact: { email: string; phone: string };
}) {
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [twoStep, setTwoStep] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const others = sessions.filter((session) => !session.current);

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <SettingsSection title="Sign-in">
        <Panel className="flex flex-col divide-y divide-border/60">
          <SettingsRow
            label="Password"
            value={
              passwordChanged ? (
                <span className="inline-flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="size-3.5 text-emerald-600 dark:text-emerald-400"
                  />
                  Changed just now
                </span>
              ) : (
                "Last changed 3 months ago"
              )
            }
            action={
              <ChangePasswordDialog
                onChanged={() => setPasswordChanged(true)}
              />
            }
          />
          <SettingsRow
            label={
              <span className="flex items-center gap-2">
                Two-step verification
                <StatusBadge tone={twoStep ? "success" : "muted"}>
                  {twoStep ? "On" : "Off"}
                </StatusBadge>
              </span>
            }
            action={
              <TwoStepDialog
                phone={contact.phone}
                enabled={twoStep}
                onChange={setTwoStep}
              />
            }
          />
        </Panel>
      </SettingsSection>

      <SettingsSection title="Active sessions">
        <Panel className="flex flex-col gap-5">
          <ul className="flex flex-col divide-y divide-border/60">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background">
                  <HugeiconsIcon
                    icon={
                      session.device.startsWith("iPhone")
                        ? SmartPhone01Icon
                        : LaptopIcon
                    }
                    strokeWidth={2}
                    className="size-4"
                  />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="font-medium">{session.device}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.location}
                    {session.current && " · This device"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {others.length > 0 ? (
            <Button
              variant="outline"
              className="w-fit"
              onClick={() =>
                setSessions((prev) => prev.filter((s) => s.current))
              }
            >
              Log out of other devices
            </Button>
          ) : (
            <output className="block text-sm text-muted-foreground">
              You’re only logged in on this device.
            </output>
          )}
        </Panel>
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <Panel className="flex flex-col gap-4">
          {deleteRequested ? (
            <output className="block text-sm">
              We got your request. Your account will be deleted within 30 days,
              and we’ll email {contact.email} before anything happens.
            </output>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and everything in it.
              </p>
              <DeleteAccountDialog onConfirm={() => setDeleteRequested(true)} />
            </>
          )}
        </Panel>
      </SettingsSection>
    </div>
  );
}
