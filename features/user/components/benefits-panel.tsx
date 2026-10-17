import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SignupMap } from "@/features/user/components/signup-map";

const benefits = [
  "Post shipments for free",
  "Get offers from verified drivers",
  "Earn with your empty space",
];

/** Map of routes across the US, with what an account gets you on a small card. */
export function BenefitsPanel() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-muted">
      <SignupMap />
      <div className="relative flex h-full flex-col justify-between p-8 xl:p-10">
        <p className="max-w-xs text-balance text-2xl font-semibold tracking-tight">
          Ship it, carry it, or both.
        </p>
        <ul className="flex w-fit flex-col gap-3 rounded-2xl bg-background/95 px-5 py-4 shadow-sm backdrop-blur">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 font-medium">
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-4 shrink-0"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
