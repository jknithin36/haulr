"use client";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { suspendDurations, suspendReasons } from "@/lib/demo-data/admin/users";

type Reason = (typeof suspendReasons)[number];
type Duration = (typeof suspendDurations)[number];

export type Suspension = {
  reason: Reason;
  duration: Duration;
  message: string;
};

const reasonText: Record<Reason, string> = {
  Spam: "sending spam offers",
  Fraud: "suspected fraud",
  "Repeated cancellations": "repeated cancellations",
  Abuse: "abusive behavior toward other members",
  Other: "a breach of our community rules",
};

function defaultMessage(reason: Reason, duration: Duration) {
  const length = duration === "Permanent" ? "permanently" : `for ${duration}`;
  return `Your Haulr account has been suspended ${length} because of ${reasonText[reason]}. If you think this is a mistake, reply to this email and our team will take another look.`;
}

export function SuspendDialog({
  name,
  open,
  onOpenChange,
  onSuspend,
}: {
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend: (s: Suspension) => void;
}) {
  const [reason, setReason] = useState<Reason>("Spam");
  const [duration, setDuration] = useState<Duration>("7 days");
  const [message, setMessage] = useState(defaultMessage("Spam", "7 days"));
  const [edited, setEdited] = useState(false);

  function update(r: Reason, d: Duration) {
    setReason(r);
    setDuration(d);
    if (!edited) setMessage(defaultMessage(r, d));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend {name}</DialogTitle>
          <DialogDescription>
            They can’t sign in, post, or send offers while suspended. Open jobs
            stay visible to support.
          </DialogDescription>
        </DialogHeader>
        <form
          id="suspend-user"
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSuspend({ reason, duration, message });
            onOpenChange(false);
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="suspend-reason">Reason</Label>
            <Select
              items={suspendReasons.map((r) => ({ value: r, label: r }))}
              value={reason}
              onValueChange={(v) => update(v as Reason, duration)}
            >
              <SelectTrigger
                id="suspend-reason"
                className="w-full data-[size=default]:h-10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {suspendReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label id="suspend-duration">Duration</Label>
            <RadioGroup
              aria-labelledby="suspend-duration"
              value={duration}
              onValueChange={(v) => update(reason, v as Duration)}
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {suspendDurations.map((d) => (
                <Label key={d} className="font-normal">
                  <RadioGroupItem value={d} />
                  {d}
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="suspend-message">Message to the user</Label>
            <Textarea
              id="suspend-message"
              rows={4}
              value={message}
              onChange={(e) => {
                setEdited(true);
                setMessage(e.target.value);
              }}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="suspend-user"
            variant="destructive"
            disabled={!message.trim()}
          >
            Suspend user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
