"use client";

import {
  ArrowLeft01Icon,
  CancelCircleIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CrownIcon,
  LockPasswordIcon,
  Login03Icon,
  Mail01Icon,
  UserBlock01Icon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Panel, StatCard, StatusBadge } from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/features/admin/components/marketplace/detail-kit";
import {
  SuspendDialog,
  type Suspension,
} from "@/features/admin/components/users/suspend-dialog";
import {
  ActivityTab,
  NotesTab,
  OffersTab,
  PaymentsTab,
  ReportsTab,
  ReviewsTab,
  ShipmentsTab,
  TripsTab,
} from "@/features/admin/components/users/user-tabs";
import { signIn } from "@/features/user/user-actions";
import { adminUser } from "@/lib/demo-data/admin/admin-user";
import {
  type AdminUserRow,
  plans,
  type UserNote,
  type UserStatus,
  userStatusTone,
  type VerificationItem,
} from "@/lib/demo-data/admin/users";
import { firstName, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Sarah is the demo account, so she gets every tab filled from her dashboard. */
const FULL_PROFILE = "sarah-miller";

const typeLabel: Record<AdminUserRow["type"], string> = {
  Both: "Shipper and driver",
  Driver: "Driver",
  Shipper: "Shipper",
  Business: "Business account",
};

type Confirm = "reset" | "verify" | "ban" | "impersonate" | null;
type Open = "email" | "plan" | "suspend" | null;

export function UserDetailClient({ user: initial }: { user: AdminUserRow }) {
  const full = initial.id === FULL_PROFILE;

  const [status, setStatus] = useState<UserStatus>(initial.status);
  const [plan, setPlan] = useState(initial.plan);
  const [notes, setNotes] = useState<UserNote[]>(initial.notes);
  const [verification, setVerification] = useState(initial.verification);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [open, setOpen] = useState<Open>(null);
  const [leaving, startLeaving] = useTransition();

  const user = { ...initial, status, plan };
  // Anonymous accounts ("User #30544") have no first name to shorten to.
  const shortName = user.name.startsWith("User #")
    ? user.name
    : firstName(user.name);
  const verified = status.startsWith("Verified");
  const blocked = status === "Suspended" || status === "Banned";

  function suspend(s: Suspension) {
    setStatus("Suspended");
    toast.add({
      type: "success",
      title: `${user.name} is suspended`,
      description: `${s.reason} · ${s.duration}. We emailed them your message.`,
    });
  }

  function addNote(text: string) {
    setNotes((prev) => [
      {
        id: `n${prev.length + 1}-${text.length}`,
        author: adminUser.name,
        date: "Just now",
        text,
      },
      ...prev,
    ]);
  }

  const stats = [
    { label: "Shipments", value: user.shipments },
    { label: "Jobs", value: user.jobs },
    { label: "Earned", value: formatUsd(user.earned) },
    { label: "Spent", value: formatUsd(user.spent) },
    { label: "Disputes", value: user.disputes },
    { label: "Cancellations", value: user.cancellations },
  ];

  const tabs = full
    ? [
        "Activity",
        "Shipments",
        "Trips",
        "Offers",
        "Payments",
        "Reviews",
        "Reports",
        "Notes",
      ]
    : ["Activity", "Reports", "Notes"];

  return (
    <Toaster>
      <Link
        href="/admin/users"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 mb-3 w-fit text-muted-foreground",
        )}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        Users
      </Link>

      <PageHeader
        title={user.name}
        description={`${typeLabel[user.type]} · Member since ${user.memberSince}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="px-3"
              onClick={() => setOpen("email")}
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Send email
            </Button>
            {full && (
              <Button
                size="lg"
                className="px-3"
                onClick={() => setConfirm("impersonate")}
              >
                <HugeiconsIcon
                  icon={Login03Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Log in as user
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                className="max-sm:p-4"
              />
            ))}
          </div>

          <Tabs defaultValue="Activity" className="gap-4">
            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
              <TabsList className="group-data-horizontal/tabs:h-9">
                {tabs.map((t) => (
                  <TabsTrigger key={t} value={t} className="px-3">
                    {t}
                    {t === "Notes" && notes.length > 0 && (
                      <span className="text-muted-foreground tabular-nums">
                        {notes.length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="Activity">
              <ActivityTab items={user.activity} />
            </TabsContent>
            {full && (
              <>
                <TabsContent value="Shipments">
                  <ShipmentsTab />
                </TabsContent>
                <TabsContent value="Trips">
                  <TripsTab />
                </TabsContent>
                <TabsContent value="Offers">
                  <OffersTab />
                </TabsContent>
                <TabsContent value="Payments">
                  <PaymentsTab />
                </TabsContent>
                <TabsContent value="Reviews">
                  <ReviewsTab />
                </TabsContent>
              </>
            )}
            <TabsContent value="Reports">
              <ReportsTab name={shortName} reports={user.reports} />
            </TabsContent>
            <TabsContent value="Notes">
              <NotesTab notes={notes} onAdd={addNote} />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <GradientAvatar seed={user.name} className="size-14 shrink-0" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate font-medium">{user.name}</p>
                <StatusBadge tone={userStatusTone[status]}>
                  {status}
                </StatusBadge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <Detail label="Email" value={user.email} />
              <Detail label="Phone" value={user.phone} />
              <Detail label="Location" value={user.location} />
              <Detail label="Member since" value={user.memberSince} />
              <Detail label="Plan" value={plan} />
            </dl>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <h2 className="font-medium">Verification</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {verification.map((v) => (
                <VerificationRow key={v.label} item={v} />
              ))}
            </ul>
          </Panel>

          <Panel className="flex flex-col gap-3">
            <h2 className="font-medium">Admin actions</h2>
            <div className="-mx-2 flex flex-col">
              <ActionButton
                icon={LockPasswordIcon}
                onClick={() => setConfirm("reset")}
              >
                Reset password
              </ActionButton>
              <ActionButton
                icon={CheckmarkBadge01Icon}
                onClick={() => setConfirm("verify")}
                disabled={verified}
              >
                {verified ? "Verified" : "Verify manually"}
              </ActionButton>
              <ActionButton icon={CrownIcon} onClick={() => setOpen("plan")}>
                Change plan
              </ActionButton>
              {blocked ? (
                <ActionButton
                  icon={UserBlock01Icon}
                  onClick={() => {
                    setStatus("Active");
                    toast.add({
                      type: "success",
                      title: `${user.name} is active again`,
                    });
                  }}
                >
                  {status === "Banned" ? "Lift ban" : "Lift suspension"}
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    icon={UserBlock01Icon}
                    onClick={() => setOpen("suspend")}
                  >
                    Suspend
                  </ActionButton>
                  <ActionButton
                    icon={UserRemove01Icon}
                    destructive
                    onClick={() => setConfirm("ban")}
                  >
                    Ban
                  </ActionButton>
                </>
              )}
            </div>
          </Panel>
        </aside>
      </div>

      <SendEmailDialog
        name={user.name}
        email={user.email}
        open={open === "email"}
        onOpenChange={(o) => setOpen(o ? "email" : null)}
      />
      <ChangePlanDialog
        name={user.name}
        current={plan}
        open={open === "plan"}
        onOpenChange={(o) => setOpen(o ? "plan" : null)}
        onSave={(p) => {
          setPlan(p);
          toast.add({
            type: "success",
            title: `${user.name} is now on ${p}`,
          });
        }}
      />
      <SuspendDialog
        name={user.name}
        open={open === "suspend"}
        onOpenChange={(o) => setOpen(o ? "suspend" : null)}
        onSuspend={suspend}
      />

      <ConfirmDialog
        open={confirm === "reset"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Reset password?"
        description={`We’ll email a reset link to ${user.email}. Their current password stops working right away and they’re signed out on every device.`}
        destructive={false}
        confirmLabel="Send reset link"
        onConfirm={() =>
          toast.add({
            type: "success",
            title: "Reset link sent",
            description: user.email,
          })
        }
      />
      <ConfirmDialog
        open={confirm === "verify"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={`Verify ${user.name} manually?`}
        description="Use this when you’ve checked their documents outside the queue. Any pending documents are marked approved and they get the verified badge."
        destructive={false}
        confirmLabel="Mark as verified"
        onConfirm={() => {
          setStatus("Verified");
          setVerification((prev) =>
            prev.map((v) =>
              v.state === "pending" ? { ...v, state: "verified" } : v,
            ),
          );
          toast.add({ type: "success", title: `${user.name} is verified` });
        }}
      />
      <ConfirmDialog
        open={confirm === "ban"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={`Ban ${user.name}?`}
        description="Their account is closed for good, open offers are withdrawn, and they can’t sign up again with this email or phone."
        confirmLabel="Ban user"
        destructive
        onConfirm={() => {
          setStatus("Banned");
          toast.add({ type: "success", title: `${user.name} is banned` });
        }}
      />
      <AlertDialog
        open={confirm === "impersonate"}
        onOpenChange={(o) => !o && !leaving && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log in as {user.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You’ll leave the admin area and see Haulr exactly as {shortName}{" "}
              does, in support mode. Anything you change is saved to their
              account. To come back, log out and sign in as an admin again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={leaving}>Cancel</AlertDialogCancel>
            <Button
              disabled={leaving}
              onClick={() => startLeaving(() => signIn("user", "/dashboard"))}
            >
              {leaving ? "Opening…" : "Log in as user"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Toaster>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}

const stateIcon = {
  verified: {
    icon: CheckmarkCircle02Icon,
    className: "text-emerald-700 dark:text-emerald-400",
  },
  pending: {
    icon: Clock01Icon,
    className: "text-amber-700 dark:text-amber-400",
  },
  missing: { icon: CancelCircleIcon, className: "text-muted-foreground" },
} as const;

function VerificationRow({ item }: { item: VerificationItem }) {
  const s = stateIcon[item.state];
  const detail =
    item.state === "pending"
      ? `Waiting for review · ${item.detail}`
      : item.state === "missing"
        ? "Not added"
        : item.detail;
  return (
    <li className="flex items-start gap-2.5">
      <HugeiconsIcon
        icon={s.icon}
        strokeWidth={2}
        className={cn("mt-0.5 size-4 shrink-0", s.className)}
      />
      <div className="flex min-w-0 flex-col">
        <span>{item.label}</span>
        {detail && (
          <span className="truncate text-muted-foreground">{detail}</span>
        )}
      </div>
    </li>
  );
}

function ActionButton({
  icon,
  children,
  destructive,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon: typeof Mail01Icon;
  destructive?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-9 justify-start px-2 font-normal",
        destructive &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
      {...props}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} data-icon="inline-start" />
      {children}
    </Button>
  );
}

function SendEmailDialog({
  name,
  email,
  open,
  onOpenChange,
}: {
  name: string;
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const valid = subject.trim() !== "" && body.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(o) => {
        if (!o) {
          setSubject("");
          setBody("");
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Email {name}</DialogTitle>
          <DialogDescription>
            Sent from support@haulr.com to {email}. Replies go to the support
            inbox.
          </DialogDescription>
        </DialogHeader>
        <form
          id="send-email"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            toast.add({
              type: "success",
              title: `Email sent to ${name}`,
              description: subject.trim(),
            });
            onOpenChange(false);
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              className="h-10"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email-body">Message</Label>
            <Textarea
              id="email-body"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="send-email" disabled={!valid}>
            Send email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangePlanDialog({
  name,
  current,
  open,
  onOpenChange,
  onSave,
}: {
  name: string;
  current: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: string) => void;
}) {
  const [value, setValue] = useState(current);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(o) => o && setValue(current)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
          <DialogDescription>
            {name} is on {current}. The change starts today and their next bill
            is prorated.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          aria-label="Plan"
          value={value}
          onValueChange={(v) => setValue(v as string)}
          className="gap-2"
        >
          {plans.map((p) => (
            <Label
              key={p.value}
              className="flex items-start gap-3 rounded-xl bg-muted/50 p-3.5 font-normal has-data-checked:bg-muted"
            >
              <RadioGroupItem value={p.value} className="mt-0.5" />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{p.value}</span>
                <span className="text-muted-foreground">{p.hint}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={value === current}
            onClick={() => {
              onSave(value);
              onOpenChange(false);
            }}
          >
            Change plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
