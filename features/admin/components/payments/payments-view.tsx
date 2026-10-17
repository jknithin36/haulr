"use client";

import {
  Calendar03Icon,
  Download04Icon,
  InformationCircleIcon,
  MoneyReceive01Icon,
  PauseIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  EmptyState,
  Panel,
  StatCard,
  StatusBadge,
} from "@/components/ui/data-display";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadFile } from "@/features/admin/admin-download";
import { RowMenu } from "@/features/admin/components/marketplace/table-kit";
import { RefundDialog } from "@/features/admin/components/payments/refund-dialog";
import {
  recordTable,
  tabScroller,
} from "@/features/admin/components/table-styles";
import {
  formatUsdCents,
  transactions as initialTransactions,
  isRefundable,
  paymentSummary,
  payoutSchedule,
  refundApprovalLimit,
  statusLabel,
  type Transaction,
  transactionTone,
} from "@/lib/demo-data/admin/payments";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "all", label: "Transactions", filter: () => true },
  {
    value: "payouts",
    label: "Payouts",
    filter: (t: Transaction) => t.type === "Payout",
  },
  {
    value: "refunds",
    label: "Refunds",
    filter: (t: Transaction) => t.type === "Refund",
  },
  {
    value: "failed",
    label: "Failed",
    filter: (t: Transaction) => t.status === "Failed",
  },
] as const;

function downloadStatement(t: Transaction) {
  const lines = [
    "Haulr transaction statement",
    "",
    `Transaction: ${t.id}`,
    `Date: ${t.date}, 2026`,
    `Type: ${t.type}`,
    `User: ${t.user}`,
    `Reference: ${t.job}`,
    `Amount: ${formatUsdCents(t.amount)}`,
    `Status: ${statusLabel(t)}`,
  ];
  downloadFile(lines.join("\n"), `${t.id}-statement.txt`, "text/plain");
}

function TransactionMenu({
  row,
  onRetry,
  onHold,
  onRefund,
}: {
  row: Transaction;
  onRetry: () => void;
  onHold: () => void;
  onRefund: () => void;
}) {
  const payout = row.type === "Payout";
  return (
    <RowMenu label={`Actions for ${row.id}`}>
      {payout && row.status === "Failed" && (
        <DropdownMenuItem onClick={onRetry}>
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
          Retry payout
        </DropdownMenuItem>
      )}
      {payout && row.status !== "Failed" && (
        <DropdownMenuItem
          onClick={onHold}
          disabled={row.status === "Sent" || row.status === "On hold"}
        >
          <HugeiconsIcon icon={PauseIcon} strokeWidth={2} />
          {row.status === "On hold" ? "Payout on hold" : "Hold payout"}
        </DropdownMenuItem>
      )}
      {!payout && (
        <DropdownMenuItem onClick={onRefund} disabled={!isRefundable(row)}>
          <HugeiconsIcon icon={MoneyReceive01Icon} strokeWidth={2} />
          Issue refund
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => downloadStatement(row)}>
        <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
        Download statement
      </DropdownMenuItem>
    </RowMenu>
  );
}

function TransactionTable({
  rows,
  actions,
}: {
  rows: Transaction[];
  actions: (row: Transaction) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={MoneyReceive01Icon}
        title="Nothing here"
        description="No transactions match this view right now."
      />
    );
  }

  return (
    <>
      <div className={recordTable.panel}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={recordTable.head}>ID</TableHead>
              <TableHead className={recordTable.head}>Date</TableHead>
              <TableHead className={recordTable.head}>Type</TableHead>
              <TableHead className={recordTable.head}>User</TableHead>
              <TableHead className={recordTable.head}>Job</TableHead>
              <TableHead className={cn(recordTable.head, "text-right")}>
                Amount
              </TableHead>
              <TableHead className={recordTable.head}>Status</TableHead>
              <TableHead className={cn(recordTable.head, "w-12")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={recordTable.row}>
                <TableCell
                  className={cn(recordTable.cell, "font-medium tabular-nums")}
                >
                  {row.id}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-muted-foreground tabular-nums",
                  )}
                >
                  {row.date}
                </TableCell>
                <TableCell className={recordTable.cell}>{row.type}</TableCell>
                <TableCell className={recordTable.cell}>{row.user}</TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-muted-foreground tabular-nums",
                  )}
                >
                  {row.job}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-right font-medium tabular-nums",
                  )}
                >
                  {formatUsdCents(row.amount)}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <StatusBadge tone={transactionTone[row.status]}>
                    {statusLabel(row)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="px-2 py-2 text-right">
                  {actions(row)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{row.user}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {row.type} · {row.job} · {row.id}
                </span>
              </span>
              <div className="-mt-1 -mr-1">{actions(row)}</div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <StatusBadge tone={transactionTone[row.status]}>
                {statusLabel(row)}
              </StatusBadge>
              <span className="flex flex-col items-end">
                <span className="font-medium tabular-nums">
                  {formatUsdCents(row.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.date}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function PaymentsView() {
  const [rows, setRows] = useState(initialTransactions);
  const [refundFor, setRefundFor] = useState<Transaction | null>(null);
  const [refundOpen, setRefundOpen] = useState(false);

  const failed = rows.filter((t) => t.status === "Failed");
  const failedTotal = failed.reduce((sum, t) => sum + t.amount, 0);

  const update = (id: string, patch: Partial<Transaction>) =>
    setRows((current) =>
      current.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );

  const issueRefund = (source: Transaction, amount: number) => {
    const needsApproval = amount > refundApprovalLimit;
    setRows((current) => {
      const next = Math.max(
        ...current.map((t) => Number(t.id.replace("TXN-", ""))),
      );
      const refund: Transaction = {
        id: `TXN-${next + 1}`,
        date: "Oct 17",
        type: "Refund",
        user: source.user,
        job: source.job,
        amount,
        status: needsApproval ? "Pending approval" : "Refunded",
      };
      return [refund, ...current];
    });
  };

  const actions = (row: Transaction) => (
    <TransactionMenu
      row={row}
      onRetry={() =>
        update(row.id, { status: "Sent · pending", reason: undefined })
      }
      onHold={() => update(row.id, { status: "On hold", reason: undefined })}
      onRefund={() => {
        setRefundFor(row);
        setRefundOpen(true);
      }}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-muted-foreground">Month to date</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {paymentSummary.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
          <StatCard
            label="Failed payouts"
            value={failed.length}
            hint={
              failed.length > 0
                ? `${formatUsd(failedTotal)} to resend`
                : "All payouts sent"
            }
            className="col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-5"
            />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Payout schedule</p>
            <p className="text-sm text-muted-foreground tabular-nums">
              {payoutSchedule.cadence} · next run {payoutSchedule.nextRun} ·{" "}
              {payoutSchedule.drivers} drivers · {payoutSchedule.queued} queued
            </p>
          </div>
        </Panel>
        <Panel className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={2}
              className="size-5"
            />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Refund approvals</p>
            <p className="text-sm text-muted-foreground">
              Refunds over $500 need a second admin to approve.
            </p>
          </div>
        </Panel>
      </div>

      <Tabs defaultValue="all" className="gap-4">
        <div className={tabScroller}>
          <TabsList className="group-data-horizontal/tabs:h-9">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <TransactionTable
              rows={rows.filter(tab.filter)}
              actions={actions}
            />
          </TabsContent>
        ))}
      </Tabs>

      <RefundDialog
        source={refundFor}
        open={refundOpen}
        onOpenChange={setRefundOpen}
        onConfirm={issueRefund}
      />
    </div>
  );
}
