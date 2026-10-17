import {
  Car01Icon,
  CheckListIcon,
  MessageEdit01Icon,
  Route02Icon,
  SecurityCheckIcon,
  Sofa01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { noise } from "@/components/ui/gradient-avatar";
import type { CoverIcon, Post } from "@/lib/demo-data/blog-posts";
import { cn } from "@/lib/utils";

const icons = {
  car: Car01Icon,
  enclosed: TruckIcon,
  sofa: Sofa01Icon,
  checklist: CheckListIcon,
  route: Route02Icon,
  offer: MessageEdit01Icon,
  shield: SecurityCheckIcon,
} satisfies Record<CoverIcon, unknown>;

/** Quiet neutral cover with fine grain and the post's icon. */
export function PostCover({
  post,
  className,
  size = "md",
}: {
  post: Post;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-2xl bg-muted", className)}
    >
      <span
        className="absolute inset-0 opacity-25 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundImage: noise }}
      />
      <span
        className={cn(
          "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-xs",
          size === "lg" ? "size-20" : "size-14",
        )}
      >
        <HugeiconsIcon
          icon={icons[post.cover]}
          strokeWidth={1.75}
          className={size === "lg" ? "size-9" : "size-6"}
        />
      </span>
    </div>
  );
}
