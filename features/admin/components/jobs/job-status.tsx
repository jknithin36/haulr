import { StatusBadge } from "@/components/ui/data-display";
import { type AdminJob, jobTone } from "@/lib/demo-data/admin/jobs";

export type JobState = AdminJob & { refund?: number };

/** "In transit · 42%", "Late · 2 days", "Delivered" plus a dispute tag. */
export function JobStatus({ job }: { job: JobState }) {
  return (
    <span className="flex items-center gap-1.5">
      <StatusBadge tone={jobTone[job.status]}>
        {job.status}
        {job.statusNote && !job.disputed && (
          <span className="opacity-70 tabular-nums">· {job.statusNote}</span>
        )}
      </StatusBadge>
      {job.disputed && <StatusBadge tone="danger">Disputed</StatusBadge>}
    </span>
  );
}
