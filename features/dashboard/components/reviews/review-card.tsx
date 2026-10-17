import { Stars } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import type { Review } from "@/lib/demo-data/dashboard/reviews";

export function ReviewCard({
  review,
  prefix,
}: {
  review: Review;
  /** e.g. "To" for reviews Sarah wrote. */
  prefix?: string;
}) {
  return (
    <article className="flex gap-4 rounded-2xl bg-muted/50 p-5">
      <GradientAvatar seed={review.person} className="size-10" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm">
            {prefix && <span className="text-muted-foreground">{prefix} </span>}
            <span className="font-medium">{review.person}</span>
            <span className="text-muted-foreground tabular-nums">
              {" "}
              · {review.ref}
            </span>
          </p>
          {review.date && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {review.date}
            </span>
          )}
        </div>
        <Stars value={review.rating} />
        {review.comment && (
          <p className="text-pretty text-sm leading-relaxed">
            {review.comment}
          </p>
        )}
        {review.tags && review.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {review.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-background px-2.5 py-1 text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
