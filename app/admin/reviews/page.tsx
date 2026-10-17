import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ReviewsView } from "@/features/admin/components/reviews/reviews-view";
import { reviewStats } from "@/lib/demo-data/admin/reviews";

export const metadata: Metadata = { title: "Reviews" };

export default function AdminReviewsPage() {
  return (
    <>
      <PageHeader title="Reviews" description={reviewStats} />
      <ReviewsView />
    </>
  );
}
