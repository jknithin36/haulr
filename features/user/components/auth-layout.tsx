import Link from "next/link";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/** Logo in the top-left corner of the auth pages, linking home. */
export function AuthLogo() {
  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-2 font-semibold tracking-tight"
    >
      <LogoMark />
      Haulr
    </Link>
  );
}

/**
 * Auth page: logo on top and the form centered. With `aside`, the page splits
 * into two columns on desktop and the panel fills the right half.
 */
export function AuthLayout({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <main className={cn("grid min-h-svh flex-1", aside && "lg:grid-cols-2")}>
      <div className="flex flex-col px-6 py-6 md:px-10">
        <AuthLogo />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      {aside && (
        <aside className="relative p-4 pl-0 max-lg:hidden">
          <div className="relative size-full">{aside}</div>
        </aside>
      )}
    </main>
  );
}

export function AuthHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-pretty text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/**
 * Label, control, and error message. The error gets the id `${id}-error`, so
 * point the control's `aria-describedby` at it while the error shows.
 */
export function AuthField({
  id,
  label,
  labelAside,
  error,
  children,
}: {
  id: string;
  label: string;
  /** Shown at the end of the label row, like a "Forgot password?" link. */
  labelAside?: React.ReactNode;
  error?: string | null | false;
  children: React.ReactNode;
}) {
  const labelNode = <Label htmlFor={id}>{label}</Label>;
  return (
    <div className="grid gap-2">
      {labelAside ? (
        <div className="flex items-center justify-between">
          {labelNode}
          {labelAside}
        </div>
      ) : (
        labelNode
      )}
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/** "Already have an account? Log in" under the auth forms. */
export function AuthSwitchLink({
  prompt,
  href,
  children,
}: {
  prompt: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {children}
      </Link>
    </p>
  );
}
