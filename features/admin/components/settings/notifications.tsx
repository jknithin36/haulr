"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/data-display";
import { Switch } from "@/components/ui/switch";
import { switchClass } from "@/features/admin/components/settings/general";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import {
  type AdminAlertChannel,
  adminAlertChannelLabels,
  adminAlertChannels,
  adminAlertDefaults,
} from "@/lib/demo-data/admin/settings";

export function AdminNotifications() {
  const [prefs, setPrefs] = useState(adminAlertDefaults);

  function toggle(id: string, channel: AdminAlertChannel, on: boolean) {
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
      description="Which admin alerts reach you, and where. Slack alerts post to #ops-alerts."
      className="max-w-xl"
    >
      <Panel className="px-4 pt-3 md:px-6 md:pt-4">
        <table className="w-full table-fixed text-sm">
          <caption className="sr-only">Admin alert preferences</caption>
          <colgroup>
            <col />
            {adminAlertChannels.map((channel) => (
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
              {adminAlertChannels.map((channel) => (
                <th
                  key={channel}
                  scope="col"
                  className="pb-3 text-center text-xs font-medium text-muted-foreground"
                >
                  {adminAlertChannelLabels[channel]}
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
                {adminAlertChannels.map((channel) => (
                  <td
                    key={channel}
                    className="py-3.5 text-center [tr:last-child>&]:pb-0"
                  >
                    <Switch
                      checked={row.channels[channel]}
                      onCheckedChange={(on) => toggle(row.id, channel, on)}
                      aria-label={`${row.label} by ${adminAlertChannelLabels[channel]}`}
                      className={`align-middle ${switchClass}`}
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
