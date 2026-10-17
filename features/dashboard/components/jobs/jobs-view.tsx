import { JobsViewClient } from "@/features/dashboard/components/jobs/jobs-view-client";
import { getMyJobs } from "@/features/dashboard/dashboard-queries";

export async function JobsView() {
  const jobs = await getMyJobs();
  return <JobsViewClient initialJobs={jobs} />;
}
