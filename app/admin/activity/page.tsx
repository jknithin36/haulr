import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ActivityView } from "@/features/admin/components/activity/activity-view";

export const metadata: Metadata = { title: "Activity log" };

export default function AdminActivityPage() {
  return (
    <>
      <PageHeader
        title="Activity log"
        description="Every action taken by the Haulr team, newest first."
      />
      <ActivityView />
    </>
  );
}
