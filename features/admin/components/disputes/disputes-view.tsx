"use client";

import {
  Alert02Icon,
  Message01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  EmptyState,
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
import { RowMenu } from "@/features/admin/components/marketplace/table-kit";
import {
  recordTable,
  tabScroller,
} from "@/features/admin/components/table-styles";
import {
  type Dispute,
  type DisputeStatus,
  disputeStats,
  disputes as initialDisputes,
  priorityTone,
} from "@/lib/demo-data/admin/disputes";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs: { value: DisputeStatus; showCount: boolean }[] = [
  { value: "Open", showCount: true },
  { value: "Waiting on user", showCount: true },
  { value: "Resolved", showCount: false },
  { value: "Closed", showCount: false },
];

function DisputeMenu({
  dispute,
  onAsk,
}: {
  dispute: Dispute;
  onAsk: (who: string) => void;
}) {
  const active = dispute.status === "Open";
  return (
    <RowMenu label={`Actions for ${dispute.id}`} menuClassName="w-56">
      <DropdownMenuItem
        render={<Link href={`/admin/disputes/${dispute.id}`} />}
      >
        <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
        View dispute
      </DropdownMenuItem>
      {active && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAsk(dispute.openedBy)}>
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
            Ask {dispute.openedBy} for more
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAsk(dispute.against)}>
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
            Ask {dispute.against} for more
          </DropdownMenuItem>
        </>
      )}
    </RowMenu>
  );
}

function JobCell({ dispute }: { dispute: Dispute }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-medium">{dispute.job.item}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {dispute.job.ref}
      </span>
    </span>
  );
}

function DisputeTable({
  rows,
  onAsk,
}: {
  rows: Dispute[];
  onAsk: (id: string, who: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Alert02Icon}
        title="No disputes here"
        description="Disputes will show up here as their status changes."
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
              <TableHead className={recordTable.head}>Job</TableHead>
              <TableHead className={recordTable.head}>Opened by</TableHead>
              <TableHead className={recordTable.head}>Against</TableHead>
              <TableHead className={recordTable.head}>Reason</TableHead>
              <TableHead className={cn(recordTable.head, "text-right")}>
                Amount
              </TableHead>
              <TableHead className={recordTable.head}>Opened</TableHead>
              <TableHead className={recordTable.head}>Priority</TableHead>
              <TableHead className={cn(recordTable.head, "w-12")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((d) => (
              <TableRow key={d.id} className={recordTable.row}>
                <TableCell className={cn(recordTable.cell, "tabular-nums")}>
                  <Link
                    href={`/admin/disputes/${d.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {d.id}
                  </Link>
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <JobCell dispute={d} />
                </TableCell>
                <TableCell className={recordTable.cell}>{d.openedBy}</TableCell>
                <TableCell className={recordTable.cell}>{d.against}</TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "max-w-48 whitespace-normal text-muted-foreground",
                  )}
                >
                  {d.waitingOn ? (
                    <span className="flex flex-col gap-0.5">
                      {d.reason}
                      <span className="text-xs">Waiting on {d.waitingOn}</span>
                    </span>
                  ) : d.outcome ? (
                    <span className="flex flex-col gap-0.5">
                      {d.reason}
                      <span className="text-xs">{d.outcome}</span>
                    </span>
                  ) : (
                    d.reason
                  )}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-right font-medium tabular-nums",
                  )}
                >
                  {formatUsd(d.amount)}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-muted-foreground tabular-nums",
                  )}
                >
                  {d.opened}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <StatusBadge tone={priorityTone[d.priority]}>
                    {d.priority}
                  </StatusBadge>
                </TableCell>
                <TableCell className="px-2 py-2 text-right">
                  <DisputeMenu dispute={d} onAsk={(who) => onAsk(d.id, who)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {rows.map((d) => (
          <li
            key={d.id}
            className="relative flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/admin/disputes/${d.id}`}
                className="flex flex-col gap-0.5"
              >
                <span className="font-medium">{d.job.item}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {d.id} · {d.job.ref} · {d.opened}
                </span>
              </Link>
              <div className="-mt-1 -mr-1">
                <DisputeMenu dispute={d} onAsk={(who) => onAsk(d.id, who)} />
              </div>
            </div>
            <p className="text-sm">
              {d.openedBy}{" "}
              <span className="text-muted-foreground">against</span> {d.against}
              <span className="block text-muted-foreground">
                {d.waitingOn ? `Waiting on ${d.waitingOn}` : d.reason}
              </span>
            </p>
            <div className="flex items-center justify-between gap-3">
              <StatusBadge tone={priorityTone[d.priority]}>
                {d.priority}
              </StatusBadge>
              <span className="font-medium tabular-nums">
                {formatUsd(d.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function DisputesView() {
  const [rows, setRows] = useState(initialDisputes);

  const ask = (id: string, who: string) =>
    setRows((current) =>
      current.map((d) =>
        d.id === id
          ? { ...d, status: "Waiting on user", waitingOn: `${who} to reply` }
          : d,
      ),
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {disputeStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <Tabs defaultValue="Open" className="gap-4">
        <div className={tabScroller}>
          <TabsList className="group-data-horizontal/tabs:h-9">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3">
                {tab.value}
                {tab.showCount &&
                  ` (${rows.filter((d) => d.status === tab.value).length})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <DisputeTable
              rows={rows.filter((d) => d.status === tab.value)}
              onAsk={ask}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
