"use client";

import { Flag02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Panel,
  Rating,
  Stars,
  StatusBadge,
} from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Label } from "@/components/ui/label";
import { RouteLabel } from "@/components/ui/route-label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ActivityItem,
  UserNote,
  UserReport,
} from "@/lib/demo-data/admin/users";
import { offers, offerTone } from "@/lib/demo-data/dashboard/offers";
import {
  earnings,
  formatMoney,
  paymentsMade,
  statusTone as paymentTone,
} from "@/lib/demo-data/dashboard/payments";
import {
  ratingSummary,
  reviewsAboutMe,
} from "@/lib/demo-data/dashboard/reviews";
import {
  myShipments,
  statusTone as shipmentTone,
  statusLabel,
} from "@/lib/demo-data/dashboard/shipments";
import {
  completedTrip,
  confirmedBookings,
  upcomingTrip,
} from "@/lib/demo-data/dashboard/trips";

/** One line in a list panel: main text on the left, meta on the right. */
function Row({
  title,
  sub,
  meta,
  aside,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  meta?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="font-medium">{title}</p>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4 text-sm sm:justify-end">
        {meta && (
          <span className="tabular-nums text-muted-foreground">{meta}</span>
        )}
        {aside}
      </div>
    </li>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col divide-y divide-border/60">{children}</ul>
  );
}

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="flex flex-col gap-4">
      {title && <h3 className="font-medium">{title}</h3>}
      {children}
    </Panel>
  );
}

export function ActivityTab({ items }: { items: ActivityItem[] }) {
  return (
    <Section>
      <ol className="flex flex-col">
        {items.map((a, i) => (
          <li key={a.id} className="relative flex gap-4 pb-5 last:pb-0">
            {i < items.length - 1 && (
              <span
                aria-hidden
                className="absolute top-4 bottom-0 left-[3.5px] w-px bg-border"
              />
            )}
            <span
              aria-hidden
              className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground/70"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-pretty">{a.text}</p>
              <p className="text-xs text-muted-foreground">{a.date}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function ShipmentsTab() {
  return (
    <Section title="Shipments she posted">
      <List>
        {myShipments.map((s) => (
          <Row
            key={s.id}
            title={
              <>
                {s.item}{" "}
                <span className="font-normal text-muted-foreground">
                  · {s.id}
                </span>
              </>
            }
            sub={
              <RouteLabel
                from={s.from}
                to={s.to}
                className="flex-nowrap"
                arrowClassName="text-muted-foreground"
              />
            }
            meta={`${s.price} · ${s.date}`}
            aside={
              <StatusBadge tone={shipmentTone[s.status]}>
                {statusLabel[s.status]}
              </StatusBadge>
            }
          />
        ))}
      </List>
    </Section>
  );
}

export function TripsTab() {
  const booked = confirmedBookings.reduce((sum, b) => sum + b.cuft, 0);
  return (
    <Section title="Trips she’s driving">
      <List>
        <Row
          title={
            <>
              <RouteLabel
                from={upcomingTrip.from.city}
                to={upcomingTrip.to.city}
                className="flex-nowrap"
                arrowClassName="text-muted-foreground"
              />{" "}
              <span className="font-normal text-muted-foreground">
                · {upcomingTrip.id}
              </span>
            </>
          }
          sub={`${upcomingTrip.departs} – ${upcomingTrip.arrives} · via ${upcomingTrip.stops.join(", ")} · ${upcomingTrip.vehicle}`}
          meta={`${booked} of ${upcomingTrip.capacity} cu ft booked`}
          aside={<StatusBadge tone="info">Upcoming</StatusBadge>}
        />
        <Row
          title={
            <>
              <RouteLabel
                from={completedTrip.from.city}
                to={completedTrip.to.city}
                className="flex-nowrap"
                arrowClassName="text-muted-foreground"
              />{" "}
              <span className="font-normal text-muted-foreground">
                · {completedTrip.id}
              </span>
            </>
          }
          sub={`${completedTrip.date} · ${completedTrip.booked} of ${completedTrip.capacity} cu ft booked`}
          meta={`Earned ${formatMoney(completedTrip.earned)}`}
          aside={<StatusBadge tone="success">Completed</StatusBadge>}
        />
      </List>
    </Section>
  );
}

export function OffersTab() {
  return (
    <Section title="Offers she sent">
      <List>
        {offers.map((o) => (
          <Row
            key={o.id}
            title={
              <>
                {o.shipment}{" "}
                <span className="font-normal text-muted-foreground">
                  · {o.id}
                </span>
              </>
            }
            sub={
              <RouteLabel
                from={o.from}
                to={o.to}
                className="flex-nowrap"
                arrowClassName="text-muted-foreground"
              />
            }
            meta={
              o.closes === "Closed"
                ? formatMoney(o.amount)
                : `${formatMoney(o.amount)} · closes in ${o.closes}`
            }
            aside={
              <StatusBadge tone={offerTone[o.status]}>{o.status}</StatusBadge>
            }
          />
        ))}
      </List>
    </Section>
  );
}

export function PaymentsTab() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Earnings">
        <List>
          {earnings.map((e) => (
            <Row
              key={e.id}
              title={e.job.title ?? e.job.route?.join(" to ")}
              sub={`${e.job.ref} · ${e.date} · fee ${formatMoney(e.fee)}`}
              meta={`${formatMoney(e.net)} net`}
              aside={
                <StatusBadge tone={paymentTone[e.status]}>
                  {e.status}
                </StatusBadge>
              }
            />
          ))}
        </List>
      </Section>
      <Section title="Payments she made">
        <List>
          {paymentsMade.map((p) => (
            <Row
              key={p.id}
              title={p.shipment.title}
              sub={`${p.shipment.ref} · ${p.type}${p.date ? ` · ${p.date}` : ""}`}
              meta={formatMoney(p.amount)}
              aside={
                <StatusBadge tone={paymentTone[p.status]}>
                  {p.status}
                </StatusBadge>
              }
            />
          ))}
        </List>
      </Section>
    </div>
  );
}

export function ReviewsTab() {
  return (
    <Section>
      <div className="flex items-center gap-3">
        <Rating value={ratingSummary.average} className="text-lg font-medium" />
        <span className="text-sm text-muted-foreground">
          from {ratingSummary.count} reviews
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-border/60">
        {reviewsAboutMe.map((r) => (
          <li key={r.id} className="flex gap-3 py-4 last:pb-0">
            <GradientAvatar seed={r.person} className="size-8 shrink-0" />
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium">{r.person}</span>
                <Stars value={r.rating} />
              </div>
              <p className="text-pretty">{r.comment}</p>
              <p className="text-xs text-muted-foreground">
                {r.ref} · {r.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ReportsTab({
  name,
  reports,
}: {
  name: string;
  reports: UserReport[];
}) {
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Flag02Icon}
        title="No reports"
        description={`Nobody has reported ${name}.`}
      />
    );
  }
  return (
    <Section>
      <List>
        {reports.map((r) => (
          <Row
            key={r.id}
            title={`“${r.detail}”`}
            sub={`Reported by ${r.reporter} · ${r.date}`}
            aside={<StatusBadge tone="danger">{r.reason}</StatusBadge>}
          />
        ))}
      </List>
    </Section>
  );
}

export function NotesTab({
  notes,
  onAdd,
}: {
  notes: UserNote[];
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onAdd(text.trim());
            setText("");
          }}
        >
          <Label htmlFor="admin-note">Add a note</Label>
          <Textarea
            id="admin-note"
            rows={3}
            className="bg-background"
            placeholder="Only admins can see notes."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" className="w-fit" disabled={!text.trim()}>
            Save note
          </Button>
        </form>
      </Panel>
      {notes.length > 0 && (
        <ul className="flex flex-col gap-3">
          {notes.map((n) => (
            <li
              key={n.id}
              className="flex gap-3 rounded-2xl bg-muted/50 p-4 md:p-5"
            >
              <GradientAvatar seed={n.author} className="size-8 shrink-0" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm">
                  <span className="font-medium">{n.author}</span>{" "}
                  <span className="text-muted-foreground">· {n.date}</span>
                </p>
                <p className="text-pretty">{n.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
