"use client";

import {
  InformationCircleIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
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
import { recordTable } from "@/features/admin/components/table-styles";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import {
  type TeamMember,
  type TeamRole,
  teamMembers,
  teamRoles,
} from "@/lib/demo-data/admin/settings";

const roleItems = teamRoles.map((role) => ({ value: role, label: role }));

function LastActive({ member }: { member: TeamMember }) {
  return member.invited ? (
    <StatusBadge tone="muted">Invite sent</StatusBadge>
  ) : (
    <span className="text-muted-foreground">{member.lastActive}</span>
  );
}

function InviteDialog({ onInvite }: { onInvite: (m: TeamMember) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("Support");

  const valid = name.trim() !== "" && /^\S+@\S+\.\S+$/.test(email.trim());

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onInvite({
      name: name.trim(),
      email: email.trim(),
      role,
      lastActive: "",
      invited: true,
    });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setName("");
          setEmail("");
          setRole("Support");
        }
      }}
    >
      <DialogTrigger render={<Button className="w-fit" />}>
        <HugeiconsIcon
          icon={UserAdd01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        Invite team member
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>
              They’ll get an email to set up their admin account.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
              <Input
                id={`${id}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                className="h-9"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
              <Input
                id={`${id}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@haulr.com"
                autoComplete="off"
                className="h-9"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-role`}>Role</FieldLabel>
              <Select
                items={roleItems}
                value={role}
                onValueChange={(v) => v && setRole(v as TeamRole)}
              >
                <SelectTrigger
                  id={`${id}-role`}
                  className="w-full data-[size=default]:h-9"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!valid}>
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Team() {
  const [members, setMembers] = useState(teamMembers);

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <SettingsSection
        title="Team"
        description="People with access to Haulr Admin."
      >
        <div className={recordTable.panel}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={recordTable.head}>Name</TableHead>
                <TableHead className={recordTable.head}>Email</TableHead>
                <TableHead className={recordTable.head}>Role</TableHead>
                <TableHead className={`${recordTable.head} text-right`}>
                  Last active
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.email} className={recordTable.row}>
                  <TableCell className={recordTable.cell}>
                    <span className="flex items-center gap-2.5">
                      <GradientAvatar
                        seed={member.name}
                        className="size-7 shrink-0"
                      />
                      <span className="font-medium">{member.name}</span>
                    </span>
                  </TableCell>
                  <TableCell
                    className={`${recordTable.cell} text-muted-foreground`}
                  >
                    {member.email}
                  </TableCell>
                  <TableCell className={recordTable.cell}>
                    {member.role}
                  </TableCell>
                  <TableCell className={`${recordTable.cell} text-right`}>
                    <div className="flex justify-end">
                      <LastActive member={member} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <ul className="flex flex-col gap-2 md:hidden">
          {members.map((member) => (
            <li
              key={member.email}
              className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4"
            >
              <GradientAvatar seed={member.name} className="size-9 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium">{member.name}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {member.role} · {member.email}
                </span>
              </div>
              <span className="shrink-0 text-xs">
                <LastActive member={member} />
              </span>
            </li>
          ))}
        </ul>
      </SettingsSection>

      <p className="flex gap-2 text-sm text-muted-foreground">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          strokeWidth={2}
          className="mt-0.5 size-4 shrink-0"
        />
        Roles control access: Support can’t issue refunds, Finance can’t ban
        users, Content only sees the blog.
      </p>

      <InviteDialog onInvite={(m) => setMembers((prev) => [...prev, m])} />
    </div>
  );
}
