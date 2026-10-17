"use client";

import {
  InformationCircleIcon,
  Mail01Icon,
  StarIcon,
  UndoIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { EmptyState, Stars, StatusBadge } from "@/components/ui/data-display";
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
import { ContactDialog } from "@/features/admin/components/reviews/contact-dialog";
import {
  recordTable,
  tabScroller,
} from "@/features/admin/components/table-styles";
import {
  type AdminReview,
  reviews as initialReviews,
  type ReviewStatus,
  reviewTone,
} from "@/lib/demo-data/admin/reviews";
import { cn } from "@/lib/utils";

const tabs: {
  value: string;
  label: (rows: AdminReview[]) => string;
  filter: (r: AdminReview) => boolean;
}[] = [
  { value: "all", label: () => "All", filter: () => true },
  { value: "5", label: () => "5★", filter: (r) => r.rating === 5 },
  { value: "4", label: () => "4★", filter: (r) => r.rating === 4 },
  { value: "3", label: () => "3★ and below", filter: (r) => r.rating <= 3 },
  {
    value: "flagged",
    label: (rows) =>
      `Flagged (${rows.filter((r) => r.status === "Flagged").length})`,
    filter: (r) => r.status === "Flagged",
  },
  {
    value: "hidden",
    label: () => "Hidden",
    filter: (r) => r.status === "Hidden",
  },
];

function statusText(r: AdminReview) {
  return r.status === "Visible" && r.inDispute
    ? "Visible · in dispute"
    : r.status;
}

function Comment({ review }: { review: AdminReview }) {
  const [shown, setShown] = useState(false);
  const { sensitive } = review;

  return (
    <span className="flex flex-col items-start gap-1">
      {sensitive ? (
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-muted-foreground italic">
            {shown ? sensitive.redacted : sensitive.label}
          </span>
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            className="text-xs font-medium underline underline-offset-4 outline-none hover:text-foreground focus-visible:text-foreground"
          >
            {shown ? "Hide content" : "Show content"}
          </button>
        </span>
      ) : (
        <span className="text-pretty">{review.comment}</span>
      )}
      {review.flagReason && (
        <span className="text-xs text-muted-foreground">
          {review.status === "Hidden" ? "Hidden" : "Flagged"}:{" "}
          {review.flagReason}
        </span>
      )}
    </span>
  );
}

function ReviewMenu({
  review,
  onStatus,
  onContact,
}: {
  review: AdminReview;
  onStatus: (status: ReviewStatus) => void;
  onContact: () => void;
}) {
  return (
    <RowMenu label={`Actions for review from ${review.from}`}>
      {review.status !== "Hidden" && (
        <DropdownMenuItem onClick={() => onStatus("Hidden")}>
          <HugeiconsIcon icon={ViewOffSlashIcon} strokeWidth={2} />
          Hide review
        </DropdownMenuItem>
      )}
      {review.status !== "Visible" && (
        <DropdownMenuItem onClick={() => onStatus("Visible")}>
          <HugeiconsIcon icon={UndoIcon} strokeWidth={2} />
          Restore
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onContact}
        disabled={review.from === "Unknown user"}
      >
        <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
        Contact reviewer
      </DropdownMenuItem>
    </RowMenu>
  );
}

function ReviewTable({
  rows,
  menu,
}: {
  rows: AdminReview[];
  menu: (r: AdminReview) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={StarIcon}
        title="No reviews here"
        description="Reviews you hide or that get flagged show up in their own tab."
      />
    );
  }

  return (
    <>
      <div className={recordTable.panel}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={recordTable.head}>From</TableHead>
              <TableHead className={recordTable.head}>To</TableHead>
              <TableHead className={recordTable.head}>Job</TableHead>
              <TableHead className={recordTable.head}>Rating</TableHead>
              <TableHead className={recordTable.head}>Comment</TableHead>
              <TableHead className={recordTable.head}>Date</TableHead>
              <TableHead className={recordTable.head}>Status</TableHead>
              <TableHead className={cn(recordTable.head, "w-12")}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                className={cn(
                  recordTable.row,
                  r.status === "Hidden" && "text-muted-foreground",
                )}
              >
                <TableCell className={recordTable.cell}>{r.from}</TableCell>
                <TableCell className={recordTable.cell}>{r.to}</TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "text-muted-foreground tabular-nums",
                  )}
                >
                  {r.job}
                </TableCell>
                <TableCell className={recordTable.cell}>
                  <Stars value={r.rating} />
                </TableCell>
                <TableCell
                  className={cn(
                    recordTable.cell,
                    "max-w-72 min-w-56 whitespace-normal",
                  )}
                >
                  <Comment review={r} />
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
                  <StatusBadge tone={reviewTone[r.status]}>
                    {statusText(r)}
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
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {r.from} <span className="text-muted-foreground">to</span>{" "}
                  {r.to}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {r.job} · {r.date}
                </span>
              </span>
              <div className="-mt-1 -mr-1">{menu(r)}</div>
            </div>
            <Stars value={r.rating} />
            <div className="text-sm">
              <Comment review={r} />
            </div>
            <StatusBadge tone={reviewTone[r.status]}>
              {statusText(r)}
            </StatusBadge>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ReviewsView() {
  const [rows, setRows] = useState(initialReviews);
  const [contacting, setContacting] = useState<AdminReview | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const setStatus = (id: string, status: ReviewStatus) =>
    setRows((current) =>
      current.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              // Restoring clears the flag; hiding keeps the reason on record.
              flagReason: status === "Visible" ? undefined : r.flagReason,
            }
          : r,
      ),
    );

  const menu = (r: AdminReview) => (
    <ReviewMenu
      review={r}
      onStatus={(status) => setStatus(r.id, status)}
      onContact={() => {
        setContacting(r);
        setContactOpen(true);
      }}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          strokeWidth={2}
          className="size-4 shrink-0"
        />
        Reviews can only be left after a completed job.
      </p>

      <Tabs defaultValue="all" className="gap-4">
        <div className={tabScroller}>
          <TabsList className="group-data-horizontal/tabs:h-9">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3">
                {tab.label(rows)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ReviewTable rows={rows.filter(tab.filter)} menu={menu} />
          </TabsContent>
        ))}
      </Tabs>

      <ContactDialog
        review={contacting}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </div>
  );
}
