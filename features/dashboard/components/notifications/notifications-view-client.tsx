"use client";

import {
  ArrowRight02Icon,
  BankIcon,
  CalendarAdd01Icon,
  ChartDecreaseIcon,
  CheckmarkCircle02Icon,
  Location01Icon,
  Notification01Icon,
  StarIcon,
  Tag01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-display";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";
import {
  type DashboardNotification,
  type NotificationKind,
  notificationTabs,
} from "@/lib/demo-data/dashboard/notifications";
import { cn } from "@/lib/utils";

const kindIcon: Record<NotificationKind, typeof StarIcon> = {
  offer: Tag01Icon,
  booking: CalendarAdd01Icon,
  update: Location01Icon,
  outbid: ChartDecreaseIcon,
  payout: BankIcon,
  vehicle: TruckIcon,
  review: StarIcon,
};

/** Renders "{route}" in the copy as "From [arrow] To". */
function NotificationText({ n }: { n: DashboardNotification }) {
  if (!n.route) return n.text;
  const [before, after] = n.text.split("{route}");
  return (
    <>
      {before}
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        {n.route.from}
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          strokeWidth={2}
          aria-label="to"
          className="size-3.5 self-center"
        />
        {n.route.to}
      </span>
      {after}
    </>
  );
}

export function NotificationsViewClient({
  initialNotifications,
}: {
  initialNotifications: DashboardNotification[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialNotifications);
  const [tab, setTab] = useState<string>("all");

  const unread = items.filter((n) => !n.read).length;
  const visible =
    tab === "all" ? items : items.filter((n) => n.category === tab);

  function open(n: DashboardNotification) {
    setItems((list) =>
      list.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
    router.push(n.href);
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        action={
          <Button
            variant="outline"
            size="lg"
            disabled={unread === 0}
            onClick={() =>
              setItems((list) => list.map((n) => ({ ...n, read: true })))
            }
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
            Mark all as read
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          <DashboardTabsList>
            {notificationTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3">
                {t.label}
              </TabsTrigger>
            ))}
          </DashboardTabsList>
        </div>
      </Tabs>

      <div className="pt-4">
        {visible.length === 0 ? (
          <EmptyState
            icon={Notification01Icon}
            title="No notifications yet"
            description="We’ll let you know when something happens."
          />
        ) : (
          <ul className="flex flex-col gap-1 rounded-2xl bg-muted/50 p-2">
            {visible.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => open(n)}
                  className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-colors group-hover:bg-muted">
                    <HugeiconsIcon
                      icon={kindIcon[n.kind]}
                      strokeWidth={2}
                      className="size-[18px]"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span
                      className={cn(
                        "flex-1 text-sm text-pretty",
                        n.read
                          ? "text-foreground/70"
                          : "font-medium text-foreground",
                      )}
                    >
                      <NotificationText n={n} />
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {n.time}
                    </span>
                  </span>
                  <span className="flex w-2 shrink-0 justify-center">
                    {!n.read && (
                      <span className="size-2 rounded-full bg-foreground">
                        <span className="sr-only">Unread</span>
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
