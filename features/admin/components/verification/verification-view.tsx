"use client";

import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel, StatCard } from "@/components/ui/data-display";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster, toast } from "@/components/ui/toast";
import { tablePanelPadding } from "@/features/admin/components/table-styles";
import { UserCell } from "@/features/admin/components/users/user-cell";
import { CheckChips } from "@/features/admin/components/verification/check-chip";
import {
  type Decision,
  ReviewDialog,
} from "@/features/admin/components/verification/review-dialog";
import {
  rejectionReasons,
  type VerificationItem,
  verificationQueue,
  verificationStats,
} from "@/lib/demo-data/admin/verification";
import { cn } from "@/lib/utils";

function possessive(name: string) {
  return name.endsWith("s") ? `${name}’` : `${name}’s`;
}

function docName(item: VerificationItem) {
  return item.document.startsWith("Vehicle: ")
    ? item.document.slice("Vehicle: ".length)
    : item.document.charAt(0).toLowerCase() + item.document.slice(1);
}

export function VerificationView() {
  const [queue, setQueue] = useState(verificationQueue);
  const [pending, setPending] = useState(verificationStats.pending);
  const [reviewing, setReviewing] = useState<VerificationItem | null>(null);

  function decide(item: VerificationItem, d: Decision) {
    setQueue((prev) => prev.filter((i) => i.id !== item.id));
    setPending((n) => n - 1);
    const what = `${possessive(item.user)} ${docName(item)}`;
    if (d.kind === "approve") {
      toast.add({ type: "success", title: `Approved ${what}` });
    } else {
      const reason = rejectionReasons.find((r) => r.value === d.reason)?.label;
      toast.add({
        type: "success",
        title:
          d.kind === "reject"
            ? `Rejected ${what}`
            : `Asked ${item.user} for a new upload`,
        description: `${reason}. We emailed them your message.`,
      });
    }
  }

  return (
    <Toaster>
      <PageHeader
        title="Verification"
        description="Documents waiting for review. Target time: under 24 hours."
      />

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Pending" value={pending} className="max-sm:p-4" />
          <StatCard
            label="Avg review time"
            value={verificationStats.avgReview}
            className="max-sm:p-4"
          />
          <StatCard
            label="Approved this month"
            value={verificationStats.approvedRate}
            className="max-sm:p-4"
          />
        </div>

        {queue.length === 0 ? (
          <EmptyState
            icon={CheckmarkBadge01Icon}
            title="You’re all caught up"
            description="New uploads show up here as soon as they arrive."
          />
        ) : (
          <>
            <Panel className={tablePanelPadding}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {[
                      "User",
                      "Document",
                      "Uploaded",
                      "Waiting",
                      "Auto-check",
                    ].map((c) => (
                      <TableHead
                        key={c}
                        className="font-normal text-muted-foreground"
                      >
                        {c}
                      </TableHead>
                    ))}
                    <TableHead className="w-20">
                      <span className="sr-only">Review</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.map((item) => (
                    <TableRow key={item.id} className="hover:bg-transparent">
                      <TableCell className="py-3">
                        <UserCell
                          name={item.user}
                          href={
                            item.userId
                              ? `/admin/users/${item.userId}`
                              : undefined
                          }
                        />
                      </TableCell>
                      <TableCell className="py-3">{item.document}</TableCell>
                      <TableCell className="py-3 whitespace-nowrap text-muted-foreground">
                        {item.uploaded}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-3 whitespace-nowrap tabular-nums",
                          item.overdue &&
                            "font-medium text-amber-800 dark:text-amber-400",
                        )}
                      >
                        {item.waiting}
                      </TableCell>
                      <TableCell className="py-3 whitespace-normal">
                        <CheckChips checks={item.checks} />
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewing(item)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>

            <div className="flex flex-col gap-3 md:hidden">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <UserCell
                      name={item.user}
                      href={
                        item.userId ? `/admin/users/${item.userId}` : undefined
                      }
                      sub={item.document}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => setReviewing(item)}
                    >
                      Review
                    </Button>
                  </div>
                  <CheckChips checks={item.checks} />
                  <p className="text-sm text-muted-foreground">
                    Uploaded {item.uploaded} ·{" "}
                    <span
                      className={cn(
                        item.overdue &&
                          "font-medium text-amber-800 dark:text-amber-400",
                      )}
                    >
                      waiting {item.waiting}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ReviewDialog
        item={reviewing}
        onClose={() => setReviewing(null)}
        onDecide={decide}
      />
    </Toaster>
  );
}
