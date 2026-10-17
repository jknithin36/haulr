"use client";

import { useId, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Panel } from "@/components/ui/data-display";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  isDirty,
  SaveBar,
} from "@/features/admin/components/settings/save-bar";
import {
  SettingsRow,
  SettingsSection,
} from "@/features/dashboard/components/settings/section";
import { generalDefaults, timeZones } from "@/lib/demo-data/admin/settings";

export const switchClass =
  "data-unchecked:bg-foreground/15 dark:data-unchecked:bg-foreground/20";

export function General({
  maintenance,
  onMaintenanceChange,
}: {
  maintenance: boolean;
  onMaintenanceChange: (on: boolean) => void;
}) {
  const id = useId();
  const [saved, setSaved] = useState(generalDefaults);
  const [values, setValues] = useState(generalDefaults);
  const [confirming, setConfirming] = useState(false);

  function update(key: keyof typeof generalDefaults, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <SettingsSection title="Platform">
        <Panel>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>Platform name</FieldLabel>
              <Input
                id={`${id}-name`}
                value={values.platformName}
                onChange={(e) => update("platformName", e.target.value)}
                className="h-9 bg-background dark:bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-email`}>Support email</FieldLabel>
              <Input
                id={`${id}-email`}
                type="email"
                value={values.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="h-9 bg-background dark:bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-tz`}>Default time zone</FieldLabel>
              <Select
                items={timeZones}
                value={values.timeZone}
                onValueChange={(v) => v && update("timeZone", v as string)}
              >
                <SelectTrigger
                  id={`${id}-tz`}
                  className="w-full bg-background data-[size=default]:h-9 dark:bg-background"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </Panel>
      </SettingsSection>

      <SettingsSection title="Maintenance">
        <Panel>
          <SettingsRow
            label={
              <label htmlFor={`${id}-maintenance`}>Maintenance mode</label>
            }
            value={
              maintenance
                ? "On. Customers and drivers see a maintenance page."
                : "Off. The marketplace is open."
            }
            action={
              <Switch
                id={`${id}-maintenance`}
                checked={maintenance}
                onCheckedChange={(on) =>
                  on ? setConfirming(true) : onMaintenanceChange(false)
                }
                className={switchClass}
              />
            }
          />
        </Panel>
      </SettingsSection>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Turn on maintenance mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Haulr goes offline for everyone outside the team. Nobody can post
              shipments, send offers or book until you turn it off. Jobs already
              in progress aren’t affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel
              variant="destructive"
              onClick={() => onMaintenanceChange(true)}
            >
              Turn on
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SaveBar dirty={isDirty(values, saved)} onSave={() => setSaved(values)} />
    </div>
  );
}
