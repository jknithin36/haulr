"use client";

import { useSyncExternalStore } from "react";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTabsList } from "@/features/dashboard/components/dashboard-tabs";

type SettingsTab = {
  value: string;
  label: string;
  content: React.ReactNode;
};

const desktopQuery = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Vertical section nav on desktop, a scrollable tab row on phones. */
export function SettingsViewClient({ sections }: { sections: SettingsTab[] }) {
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(desktopQuery).matches,
    () => true,
  );

  return (
    <Tabs
      defaultValue="profile"
      orientation={isDesktop ? "vertical" : "horizontal"}
      className="gap-6 md:gap-12"
    >
      <div className="-mx-4 shrink-0 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:w-44 md:overflow-visible md:px-0">
        <DashboardTabsList
          aria-label="Settings sections"
          className="md:sticky md:top-6 md:w-full md:gap-0.5 md:bg-transparent md:p-0"
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
        </DashboardTabsList>
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
  );
}
