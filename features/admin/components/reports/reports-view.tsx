"use client";

import { Flag02Icon, UndoIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
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
  canRemove,
  type ReportAction,
  ReportSheet,
  reportActions,
} from "@/features/admin/components/reports/report-sheet";
import {
  recordTable,
  tabScroller,
} from "@/features/admin/components/table-styles";
import {
  reports as initialReports,
  type Report,
  type ReportState,
  reportStatus,
  reportTone,
} from "@/lib/demo-data/admin/reports";
import { cn } from "@/lib/utils";

function apply(r: Report, action: ReportAction): Report {
  switch (action) {
    case "remove":
      return { ...r, state: "Resolved", outcome: "removed" };
    case "warn":
      return { ...r, state: "Resolved", outcome: "warned" };
    case "suspend":
      return { ...r, state: "Resolved", outcome: "suspended" };
    case "dismiss":
      return { ...r, state: "Dismissed", outcome: undefined };
    case "reopen":
      return { ...r, state: "Open", outcome: undefined };
  }
}

function ReportMenu({
  report,
  onView,
  onAction,
}: {
  report: Report;
  onView: () => void;
  onAction: (action: ReportAction) => void;
}) {
  return (
    <RowMenu label={`Actions for ${report.id}`}>
      <DropdownMenuItem onClick={onView}>
        <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
        View report
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {report.state === "Open" ? (
        reportActions
          .filter((a) => a.action !== "remove" || canRemove(report))
          .map((a) => (
            <DropdownMenuItem
              key={a.action}
              onClick={() => onAction(a.action)}
              variant={a.action === "suspend" ? "destructive" : "default"}
            >
              <HugeiconsIcon icon={a.icon} strokeWidth={2} />
              {a.label}
            </DropdownMenuItem>
          ))
      ) : (
        <DropdownMenuItem onClick={() => onAction("reopen")}>
          <HugeiconsIcon icon={UndoIcon} strokeWidth={2} />
          Reopen report
        </DropdownMenuItem>
      )}
    </RowMenu>
  );
}

function ReportTable({
  rows,
  onView,
  onAction,
}: {
  rows: Report[];
  onView: (id: string) => void;
  onAction: (id: string, action: ReportAction) => void;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Flag02Icon}
        title="Nothing here"
        description="Reports move here once they’re handled."
      />
    );
  }

  const menu = (r: Report) => (
    <ReportMenu
      report={r}
      onView={() => onView(r.id)}
      onAction={(a) => onAction(r.id, a)}
    />
  );

  return (
    <>
      <div className={recordTable.panel}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={recordTable.head}>ID</TableHead>
              <TableHead className={recordTable.head}>Type</TableHead>
              <TableHead className={recordTable.head}>Reported item</TableHead>
              <TableHead className={recordTable.head}>Reason</TableHead>
              <TableHead className={recordTable.head}>Reported by</TableHead>
              <TableHead className={recordTable.head}>Date</TableHead>
              <TableHead className={recordTable.head}>Status</TableHead>
              <TableHead className={cn(recordTable.head, "w-12")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className={recordTable.row}>
                <TableCell className={cn(recordTable.cell, "tabular-nums")}>
                  <button
                    type="button"
                    onClick={() => onView(r.id)}
                    className="font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    {r.id}
                  </button>
                </TableCell>
                <TableCell
                  className={cn(recordTable.cell, "text-muted-foreground")}
                >
                  {r.type}
                </TableCell>
                <TableCell
                  className={cn(recordTable.cell, "max-w-56 whitespace-normal")}
                >
                  {r.item}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "max-w-52 whitespace-normal text-muted-foreground",
                  )}
                >
                  {r.reason}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  {r.reportedBy}
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-muted-foreground tabular-nums",
                  )}
                >
                  {r.date}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <StatusBadge tone={reportTone[r.state]}>
                    {reportStatus(r)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="px-2 py-2 text-right">
                  {menu(r)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onView(r.id)}
                className="flex flex-col gap-0.5 text-left outline-none"
              >
                <span className="font-medium">{r.item}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {r.id} · {r.type} · {r.date}
                </span>
              </button>
              <div className="-mt-1 -mr-1">{menu(r)}</div>
            </div>
            <p className="text-sm">
              {r.reason}
              <span className="block text-muted-foreground">
                Reported by {r.reportedBy}
              </span>
            </p>
            <StatusBadge tone={reportTone[r.state]}>
              {reportStatus(r)}
            </StatusBadge>
          </li>
        ))}
      </ul>
    </>
  );
}

const tabs: ReportState[] = ["Open", "Resolved", "Dismissed"];

export function ReportsView() {
  const [rows, setRows] = useState(initialReports);
  const [viewing, setViewing] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const act = (id: string, action: ReportAction) =>
    setRows((current) =>
      current.map((r) => (r.id === id ? apply(r, action) : r)),
    );

  const view = (id: string) => {
    setViewing(id);
    setSheetOpen(true);
  };

  const openCount = rows.filter((r) => r.state === "Open").length;

  return (
    <>
      <Tabs defaultValue="Open" className="gap-4">
        <div className={tabScroller}>
          <TabsList className="group-data-horizontal/tabs:h-9">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="px-3">
                {tab === "Open" ? `Open (${openCount})` : tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <ReportTable
              rows={rows.filter((r) => r.state === tab)}
              onView={view}
              onAction={act}
            />
          </TabsContent>
        ))}
      </Tabs>

      <ReportSheet
        report={rows.find((r) => r.id === viewing) ?? null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAction={(action) => viewing && act(viewing, action)}
      />
    </>
  );
}
