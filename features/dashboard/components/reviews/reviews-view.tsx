import { ReviewsViewClient } from "@/features/dashboard/components/reviews/reviews-view-client";
import { getReviews } from "@/features/dashboard/dashboard-queries";

export async function ReviewsView() {
  const { summary, aboutMe, written, pending } = await getReviews();
  return (
    <ReviewsViewClient
      summary={summary}
      aboutMe={aboutMe}
      initialWritten={written}
      initialPending={pending}
    />
  );
}
