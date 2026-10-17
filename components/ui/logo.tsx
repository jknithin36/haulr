import Link from "next/link";
import { cn } from "@/lib/utils";

/** Haulr mark. Drawn with the current text color so it works on any background. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block aspect-738/845 h-5 bg-current mask-[url(/logo.svg)] mask-contain mask-center mask-no-repeat",
        className,
      )}
    />
  );
}

/** Mark and wordmark linking home, as used in headers. */
export function LogoLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <LogoMark />
      <span>Haulr</span>
    </Link>
  );
}
