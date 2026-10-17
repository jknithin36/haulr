"use client";

import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Panel, StatusBadge } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { PageHeader } from "@/components/ui/page-header";
import { EvidencePhotos } from "@/features/admin/components/disputes/evidence-photos";
import {
  describeResolution,
  type Resolution,
  ResolutionForm,
} from "@/features/admin/components/disputes/resolution-form";
import { adminUser } from "@/lib/demo-data/admin/admin-user";
import {
  type Dispute,
  disputeTone,
  pianoCase,
  priorityTone,
} from "@/lib/demo-data/admin/disputes";
import { firstName, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-medium">{children}</h2>;
}

function Statement({
  name,
  role,
  label,
  text,
}: {
  name: string;
  role: string;
  label: string;
  text?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background p-4">
      <div className="flex items-center gap-3">
        <GradientAvatar seed={name} className="size-8" />
        <p className="flex flex-col text-sm leading-tight">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">{role}</span>
        </p>
      </div>
      {text ? (
        <blockquote className="text-pretty">“{text}”</blockquote>
      ) : (
        <p className="text-sm text-muted-foreground">
          {name} hasn’t responded yet.
        </p>
      )}
    </div>
  );
}

function roles(d: Dispute) {
  return d.openedByDriver
    ? { opener: "Driver", other: "Shipper" }
    : { opener: "Shipper", other: "Driver" };
}

function possessive(name: string) {
  return `${name}’s`;
}

function Timeline({
  items,
  current,
}: {
  items: { label: string; time: string }[];
  current: { label: string; done?: boolean };
}) {
  return (
    <ol className="flex flex-col">
      {[...items, { label: current.label, time: "" }].map((item, i, all) => {
        const last = i === all.length - 1;
        return (
          <li key={item.label} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className="absolute top-3 left-[3.5px] h-full w-px bg-border"
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative mt-1.5 size-2 shrink-0 rounded-full",
                last && !current.done
                  ? "bg-amber-500"
                  : last
                    ? "bg-emerald-600"
                    : "bg-foreground/40",
              )}
            />
            <p className="flex flex-col text-sm">
              <span className={cn(last && "font-medium")}>{item.label}</span>
              {item.time && (
                <span className="text-muted-foreground tabular-nums">
                  {item.time}
                </span>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function DisputeDetailClient({ dispute: d }: { dispute: Dispute }) {
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const isPiano = d.id === "DSP-208";
  const { opener, other } = roles(d);
  const canResolve = d.status === "Open" || d.status === "Waiting on user";
  const resolved = resolution !== null;

  const timeline = isPiano
    ? pianoCase.timeline
    : [{ label: `Opened by ${d.openedBy}`, time: d.opened }];

  const currentStep = resolved
    ? { label: `Resolved by ${adminUser.name} · just now`, done: true }
    : d.status === "Open"
      ? { label: "Waiting on admin" }
      : d.status === "Waiting on user"
        ? { label: `Waiting on ${d.waitingOn}` }
        : { label: d.outcome ?? d.status, done: true };

  return (
    <div className="flex flex-col">
      <Link
        href="/admin/disputes"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2.5 mb-3 w-fit text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
        Disputes
      </Link>

      <PageHeader
        title={`${d.id} · ${d.job.item}`}
        description={`${d.job.ref} · ${d.openedBy} against ${d.against} · ${d.reason}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge tone={priorityTone[d.priority]}>
              {d.priority} priority
            </StatusBadge>
            <StatusBadge tone={resolved ? "success" : disputeTone[d.status]}>
              {resolved ? "Resolved" : d.status}
            </StatusBadge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel className="flex flex-col gap-4">
            <SectionTitle>Claim and response</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              <Statement
                name={d.openedBy}
                role={`${opener} · opened the dispute`}
                label={`${possessive(d.openedBy)} claim`}
                text={d.claim}
              />
              <Statement
                name={d.against}
                role={other}
                label={`${possessive(d.against)} response`}
                text={d.response}
              />
            </div>
          </Panel>

          {isPiano && (
            <>
              <Panel className="flex flex-col gap-5">
                <SectionTitle>Evidence</SectionTitle>
                <EvidencePhotos
                  title="Pickup photos"
                  captions={pianoCase.pickupPhotos.captions}
                  takenAt={pianoCase.pickupPhotos.takenAt}
                />
                <EvidencePhotos
                  title="Delivery photos"
                  captions={pianoCase.deliveryPhotos.captions}
                  takenAt={pianoCase.deliveryPhotos.takenAt}
                />
                <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                  <HugeiconsIcon
                    icon={Note01Icon}
                    strokeWidth={2}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="text-muted-foreground">
                      Pickup inspection note · {pianoCase.inspection.when}
                    </p>
                    <p className="text-base">“{pianoCase.inspection.note}”</p>
                    <p className="text-muted-foreground">
                      Signed by {firstName(pianoCase.inspection.signedBy)}
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                  <SectionTitle>Message history</SectionTitle>
                  <span className="text-xs text-muted-foreground">
                    Read only
                  </span>
                </div>
                <ol className="flex flex-col gap-3">
                  {pianoCase.messages.map((m) => {
                    const mine = m.from === d.against;
                    return (
                      <li
                        key={m.time}
                        className={cn(
                          "flex max-w-[85%] flex-col gap-1",
                          mine ? "self-end items-end" : "items-start",
                        )}
                      >
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {firstName(m.from)} · {m.time}
                        </span>
                        <p
                          className={cn(
                            "rounded-2xl px-3.5 py-2 text-sm text-pretty",
                            mine
                              ? "bg-foreground text-background"
                              : "bg-background",
                          )}
                        >
                          {m.text}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </Panel>
            </>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <Panel className="flex flex-col gap-4">
            <SectionTitle>Details</SectionTitle>
            <dl className="flex flex-col gap-2.5 text-sm">
              {[
                ["Job", `${d.job.ref} · ${d.job.item}`],
                ["In dispute", formatUsd(d.amount)],
                [`${opener}`, d.openedBy],
                [`${other}`, d.against],
                ["Opened", d.opened],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <SectionTitle>Timeline</SectionTitle>
            <Timeline items={timeline} current={currentStep} />
          </Panel>

          {canResolve && (
            <Panel className="flex flex-col gap-4">
              {resolution ? (
                <output className="flex flex-col gap-3">
                  <span className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    Dispute resolved
                  </span>
                  <span className="font-medium">
                    {describeResolution(
                      resolution,
                      d.amount,
                      d.openedByDriver ? d.against : d.openedBy,
                    )}
                  </span>
                  <span className="rounded-xl bg-background p-3 text-sm text-pretty">
                    {resolution.note}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Both users are emailed the decision automatically.
                  </span>
                </output>
              ) : (
                <>
                  <SectionTitle>Resolve</SectionTitle>
                  <ResolutionForm max={d.amount} onResolve={setResolution} />
                </>
              )}
            </Panel>
          )}

          {!canResolve && d.outcome && (
            <Panel className="flex flex-col gap-2">
              <SectionTitle>Outcome</SectionTitle>
              <p className="text-sm">{d.outcome}</p>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}
