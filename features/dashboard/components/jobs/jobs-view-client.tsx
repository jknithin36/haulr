"use client";

import { ArrowRight01Icon, TaskDone01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { MutedTableHead } from "@/features/dashboard/components/dashboard-table";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import { JobSheet } from "@/features/dashboard/components/jobs/job-sheet";
import type { Photo } from "@/features/dashboard/components/jobs/photo-uploader";
import {
  type Job,
  type JobStatus,
  jobTone,
} from "@/lib/demo-data/dashboard/jobs";
import { formatUsd } from "@/lib/format";

const tabs = [
  { value: "upcoming", label: "Upcoming", status: "Scheduled" },
  { value: "progress", label: "In progress", status: "In progress" },
  { value: "completed", label: "Completed", status: "Completed" },
] as const satisfies { value: string; label: string; status: JobStatus }[];

type TabValue = (typeof tabs)[number]["value"];

export function JobsViewClient({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [tab, setTab] = useState<TabValue>("upcoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  const status = tabs.find((t) => t.value === tab)?.status;
  const shown = jobs.filter((j) => j.status === status);
  const open = jobs.find((j) => j.id === openId) ?? null;

  function setStatus(id: string, next: JobStatus) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: next } : j)),
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-5">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <DashboardTabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3">
                {t.label} ({jobs.filter((j) => j.status === t.status).length})
              </TabsTrigger>
            ))}
          </DashboardTabsList>
        </Tabs>

        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {shown.length === 0 ? (
            <EmptyState
              icon={TaskDone01Icon}
              title={
                tab === "progress" ? "Nothing on the road" : "No jobs here yet"
              }
              description={
                tab === "progress"
                  ? "Jobs show up here once you mark them picked up."
                  : "Jobs appear here when a shipper accepts your offer."
              }
            />
          ) : (
            <>
              <JobsTable jobs={shown} onOpen={setOpenId} />
              <div className="flex flex-col gap-3 md:hidden">
                {shown.map((j) => (
                  <JobCard key={j.id} job={j} onOpen={setOpenId} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <JobSheet
        job={open}
        onOpenChange={(o) => !o && setOpenId(null)}
        photos={open ? (photos[open.id] ?? []) : []}
        onPhotosChange={(id, next) =>
          setPhotos((prev) => ({ ...prev, [id]: next }))
        }
        onStatusChange={setStatus}
      />
    </MotionConfig>
  );
}

function JobsTable({
  jobs,
  onOpen,
}: {
  jobs: Job[];
  onOpen: (id: string) => void;
}) {
  return (
    <Table className="max-md:hidden">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <MutedTableHead className="pl-0">Job</MutedTableHead>
          <MutedTableHead>Item</MutedTableHead>
          <MutedTableHead>Route</MutedTableHead>
          <MutedTableHead>Pickup</MutedTableHead>
          <MutedTableHead className="text-right">Pay</MutedTableHead>
          <MutedTableHead className="pl-6">Status</MutedTableHead>
          <MutedTableHead className="w-8 pr-0">
            <span className="sr-only">Open</span>
          </MutedTableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((j) => (
          <TableRow
            key={j.id}
            onClick={() => onOpen(j.id)}
            className="group cursor-pointer hover:bg-transparent"
          >
            <TableCell className="py-4 pl-0 text-muted-foreground tabular-nums">
              {j.id}
            </TableCell>
            <TableCell className="py-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(j.id);
                }}
                className="rounded-sm font-medium underline-offset-4 outline-none group-hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {j.item}
              </button>
            </TableCell>
            <TableCell className="py-4 text-muted-foreground">
              <RouteLabel
                from={j.from}
                to={j.to}
                truncate
                arrowClassName="opacity-60"
              />
            </TableCell>
            <TableCell className="py-4">{j.pickup}</TableCell>
            <TableCell className="py-4 text-right font-medium tabular-nums">
              {formatUsd(j.pay)}
            </TableCell>
            <TableCell className="py-4 pl-6">
              <StatusBadge tone={jobTone[j.status]}>{j.status}</StatusBadge>
            </TableCell>
            <TableCell className="py-4 pr-0 text-muted-foreground">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function JobCard({
  job: j,
  onOpen,
}: {
  job: Job;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(j.id)}
      className="flex w-full flex-col gap-3 rounded-2xl bg-muted/50 p-4 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex w-full items-center justify-between gap-3">
        <StatusBadge tone={jobTone[j.status]}>{j.status}</StatusBadge>
        <span className="text-xs text-muted-foreground tabular-nums">
          {j.id}
        </span>
      </span>
      <span className="flex w-full items-baseline justify-between gap-3">
        <span className="font-medium">{j.item}</span>
        <span className="font-medium tabular-nums">{formatUsd(j.pay)}</span>
      </span>
      <span className="flex flex-col gap-1 text-muted-foreground">
        <RouteLabel
          from={j.from}
          to={j.to}
          truncate
          arrowClassName="opacity-60"
        />
        <span>Pickup {j.pickup}</span>
      </span>
    </button>
  );
}
