"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthField,
  AuthHeading,
  AuthLayout,
  AuthSwitchLink,
} from "@/features/user/components/auth-layout";
import { BenefitsPanel } from "@/features/user/components/benefits-panel";
import { GoogleButton } from "@/features/user/components/google-button";
import { OnboardingStep } from "@/features/user/components/onboarding-step";
import { OrDivider } from "@/features/user/components/or-divider";
import { PasswordInput } from "@/features/user/components/password-input";
import { PendingIcon } from "@/features/user/components/pending-icon";
import { usePending } from "@/features/user/hooks/use-pending";
import { signIn } from "@/features/user/user-actions";
import { emailError as getEmailError } from "@/features/user/user-validation";
import { cn } from "@/lib/utils";

const MIN_PASSWORD = 8;

/** Signup form, then a "what's first" step on the same route. */
export function SignupFlow() {
  const [done, setDone] = useState<{ name: string } | null>(null);
  if (done) return <OnboardingStep name={done.name} />;
  return (
    <AuthLayout aside={<BenefitsPanel />}>
      <SignupForm onDone={(name) => setDone({ name })} />
    </AuthLayout>
  );
}

function SignupForm({ onDone }: { onDone: (name: string) => void }) {
  const { pending, start } = usePending<"google" | "email">();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const nameError = name.trim() ? null : "Enter your full name.";
  const emailError = getEmailError(email);
  const passwordOk = password.length >= MIN_PASSWORD;
  const showNameError = touched.name && nameError;
  const showEmailError = touched.email && emailError;
  const showPasswordError = touched.password && !passwordOk;
  const valid = !nameError && !emailError && passwordOk;

  const blur = (field: keyof typeof touched) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title="Create your free account"
        description="One account lets you ship items and drive for others."
      />

      <div className="flex flex-col gap-6">
        <GoogleButton
          pending={pending === "google"}
          disabled={pending !== null}
          onClick={() =>
            start("google", () => signIn("user", null).then(() => onDone("")))
          }
        />
        <OrDivider />

        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched({ name: true, email: true, password: true });
            if (!valid || !agreed) return;
            start("email", () => signIn("user", null).then(() => onDone(name)));
          }}
        >
          <AuthField
            id="signup-name"
            label="Full name"
            error={showNameError && nameError}
          >
            <Input
              id="signup-name"
              autoComplete="name"
              placeholder="Jordan Lee"
              className="h-9"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={blur("name")}
              aria-invalid={showNameError ? true : undefined}
              aria-describedby={showNameError ? "signup-name-error" : undefined}
            />
          </AuthField>

          <AuthField
            id="signup-email"
            label="Email"
            error={showEmailError && emailError}
          >
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={blur("email")}
              aria-invalid={showEmailError ? true : undefined}
              aria-describedby={
                showEmailError ? "signup-email-error" : undefined
              }
            />
          </AuthField>

          <AuthField id="signup-password" label="Password">
            <PasswordInput
              id="signup-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={blur("password")}
              aria-invalid={showPasswordError ? true : undefined}
              aria-describedby="signup-password-hint"
            />
            <p
              id="signup-password-hint"
              className={cn(
                "flex items-center gap-1.5 text-sm text-muted-foreground",
                passwordOk && "text-foreground",
                showPasswordError && "text-destructive",
              )}
            >
              {passwordOk && (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  aria-hidden
                  className="size-4"
                />
              )}
              {showPasswordError
                ? `Use at least ${MIN_PASSWORD} characters. ${MIN_PASSWORD - password.length} more to go.`
                : `At least ${MIN_PASSWORD} characters`}
            </p>
          </AuthField>

          <div className="flex items-start gap-3">
            <Checkbox
              id="signup-terms"
              className="mt-0.5"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label
              htmlFor="signup-terms"
              className="block font-normal leading-snug text-muted-foreground"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Privacy policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={!valid || !agreed || pending !== null}
          >
            {pending === "email" && <PendingIcon />}
            {pending === "email" ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <AuthSwitchLink prompt="Already have an account?" href="/login">
          Log in
        </AuthSwitchLink>
      </div>
    </div>
  );
}
