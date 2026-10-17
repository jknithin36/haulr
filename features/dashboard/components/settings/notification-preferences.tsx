"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/data-display";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import {
  channelLabels,
  type NotificationChannel,
  type NotificationPreference,
  notificationChannels,
} from "@/lib/demo-data/dashboard/settings";

export function NotificationPreferences({
  initialPreferences,
}: {
  initialPreferences: NotificationPreference[];
}) {
  const [prefs, setPrefs] = useState(initialPreferences);

  function toggle(id: string, channel: NotificationChannel, on: boolean) {
    setPrefs((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, channels: { ...row.channels, [channel]: on } }
          : row,
      ),
    );
  }

  return (
    <SettingsSection
      title="Notifications"
      description="Choose how we reach you for each kind of alert."
      className="max-w-xl"
    >
      <Panel className="px-4 pt-3 md:px-6 md:pt-4">
        <table className="w-full table-fixed text-sm">
          <caption className="sr-only">Notification preferences</caption>
          <colgroup>
            <col />
            {notificationChannels.map((channel) => (
              <col key={channel} className="w-14 sm:w-20" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="pb-3 text-left text-xs font-medium text-muted-foreground"
              >
                Alert
              </th>
              {notificationChannels.map((channel) => (
                <th
                  key={channel}
                  scope="col"
                  className="pb-3 text-center text-xs font-medium text-muted-foreground"
                >
                  {channelLabels[channel]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {prefs.map((row) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="py-3.5 pr-2 text-left font-medium [tr:last-child>&]:pb-0"
                >
                  {row.label}
                </th>
                {notificationChannels.map((channel) => (
                  <td
                    key={channel}
                    className="py-3.5 text-center [tr:last-child>&]:pb-0"
                  >
                    <Switch
                      checked={row.channels[channel]}
                      onCheckedChange={(on) => toggle(row.id, channel, on)}
                      aria-label={`${row.label} by ${channelLabels[channel]}`}
                      className="align-middle data-unchecked:bg-foreground/15 dark:data-unchecked:bg-foreground/20"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </SettingsSection>
  );
}
