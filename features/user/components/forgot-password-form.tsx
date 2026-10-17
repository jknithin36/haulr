"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthField,
  AuthHeading,
  AuthSwitchLink,
} from "@/features/user/components/auth-layout";
import { PendingIcon } from "@/features/user/components/pending-icon";
import { usePending } from "@/features/user/hooks/use-pending";
import { isEmail } from "@/features/user/user-validation";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const { pending, start } = usePending<"email">();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const valid = isEmail(email);

  if (sentTo) {
    return (
      <div className="flex flex-col gap-8">
        <AuthHeading
          title="Check your email"
          description={`If an account exists for ${sentTo}, we sent a link to reset your password.`}
        />
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Back to log in
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          Didn’t get it?{" "}
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title="Reset your password"
        description="We’ll email you a link to reset it."
      />
      <form
        noValidate
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          if (!valid) return;
          start("email", () => setSentTo(email.trim()));
        }}
      >
        <AuthField
          id="reset-email"
          label="Email"
          error={
            submitted &&
            !valid &&
            (email.trim()
              ? "Enter a valid email address."
              : "Enter your email.")
          }
        >
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={submitted && !valid}
            aria-describedby={
              submitted && !valid ? "reset-email-error" : undefined
            }
            className="h-9"
          />
        </AuthField>
        <Button type="submit" size="lg" className="w-full" disabled={!!pending}>
          {pending && <PendingIcon />}
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <AuthSwitchLink prompt="Remembered it?" href="/login">
        Log in
      </AuthSwitchLink>
    </div>
  );
}
