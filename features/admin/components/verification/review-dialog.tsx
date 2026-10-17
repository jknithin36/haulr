"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UserCell } from "@/features/admin/components/users/user-cell";
import { CheckChips } from "@/features/admin/components/verification/check-chip";
import { DocumentPreview } from "@/features/admin/components/verification/document-preview";
import {
  type ChecklistKey,
  messageFor,
  minimumCoverage,
  needsCoverage,
  type RejectionReason,
  rejectionReasons,
  suggestedReason,
  type VerificationItem,
} from "@/lib/demo-data/admin/verification";
import { formatUsd } from "@/lib/format";

export type Decision =
  | { kind: "approve" }
  | { kind: "reject" | "reupload"; reason: RejectionReason; message: string };

const checklistLabels: Record<ChecklistKey, string> = {
  name: "Name matches account",
  expiry: "Document not expired",
  photo: "Photo is clear",
  coverage: `Coverage meets the minimum (${formatUsd(minimumCoverage)})`,
};

export function ReviewDialog({
  item,
  onClose,
  onDecide,
}: {
  item: VerificationItem | null;
  onClose: () => void;
  onDecide: (item: VerificationItem, decision: Decision) => void;
}) {
  // Keep the last item around so the dialog doesn't go blank while closing.
  const [shown, setShown] = useState(item);
  if (item && item !== shown) setShown(item);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-5xl">
        {shown && (
          <ReviewBody
            key={shown.id}
            item={shown}
            onDecide={(d) => {
              onDecide(shown, d);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReviewBody({
  item,
  onDecide,
}: {
  item: VerificationItem;
  onDecide: (d: Decision) => void;
}) {
  const [checklist, setChecklist] = useState(item.checklist);
  const [mode, setMode] = useState<"review" | "reject" | "reupload">("review");
  const [reason, setReason] = useState<RejectionReason>(suggestedReason(item));
  const [message, setMessage] = useState(
    messageFor(item.kind, suggestedReason(item)),
  );

  const keys: ChecklistKey[] = ["name", "expiry", "photo", "coverage"];
  const applies = (k: ChecklistKey) =>
    k !== "coverage" || needsCoverage(item.kind);
  const allTicked = keys.filter(applies).every((k) => checklist[k]);

  function pickReason(r: RejectionReason) {
    setReason(r);
    setMessage(messageFor(item.kind, r));
  }

  return (
    <div className="grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-3 bg-muted/60 p-5 md:p-8">
        <p className="text-xs text-muted-foreground">
          Placeholder preview · no file in this demo
        </p>
        <div className="flex flex-1 items-center justify-center py-4 md:py-8">
          <DocumentPreview item={item} />
        </div>
        <p className="text-xs text-muted-foreground">
          Uploaded {item.uploaded} · waiting {item.waiting}
        </p>
      </div>

      <div className="flex flex-col gap-6 p-5 md:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg">{item.document}</DialogTitle>
          <DialogDescription>
            Check it against the account before you decide.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <UserCell
            name={item.user}
            href={item.userId ? `/admin/users/${item.userId}` : undefined}
            sub={item.email}
          />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Detail label="Location" value={item.location} />
            <Detail label="Account" value={item.accountType} />
            <Detail label="Joined" value={item.joined} />
            <Detail label="Name on document" value={item.nameOnDocument} />
            {item.fields.map((f) => (
              <Detail key={f.label} label={f.label} value={f.value} />
            ))}
          </dl>
          <CheckChips checks={item.checks} />
        </div>

        {mode === "review" ? (
          <>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium">Checklist</legend>
              {keys.map((k) => (
                <Label key={k} className="font-normal has-disabled:opacity-60">
                  <Checkbox
                    checked={applies(k) && checklist[k]}
                    disabled={!applies(k)}
                    onCheckedChange={(v) =>
                      setChecklist((prev) => ({ ...prev, [k]: v === true }))
                    }
                  />
                  <span>
                    {checklistLabels[k]}
                    {!applies(k) && (
                      <span className="text-muted-foreground">
                        {" "}
                        · not needed
                      </span>
                    )}
                  </span>
                </Label>
              ))}
            </fieldset>

            <div className="mt-auto flex flex-col gap-3">
              {!allTicked && (
                <p className="text-sm text-muted-foreground">
                  Tick every check to approve.
                </p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="lg"
                  disabled={!allTicked}
                  onClick={() => onDecide({ kind: "approve" })}
                >
                  Approve
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setMode("reject")}
                >
                  Reject
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setMode("reupload")}
                >
                  Ask for a new upload
                </Button>
              </div>
            </div>
          </>
        ) : (
          <form
            className="flex flex-1 flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              onDecide({ kind: mode, reason, message: message.trim() });
            }}
          >
            <div className="flex flex-col gap-3">
              <Label id="reject-reason">
                {mode === "reject" ? "Rejection reason" : "What’s wrong"}
              </Label>
              <RadioGroup
                aria-labelledby="reject-reason"
                value={reason}
                onValueChange={(v) => pickReason(v as RejectionReason)}
                className="grid-cols-2 gap-x-4 gap-y-2.5"
              >
                {rejectionReasons.map((r) => (
                  <Label key={r.value} className="font-normal">
                    <RadioGroupItem value={r.value} />
                    {r.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-message">Message to the user</Label>
              <Textarea
                id="reject-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                variant={mode === "reject" ? "destructive" : "default"}
                disabled={!message.trim()}
              >
                {mode === "reject" ? "Reject document" : "Send request"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => setMode("review")}
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}
