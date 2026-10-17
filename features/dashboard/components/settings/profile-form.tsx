"use client";

import { Camera01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/data-display";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsSection } from "@/features/dashboard/components/settings/section";
import type { Profile } from "@/lib/demo-data/dashboard/settings";

const fields: {
  key: Exclude<keyof Profile, "about">;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { key: "name", label: "Full name", type: "text", autoComplete: "name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  {
    key: "city",
    label: "City",
    type: "text",
    autoComplete: "address-level2",
  },
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(profile);
  const [values, setValues] = useState(profile);
  const [photo, setPhoto] = useState<string | null>(null);
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const dirty =
    photo !== savedPhoto ||
    (Object.keys(values) as (keyof Profile)[]).some(
      (key) => values[key] !== saved[key],
    );

  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [justSaved]);

  function update(key: keyof Profile, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setJustSaved(false);
  }

  function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photo && photo !== savedPhoto) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setJustSaved(false);
    event.target.value = "";
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!dirty) return;
    setSaved(values);
    setSavedPhoto(photo);
    setJustSaved(true);
  }

  return (
    <form onSubmit={save} className="flex max-w-xl flex-col gap-8">
      <SettingsSection title="Photo">
        <Panel className="flex items-center gap-5">
          <div className="relative size-20 shrink-0">
            {photo ? (
              // biome-ignore lint/performance/noImgElement: local preview of an uploaded file (blob URL).
              <img
                src={photo}
                alt="Your new profile"
                className="size-20 rounded-full object-cover ring-1 ring-foreground/10"
              />
            ) : (
              <GradientAvatar seed={profile.name} className="block size-20" />
            )}
          </div>
          <div className="flex flex-col items-start gap-2">
            <input
              ref={fileRef}
              id={`${id}-photo`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={choosePhoto}
              tabIndex={-1}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <HugeiconsIcon
                icon={Camera01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Change photo
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG or PNG, square works best.
            </p>
          </div>
        </Panel>
      </SettingsSection>

      <SettingsSection title="Details">
        <Panel>
          <FieldGroup className="gap-5">
            {fields.map((field) => (
              <Field key={field.key}>
                <FieldLabel htmlFor={`${id}-${field.key}`}>
                  {field.label}
                </FieldLabel>
                <Input
                  id={`${id}-${field.key}`}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={values[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="h-9 bg-background dark:bg-background"
                />
              </Field>
            ))}
            <Field>
              <FieldLabel htmlFor={`${id}-about`}>About me</FieldLabel>
              <Textarea
                id={`${id}-about`}
                rows={3}
                value={values.about}
                onChange={(e) => update("about", e.target.value)}
                className="bg-background dark:bg-background"
              />
            </Field>
          </FieldGroup>
        </Panel>
      </SettingsSection>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={!dirty}>
          Save changes
        </Button>
        <output className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {justSaved && (
            <>
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-4 text-emerald-600 dark:text-emerald-400"
              />
              Saved
            </>
          )}
        </output>
      </div>
    </form>
  );
}
