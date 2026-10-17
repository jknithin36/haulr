"use client";

import { useId, useState } from "react";
import { Panel } from "@/components/ui/data-display";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { switchClass } from "@/features/admin/components/settings/general";
import { NumberInput } from "@/features/admin/components/settings/number-input";
import {
  isDirty,
  SaveBar,
} from "@/features/admin/components/settings/save-bar";
import {
  SettingsRow,
  SettingsSection,
} from "@/features/dashboard/components/settings/section";
import {
  marketplaceDefaults,
  offerWindows,
} from "@/lib/demo-data/admin/settings";

type Rules = typeof marketplaceDefaults;

function Suffixed({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      {children}
    </span>
  );
}

export function MarketplaceRules() {
  const id = useId();
  const [saved, setSaved] = useState(marketplaceDefaults);
  const [values, setValues] = useState(marketplaceDefaults);

  function set<K extends keyof Rules>(key: K, value: Rules[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <SettingsSection
        title="Offers"
        description="How customers collect offers and how drivers send them."
      >
        <Panel className="divide-y divide-border/60">
          <SettingsRow
            label="Offer windows"
            value="Customers pick one when they post"
            action={
              <ToggleGroup
                aria-label="Offer windows"
                variant="outline"
                size="sm"
                multiple
                value={values.offerWindows}
                onValueChange={(next) =>
                  next.length > 0 && set("offerWindows", next as string[])
                }
                className="flex-wrap"
              >
                {offerWindows.map((w) => (
                  <ToggleGroupItem
                    key={w.value}
                    value={w.value}
                    className="bg-background px-3 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90"
                  >
                    {w.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            }
          />
          <SettingsRow
            label="Minimum offer"
            action={
              <Suffixed>
                <NumberInput
                  label="Minimum offer percent"
                  value={values.minimumOfferPercent}
                  onChange={(v) => set("minimumOfferPercent", v)}
                  suffix="%"
                  max={100}
                  className="w-20"
                />
                of the estimated price
              </Suffixed>
            }
          />
          <SettingsRow
            label="Max offers per driver per hour"
            action={
              <NumberInput
                label="Max offers per driver per hour"
                value={values.maxOffersPerHour}
                onChange={(v) => set("maxOffersPerHour", v)}
                className="w-20"
              />
            }
          />
          <SettingsRow
            label={
              <label htmlFor={`${id}-flag`}>
                Auto-flag offers containing phone numbers or emails
              </label>
            }
            value="Keeps payments and messages on Haulr"
            action={
              <Switch
                id={`${id}-flag`}
                checked={values.autoFlagContactInfo}
                onCheckedChange={(on) => set("autoFlagContactInfo", on)}
                className={switchClass}
              />
            }
          />
        </Panel>
      </SettingsSection>

      <SettingsSection title="Cancellations">
        <Panel className="divide-y divide-border/60">
          <SettingsRow
            label="Free cancellation"
            action={
              <Suffixed>
                up to
                <NumberInput
                  label="Free cancellation hours before pickup"
                  value={values.freeCancellationHours}
                  onChange={(v) => set("freeCancellationHours", v)}
                  className="w-20"
                />
                hours before pickup
              </Suffixed>
            }
          />
          <SettingsRow
            label="Late cancellation fee"
            action={
              <NumberInput
                label="Late cancellation fee percent"
                value={values.lateCancellationPercent}
                onChange={(v) => set("lateCancellationPercent", v)}
                suffix="%"
                max={100}
                className="w-20"
              />
            }
          />
        </Panel>
      </SettingsSection>

      <SettingsSection title="Drivers">
        <Panel>
          <SettingsRow
            label="Minimum insurance"
            value="Cargo coverage required to send offers"
            action={
              <NumberInput
                label="Minimum insurance"
                value={values.minimumInsurance}
                onChange={(v) => set("minimumInsurance", v)}
                prefix="$"
                className="w-32"
              />
            }
          />
        </Panel>
      </SettingsSection>

      <SaveBar dirty={isDirty(values, saved)} onSave={() => setSaved(values)} />
    </div>
  );
}
