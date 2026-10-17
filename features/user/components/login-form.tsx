"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthField,
  AuthHeading,
  AuthSwitchLink,
} from "@/features/user/components/auth-layout";
import { GoogleButton } from "@/features/user/components/google-button";
import { OrDivider } from "@/features/user/components/or-divider";
import { PasswordInput } from "@/features/user/components/password-input";
import { PendingIcon } from "@/features/user/components/pending-icon";
import { usePending } from "@/features/user/hooks/use-pending";
import { signIn } from "@/features/user/user-actions";
import { emailError as getEmailError } from "@/features/user/user-validation";

/** Where to go after logging in: back to the protected page, if there was one. */
function nextPath() {
  return new URLSearchParams(window.location.search).get("next") ?? undefined;
}

export function LoginForm() {
  const { pending, start } = usePending<"google" | "email">();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = getEmailError(email);
  const passwordError = password ? null : "Enter your password.";
  const showEmailError = submitted && emailError;
  const showPasswordError = submitted && passwordError;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <AuthHeading
          title="Welcome back"
          description="Log in to your Haulr account."
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Try the demo:</span>
          <button
            type="button"
            onClick={() => signIn("user", nextPath())}
            className="font-medium underline-offset-4 hover:underline"
          >
            Log in as user
          </button>
          <span aria-hidden className="text-muted-foreground/60">
            ·
          </span>
          <button
            type="button"
            onClick={() => signIn("admin", nextPath())}
            className="font-medium underline-offset-4 hover:underline"
          >
            Log in as admin
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <GoogleButton
          pending={pending === "google"}
          disabled={pending !== null}
          onClick={() => start("google", () => signIn("user", nextPath()))}
        />
        <OrDivider />

        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            if (emailError || passwordError) return;
            start("email", () => signIn("user", nextPath()));
          }}
        >
          <AuthField
            id="login-email"
            label="Email"
            error={showEmailError && emailError}
          >
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={showEmailError ? true : undefined}
              aria-describedby={
                showEmailError ? "login-email-error" : undefined
              }
            />
          </AuthField>

          <AuthField
            id="login-password"
            label="Password"
            labelAside={
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            }
            error={showPasswordError && passwordError}
          >
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={showPasswordError ? true : undefined}
              aria-describedby={
                showPasswordError ? "login-password-error" : undefined
              }
            />
          </AuthField>

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={pending !== null}
          >
            {pending === "email" && <PendingIcon />}
            {pending === "email" ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <AuthSwitchLink prompt="Don’t have an account?" href="/signup">
          Sign up
        </AuthSwitchLink>
      </div>
    </div>
  );
}
