"use client";

import {
  Download04Icon,
  MoreHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Button } from "@/components/ui/button";
import { Panel, Rating, StatusBadge } from "@/components/ui/data-display";
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
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "@/components/ui/toast";
import { downloadFile, toCsv } from "@/features/admin/admin-download";
import { EmptyRows } from "@/features/admin/components/marketplace/table-kit";
import { tablePanelPadding } from "@/features/admin/components/table-styles";
import { InviteAdminDialog } from "@/features/admin/components/users/invite-admin-dialog";
import {
  SuspendDialog,
  type Suspension,
} from "@/features/admin/components/users/suspend-dialog";
import { UserCell } from "@/features/admin/components/users/user-cell";
import {
  type AdminUserRow,
  users as initialUsers,
  inUserTab,
  type UserTab,
  userStatusTone,
  userTabs,
  userTotals,
} from "@/lib/demo-data/admin/users";

const columns = [
  "User",
  "Email",
  "Location",
  "Type",
  "Shipments",
  "Jobs",
  "Rating",
  "Status",
  "Joined",
] as const;

function downloadCsv(rows: AdminUserRow[]) {
  const csv = toCsv([
    columns,
    ...rows.map((u) => [
      u.name,
      u.email,
      u.location,
      u.type,
      u.shipments,
      u.jobs,
      u.rating ?? "",
      u.status,
      u.joined,
    ]),
  ]);
  downloadFile(`${csv}\n`, "haulr-users.csv", "text/csv;charset=utf-8");
}

type RowHandlers = {
  onSuspend: (u: AdminUserRow) => void;
  onBan: (u: AdminUserRow) => void;
  onRestore: (u: AdminUserRow) => void;
};

export function UsersView() {
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<UserTab>("all");
  const [query, setQuery] = useState("");
  const [suspending, setSuspending] = useState<AdminUserRow | null>(null);
  const [banning, setBanning] = useState<AdminUserRow | null>(null);

  const q = query.trim().toLowerCase();
  const shown = users.filter(
    (u) =>
      inUserTab(u, tab) &&
      (!q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)),
  );

  function setStatus(id: string, status: AdminUserRow["status"]) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }

  function suspend(u: AdminUserRow, s: Suspension) {
    setStatus(u.id, "Suspended");
    toast.add({
      type: "success",
      title: `${u.name} is suspended`,
      description: `${s.reason} · ${s.duration}. We emailed them your message.`,
    });
  }

  const handlers: RowHandlers = {
    onSuspend: setSuspending,
    onBan: setBanning,
    onRestore: (u) => {
      setStatus(u.id, "Active");
      toast.add({ type: "success", title: `${u.name} is active again` });
    },
  };

  return (
    <Toaster>
      <PageHeader
        title="Users"
        description={`${userTotals.total} total users · ${userTotals.joinedThisMonth} joined this month`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="px-3"
              onClick={() => downloadCsv(shown)}
              disabled={shown.length === 0}
            >
              <HugeiconsIcon
                icon={Download04Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Export CSV
            </Button>
            <InviteAdminDialog />
          </div>
        }
      />

      <div className="flex flex-col gap-5">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
          <Tabs value={tab} onValueChange={(v) => setTab(v as UserTab)}>
            <TabsList className="group-data-horizontal/tabs:h-9">
              {userTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="px-3">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <InputGroup className="h-10 md:max-w-sm">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search users"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>

        {shown.length === 0 ? (
          <EmptyRows>
            {q
              ? `No users match “${query.trim()}”.`
              : "No users in this view right now."}
          </EmptyRows>
        ) : (
          <>
            <Panel className={tablePanelPadding}>
              <UsersTable users={shown} {...handlers} />
            </Panel>
            <div className="flex flex-col gap-3 md:hidden">
              {shown.map((u) => (
                <UserCard key={u.id} user={u} {...handlers} />
              ))}
            </div>
          </>
        )}
      </div>

      {suspending && (
        <SuspendDialog
          key={suspending.id}
          name={suspending.name}
          open
          onOpenChange={(open) => !open && setSuspending(null)}
          onSuspend={(s) => suspend(suspending, s)}
        />
      )}

      <AlertDialog
        open={!!banning}
        onOpenChange={(open) => !open && setBanning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban {banning?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Their account is closed for good, open offers are withdrawn, and
              they can’t sign up again with this email or phone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (banning) {
                  setStatus(banning.id, "Banned");
                  toast.add({
                    type: "success",
                    title: `${banning.name} is banned`,
                  });
                }
                setBanning(null);
              }}
            >
              Ban user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Toaster>
  );
}

function UsersTable({
  users,
  ...handlers
}: { users: AdminUserRow[] } & RowHandlers) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((c) => (
            <TableHead
              key={c}
              className={
                c === "Shipments" || c === "Jobs"
                  ? "text-right font-normal text-muted-foreground"
                  : "font-normal text-muted-foreground"
              }
            >
              {c}
            </TableHead>
          ))}
          <TableHead className="w-10">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id} className="hover:bg-transparent">
            <TableCell className="py-3">
              <UserCell name={u.name} href={`/admin/users/${u.id}`} />
            </TableCell>
            <TableCell className="py-3 text-muted-foreground">
              {u.email}
            </TableCell>
            <TableCell className="py-3">{u.location}</TableCell>
            <TableCell className="py-3">{u.type}</TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {u.shipments}
            </TableCell>
            <TableCell className="py-3 text-right tabular-nums">
              {u.jobs}
            </TableCell>
            <TableCell className="py-3">
              {u.rating === null ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                <Rating value={u.rating} />
              )}
            </TableCell>
            <TableCell className="py-3">
              <StatusBadge tone={userStatusTone[u.status]}>
                {u.status}
              </StatusBadge>
            </TableCell>
            <TableCell className="py-3 whitespace-nowrap text-muted-foreground">
              {u.joined}
            </TableCell>
            <TableCell className="py-3 text-right">
              <UserActions user={u} {...handlers} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function UserCard({
  user: u,
  ...handlers
}: { user: AdminUserRow } & RowHandlers) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <UserCell name={u.name} href={`/admin/users/${u.id}`} sub={u.email} />
        <div className="-my-1 -mr-1">
          <UserActions user={u} {...handlers} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={userStatusTone[u.status]}>{u.status}</StatusBadge>
        <span className="text-sm text-muted-foreground">
          {u.type} · {u.location}
        </span>
      </div>
      <dl className="grid grid-cols-4 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Shipments</dt>
          <dd className="tabular-nums">{u.shipments}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Jobs</dt>
          <dd className="tabular-nums">{u.jobs}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Rating</dt>
          <dd>{u.rating === null ? "—" : <Rating value={u.rating} />}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Joined</dt>
          <dd className="whitespace-nowrap">{u.joined}</dd>
        </div>
      </dl>
    </div>
  );
}

function UserActions({
  user: u,
  onSuspend,
  onBan,
  onRestore,
}: { user: AdminUserRow } & RowHandlers) {
  const blocked = u.status === "Suspended" || u.status === "Banned";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${u.name}`}
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href={`/admin/users/${u.id}`} />}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.location.href = `mailto:${u.email}`;
          }}
        >
          Email user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {blocked ? (
          <DropdownMenuItem onClick={() => onRestore(u)}>
            {u.status === "Banned" ? "Lift ban" : "Lift suspension"}
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onSuspend(u)}>
              Suspend
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onBan(u)}>
              Ban
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
