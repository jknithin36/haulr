import type { Metadata } from "next";
import { JobsView } from "@/features/admin/components/jobs/jobs-view";

export const metadata: Metadata = { title: "Jobs" };

export default function AdminJobsPage() {
  return <JobsView />;
}
