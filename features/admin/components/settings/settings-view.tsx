"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Categories } from "@/features/admin/components/settings/categories";
import { Fees } from "@/features/admin/components/settings/fees";
import { General } from "@/features/admin/components/settings/general";
import { MarketplaceRules } from "@/features/admin/components/settings/marketplace-rules";
import { AdminNotifications } from "@/features/admin/components/settings/notifications";
import { Team } from "@/features/admin/components/settings/team";

const desktopQuery = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function MaintenanceBanner({ onTurnOff }: { onTurnOff: () => void }) {
  return (
    <output className="mb-6 flex flex-col gap-3 rounded-2xl bg-amber-500/15 p-4 text-amber-900 sm:flex-row sm:items-center dark:text-amber-300">
      <HugeiconsIcon
        icon={Alert02Icon}
        strokeWidth={2}
        className="hidden size-5 shrink-0 sm:block"
      />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-medium">Maintenance mode is on</p>
        <p className="text-sm opacity-80">
          Customers and drivers see a maintenance page. Posting, offers and
          bookings are paused.
        </p>
      </div>
      <Button
        variant="outline"
        className="w-fit border-amber-900/20 bg-transparent hover:bg-amber-500/15 dark:border-amber-300/20"
        onClick={onTurnOff}
      >
        Turn off
      </Button>
    </output>
  );
}

/** Vertical section nav on desktop, a scrollable tab row on phones. */
export function AdminSettingsView() {
  const [maintenance, setMaintenance] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(desktopQuery).matches,
    () => true,
  );

  const sections = [
    {
      value: "general",
      label: "General",
      content: (
        <General
          maintenance={maintenance}
          onMaintenanceChange={setMaintenance}
        />
      ),
    },
    { value: "fees", label: "Fees and plans", content: <Fees /> },
    {
      value: "rules",
      label: "Marketplace rules",
      content: <MarketplaceRules />,
    },
    { value: "categories", label: "Categories", content: <Categories /> },
    { value: "team", label: "Team", content: <Team /> },
    {
      value: "notifications",
      label: "Notifications",
      content: <AdminNotifications />,
    },
  ];

  return (
    <>
      {maintenance && (
        <MaintenanceBanner onTurnOff={() => setMaintenance(false)} />
      )}
      <Tabs
        defaultValue="general"
        orientation={isDesktop ? "vertical" : "horizontal"}
        className="gap-6 md:gap-12"
      >
        <div className="-mx-4 shrink-0 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:w-44 md:overflow-visible md:px-0">
          <TabsList
            aria-label="Settings sections"
            className="group-data-horizontal/tabs:h-9 md:sticky md:top-20 md:w-full md:gap-0.5 md:bg-transparent md:p-0"
          >
            {sections.map((section) => (
              <TabsTrigger
                key={section.value}
                value={section.value}
                className="px-3 md:h-9 md:data-active:bg-muted md:data-active:shadow-none md:dark:data-active:border-transparent"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {sections.map((section) => (
          <TabsContent
            key={section.value}
            value={section.value}
            className="min-w-0 text-base"
          >
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
