"use client";

import {
  Alert02Icon,
  Call02Icon,
  Mail01Icon,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Titled block inside a detail page or sheet. */
export function DetailSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex min-h-7 items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Label / value pairs in a soft panel. */
export function Facts({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl bg-muted/50 p-5 sm:grid-cols-4",
        className,
      )}
    >
      {items.map((f) => (
        <div key={f.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd className="font-medium tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Person with their email and phone. */
export function ContactCard({
  label,
  name,
  email,
  phone,
  note,
  className,
}: {
  label: string;
  name: string;
  email: string;
  phone: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-muted/50 p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <GradientAvatar seed={name} className="size-9" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="truncate font-medium">{name}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <ContactLine icon={Mail01Icon} href={`mailto:${email}`}>
          {email}
        </ContactLine>
        <ContactLine
          icon={Call02Icon}
          href={phone.startsWith("(") ? `tel:${phone.replace(/\D/g, "")}` : ""}
        >
          {phone}
        </ContactLine>
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function ContactLine({
  icon,
  href,
  children,
}: {
  icon: typeof Mail01Icon;
  href: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="truncate">{children}</span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex min-w-0 items-center gap-2 tabular-nums hover:underline"
    >
      {body}
    </a>
  ) : (
    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
      {body}
    </span>
  );
}

/** Vertical log of what happened and who did it, newest last. */
export function ActivityLog({
  entries,
}: {
  entries: { label: string; time: string; by: string; note?: string }[];
}) {
  return (
    <ol className="flex flex-col">
      {entries.map((e, i) => (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: entries only append.
          key={i}
          className="relative grid grid-cols-[0.75rem_1fr] gap-3 pb-5 last:pb-0"
        >
          {i < entries.length - 1 && (
            <span
              aria-hidden
              className="absolute top-3.5 bottom-0 left-[5px] w-px bg-foreground/15"
            />
          )}
          <span
            aria-hidden
            className={cn(
              "relative mt-1.5 size-2.5 rounded-full",
              i === entries.length - 1 ? "bg-foreground" : "bg-foreground/30",
            )}
          />
          <div className="flex flex-col gap-0.5">
            <p className="font-medium">{e.label}</p>
            <p className="text-sm text-muted-foreground">
              <span className="tabular-nums">{e.time}</span> · {e.by}
            </p>
            {e.note && <p className="text-sm">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Reasons our checks flagged something. */
export function FlagChips({
  flags,
  className,
}: {
  flags: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {flags.map((f) => (
        <li
          key={f}
          className="inline-flex h-6 items-center gap-1 rounded-full bg-destructive/10 px-2.5 text-xs font-medium text-destructive"
        >
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-3"
          />
          {f}
        </li>
      ))}
    </ul>
  );
}

/** Yes / no confirmation for actions that can't be undone. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Write a message to a user from the Haulr team. */
export function MessageDialog({
  to,
  open,
  onOpenChange,
  onSent,
  placeholder,
}: {
  to: { name: string; role: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: (text: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function change(o: boolean) {
    onOpenChange(o);
    if (!o) {
      setText("");
      setSent(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="gap-5 sm:max-w-md">
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle>Message sent</DialogTitle>
              <DialogDescription>
                {to?.name} will see it in their inbox and get an email.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => change(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form
            className="contents"
            onSubmit={(e) => {
              e.preventDefault();
              onSent?.(text.trim());
              setSent(true);
            }}
          >
            <DialogHeader>
              <DialogTitle>Message {to?.name}</DialogTitle>
              <DialogDescription>
                Sent from the Haulr team to the {to?.role.toLowerCase()}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-message">Message</Label>
              <Textarea
                id="admin-message"
                rows={4}
                value={text}
                placeholder={placeholder}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => change(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!text.trim()}>
                Send message
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
