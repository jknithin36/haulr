"use client";

import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { adminRoles } from "@/lib/demo-data/admin/users";

type Role = (typeof adminRoles)[number];

export function InviteAdminDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Support");

  const valid = name.trim() !== "" && /\S+@\S+\.\S+/.test(email);

  function reset() {
    setName("");
    setEmail("");
    setRole("Support");
  }

  return (
    <>
      <Button size="lg" className="px-3" onClick={() => setOpen(true)}>
        <HugeiconsIcon
          icon={UserAdd01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        Invite admin
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(o) => !o && reset()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite admin</DialogTitle>
            <DialogDescription>
              They’ll get an email with a link to set up their account. The role
              decides which admin pages they can see.
            </DialogDescription>
          </DialogHeader>
          <form
            id="invite-admin"
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) return;
              toast.add({
                type: "success",
                title: `Invite sent to ${name.trim()}`,
                description: `${email.trim()} · ${role}`,
              });
              setOpen(false);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="invite-name">Name</Label>
              <Input
                id="invite-name"
                className="h-10"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Work email</Label>
              <Input
                id="invite-email"
                type="email"
                className="h-10"
                autoComplete="off"
                placeholder="name@haulr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select
                items={adminRoles.map((r) => ({ value: r, label: r }))}
                value={role}
                onValueChange={(v) => setRole(v as Role)}
              >
                <SelectTrigger
                  id="invite-role"
                  className="w-full data-[size=default]:h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-admin" disabled={!valid}>
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
