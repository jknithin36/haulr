"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { RouteLabel } from "@/components/ui/route-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobSheet } from "@/features/admin/components/jobs/job-sheet";
import {
  type JobState,
  JobStatus,
} from "@/features/admin/components/jobs/job-status";
import { MessageDialog } from "@/features/admin/components/marketplace/detail-kit";
import {
  EmptyRows,
  MobileCard,
  RowMenu,
  StatusTabs,
  TablePanel,
  Th,
} from "@/features/admin/components/marketplace/table-kit";
import {
  adminJobs,
  type JobPerson,
  type JobTab,
  jobTabs,
} from "@/lib/demo-data/admin/jobs";
import { firstName } from "@/lib/format";

export function JobsView() {
  const [jobs, setJobs] = useState<JobState[]>(adminJobs);
  const [tab, setTab] = useState<JobTab>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<{
    person: JobPerson;
    role: string;
  } | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const shown = jobs.filter((j) => tab === "All" || j.status === tab);
  const openJob = jobs.find((j) => j.id === openId) ?? null;

  const update = (id: string, patch: (j: JobState) => Partial<JobState>) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, ...patch(j) } : j)));

  function message(person: JobPerson, role: string) {
    setMessaging({ person, role });
    setMessageOpen(true);
  }

  const menu = (j: JobState) => (
    <RowMenu label={`Actions for ${j.id}`}>
      <DropdownMenuItem onClick={() => setOpenId(j.id)}>
        View details
      </DropdownMenuItem>
      <DropdownMenuItem
        render={<Link href={`/admin/shipments/${j.shipmentId}`} />}
      >
        View shipment
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => message(j.driver, "Driver")}>
        Message driver
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => message(j.shipper, "Shipper")}>
        Message shipper
      </DropdownMenuItem>
    </RowMenu>
  );

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Every booked job from pickup to delivery."
      />

      <div className="flex flex-col gap-4">
        <StatusTabs tabs={jobTabs} value={tab} onChange={setTab} />

        {shown.length === 0 ? (
          <EmptyRows>No {tab.toLowerCase()} jobs to show.</EmptyRows>
        ) : (
          <>
            <TablePanel>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <Th>Job</Th>
                    <Th>Item</Th>
                    <Th>Driver</Th>
                    <Th>Shipper</Th>
                    <Th>Route</Th>
                    <Th>Expected</Th>
                    <Th>Status</Th>
                    <Th className="w-10">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((j) => (
                    <TableRow
                      key={j.id}
                      onClick={() => setOpenId(j.id)}
                      className="cursor-pointer hover:bg-background/60"
                    >
                      <TableCell className="py-3 text-muted-foreground tabular-nums">
                        {j.id}
                      </TableCell>
                      <TableCell className="py-3 font-medium">
                        {j.item}
                      </TableCell>
                      <TableCell className="py-3">{j.driver.name}</TableCell>
                      <TableCell className="py-3">{j.shipper.name}</TableCell>
                      <TableCell className="py-3 text-muted-foreground">
                        <RouteLabel
                          from={j.from}
                          to={j.to}
                          truncate
                          arrowClassName="opacity-60"
                        />
                      </TableCell>
                      <TableCell className="py-3 tabular-nums">
                        {j.expected}
                      </TableCell>
                      <TableCell className="py-3">
                        <JobStatus job={j} />
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {menu(j)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TablePanel>

            <div className="flex flex-col gap-3 md:hidden">
              {shown.map((j) => (
                <MobileCard
                  key={j.id}
                  onOpen={() => setOpenId(j.id)}
                  menu={menu(j)}
                >
                  <div className="flex items-center gap-2 pr-8">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {j.id}
                    </span>
                    <JobStatus job={j} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium">{j.item}</p>
                    <RouteLabel
                      truncate
                      arrowClassName="opacity-60"
                      from={j.from}
                      to={j.to}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {j.driver.name} for {j.shipper.name} · expected {j.expected}
                  </p>
                </MobileCard>
              ))}
            </div>
          </>
        )}
      </div>

      <JobSheet
        job={openJob}
        onOpenChange={(o) => !o && setOpenId(null)}
        onMessage={message}
        onRefund={(job, amount) =>
          update(job.id, (j) => ({
            refund: amount,
            activity: [
              ...j.activity,
              {
                label: `Partial refund of $${amount} to ${j.shipper.name}`,
                time: "Just now",
                by: "Nithin Kumar",
              },
            ],
          }))
        }
        onReassign={(job, driver) =>
          update(job.id, (j) => ({
            driver: {
              name: driver.name,
              email: driver.email,
              phone: driver.phone,
            },
            activity: [
              ...j.activity,
              {
                label: `Reassigned from ${j.driver.name} to ${driver.name}`,
                time: "Just now",
                by: "Nithin Kumar",
              },
            ],
          }))
        }
      />

      <MessageDialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        to={messaging && { name: messaging.person.name, role: messaging.role }}
        placeholder={`Hi ${messaging ? firstName(messaging.person.name) : ""}, `}
      />
    </>
  );
}
