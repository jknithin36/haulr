import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TrackingView } from "@/features/dashboard/components/tracking/tracking-view";

export const metadata: Metadata = { title: "Tracking" };

export default function TrackingPage() {
  return (
    <>
      <PageHeader
        title="Tracking"
        description="Follow your shipments in real time."
      />
      <TrackingView />
    </>
  );
}
