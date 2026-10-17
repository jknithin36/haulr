import Link from "next/link";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { cn } from "@/lib/utils";

/** Avatar and name, linking to the user's admin page when there is one. */
export function UserCell({
  name,
  href,
  sub,
  className,
}: {
  name: string;
  href?: string;
  sub?: React.ReactNode;
  className?: string;
}) {
  const label = href ? (
    <Link
      href={href}
      className="truncate font-medium underline-offset-4 hover:underline"
    >
      {name}
    </Link>
  ) : (
    <span className="truncate font-medium">{name}</span>
  );

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <GradientAvatar seed={name} className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-col">
        {label}
        {sub && (
          <span className="truncate text-xs text-muted-foreground">{sub}</span>
        )}
      </div>
    </div>
  );
}
