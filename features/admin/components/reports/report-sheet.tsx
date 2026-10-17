"use client";

import {
  Alert02Icon,
  Cancel01Icon,
  Delete02Icon,
  UndoIcon,
  UserBlock01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/data-display";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  type Report,
  reportStatus,
  reportTone,
} from "@/lib/demo-data/admin/reports";

export type ReportAction = "remove" | "warn" | "suspend" | "dismiss" | "reopen";

export const reportActions: {
  action: Exclude<ReportAction, "reopen">;
  label: string;
  icon: typeof Alert02Icon;
}[] = [
  { action: "remove", label: "Remove content", icon: Delete02Icon },
  { action: "warn", label: "Warn user", icon: Alert02Icon },
  { action: "suspend", label: "Suspend user", icon: UserBlock01Icon },
  { action: "dismiss", label: "Dismiss report", icon: Cancel01Icon },
];

/** A reported user has no single piece of content to remove. */
export function canRemove(r: Report) {
  return r.type !== "User";
}

export function ReportSheet({
  report,
  open,
  onOpenChange,
  onAction,
}: {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: ReportAction) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const reportId = report?.id;

  // Each report starts with sensitive content covered again.
  useEffect(() => {
    if (reportId) setRevealed(false);
  }, [reportId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md data-[side=right]:sm:max-w-md">
        {report && (
          <>
            <SheetHeader className="gap-1.5 p-6 pb-4">
              <StatusBadge tone={reportTone[report.state]}>
                {reportStatus(report)}
              </StatusBadge>
              <SheetTitle className="pt-1 text-lg">{report.item}</SheetTitle>
              <SheetDescription>
                {report.id} · {report.reason}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6">
              <section className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-medium">{report.content.label}</h3>
                  {report.content.sensitive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-my-1 -mr-1.5"
                      onClick={() => setRevealed((v) => !v)}
                    >
                      <HugeiconsIcon
                        icon={revealed ? ViewOffSlashIcon : ViewIcon}
                        strokeWidth={2}
                      />
                      {revealed ? "Hide content" : "Show content"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.content.author}
                </p>
                {report.content.sensitive && !revealed ? (
                  <p className="rounded-xl bg-background p-3 text-muted-foreground">
                    Hidden because it may contain {report.reason.toLowerCase()}.
                  </p>
                ) : (
                  <p className="rounded-xl bg-background p-3 text-base text-pretty">
                    {report.content.text}
                  </p>
                )}
                {report.content.meta && (
                  <p className="text-xs text-muted-foreground">
                    {report.content.meta}
                  </p>
                )}
              </section>

              <dl className="flex flex-col gap-2.5">
                {[
                  ["Type", report.type],
                  ["Reason", report.reason],
                  ["Reported by", report.reportedBy],
                  ["Date", report.date],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <SheetFooter className="grid grid-cols-2 gap-2 border-t p-4">
              {report.state === "Open" ? (
                reportActions
                  .filter((a) => a.action !== "remove" || canRemove(report))
                  .map((a) => (
                    <Button
                      key={a.action}
                      variant={
                        a.action === "suspend"
                          ? "destructive"
                          : a.action === "dismiss"
                            ? "ghost"
                            : "outline"
                      }
                      size="lg"
                      onClick={() => onAction(a.action)}
                    >
                      <HugeiconsIcon icon={a.icon} strokeWidth={2} />
                      {a.label}
                    </Button>
                  ))
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="col-span-2"
                  onClick={() => onAction("reopen")}
                >
                  <HugeiconsIcon icon={UndoIcon} strokeWidth={2} />
                  Reopen report
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
