import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { JobsView } from "@/features/dashboard/components/jobs/jobs-view";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPage() {
  return (
    <>
      <PageHeader
        title="Jobs"
        description="Everything you need to pick up and deliver."
      />
      <JobsView />
    </>
  );
}
