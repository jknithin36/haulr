"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/wizard/wizard-fields";
import { StepHeading } from "@/components/wizard/wizard-shell";
import { AuthSwitchLink } from "@/features/user/components/auth-layout";
import { GoogleLogo } from "@/features/user/components/google-button";
import { isEmail } from "@/features/user/user-validation";

/** Sign-up gate shown to logged-out visitors right before posting. */
export function AccountStep({
  savedText,
  submitLabel,
  onDone,
}: {
  savedText: string;
  submitLabel: string;
  onDone: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const valid = isEmail(email) && password.length >= 8;

  return (
    <div className="flex max-w-md flex-col gap-8">
      <StepHeading title="Almost done. Create a free account to post." />
      <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
          className="mt-px size-4 shrink-0"
        />
        <p>{savedText}</p>
      </div>
      <div className="flex flex-col gap-6">
        <Button variant="outline" size="lg" className="h-10" onClick={onDone}>
          <GoogleLogo />
          Sign up with Google
        </Button>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-px flex-1 bg-foreground/10" />
          or
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onDone();
          }}
        >
          <Field label="Email" htmlFor="account-email">
            <Input
              id="account-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </Field>
          <Field
            label="Password"
            htmlFor="account-password"
            hint="At least 8 characters."
          >
            <Input
              id="account-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            className="mt-2 h-10"
            disabled={!valid}
          >
            {submitLabel}
          </Button>
        </form>
        <AuthSwitchLink prompt="Already have an account?" href="/login">
          Log in
        </AuthSwitchLink>
      </div>
    </div>
  );
}
