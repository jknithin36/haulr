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
