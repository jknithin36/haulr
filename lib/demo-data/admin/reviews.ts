import type { StatusTone } from "@/components/ui/data-display";

export type ReviewStatus = "Visible" | "Flagged" | "Hidden";

export type AdminReview = {
  id: string;
  from: string;
  to: string;
  job: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  /** Job is under dispute; the review stays up but is marked. */
  inDispute?: boolean;
  /** Why the system or a user flagged it. */
  flagReason?: string;
  /** Hidden behind a toggle so nobody reads it by accident. */
  sensitive?: { label: string; redacted: string };
};

export const reviews: AdminReview[] = [
  {
    id: "REV-9921",
    from: "Ryan Brooks",
    to: "Sarah Miller",
    job: "TRP-298",
    rating: 5,
    comment: "On time and very careful with my furniture.",
    date: "Oct 13",
    status: "Visible",
  },
  {
    id: "REV-9917",
    from: "Elena Garcia",
    to: "Mike Reed",
    job: "JOB-466",
    rating: 5,
    comment: "Kept me updated the whole trip.",
    date: "Oct 12",
    status: "Visible",
  },
  {
    id: "REV-9884",
    from: "Ben Ortiz",
    to: "Sarah Miller",
    job: "JOB-461",
    rating: 4,
    comment: "A little late, but everything arrived perfect.",
    date: "Oct 4",
    status: "Visible",
  },
  {
    id: "REV-9919",
    from: "Unknown user",
    to: "Kevin Shaw",
    job: "JOB-421",
    rating: 1,
    comment: "(abusive language)",
    date: "Oct 13",
    status: "Flagged",
    flagReason: "Abusive language",
    sensitive: {
      label: "(abusive language)",
      redacted: "[removed: abusive language]",
    },
  },
  {
    id: "REV-9925",
    from: "Paul Grant",
    to: "Derek Ross",
    job: "JOB-488",
    rating: 2,
    comment: "Scratched my door and stopped replying.",
    date: "Oct 14",
    status: "Visible",
    inDispute: true,
  },
  {
    id: "REV-9913",
    from: "Omar Haddad",
    to: "Tom Becker",
    job: "JOB-468",
    rating: 2,
    comment:
      "Last time he made me wait an hour at pickup. This time was fine I guess.",
    date: "Oct 12",
    status: "Flagged",
    flagReason: "Mentions a different job",
  },
  {
    id: "REV-9908",
    from: "Grace Kim",
    to: "Luis Martinez",
    job: "JOB-458",
    rating: 3,
    comment: "Fine trip. Next time just text me and we can skip the app fee.",
    date: "Oct 10",
    status: "Flagged",
    flagReason: "Suggests paying outside Haulr",
  },
  {
    id: "REV-9902",
    from: "Daniel Price",
    to: "Andre Silva",
    job: "JOB-452",
    rating: 3,
    comment: "Showed up late to [address removed] but the bike was fine.",
    date: "Oct 8",
    status: "Flagged",
    flagReason: "Personal information",
  },
  {
    id: "REV-9895",
    from: "James Turner",
    to: "Ella Ward",
    job: "JOB-462",
    rating: 4,
    comment: "Kayak arrived without a scratch. A day later than planned.",
    date: "Oct 7",
    status: "Visible",
  },
  {
    id: "REV-9890",
    from: "Hannah Cole",
    to: "Luis Martinez",
    job: "JOB-447",
    rating: 5,
    comment: "Friendly, quick, and wrapped everything twice.",
    date: "Oct 6",
    status: "Visible",
  },
  {
    id: "REV-9871",
    from: "User #30544",
    to: "Ella Ward",
    job: "JOB-440",
    rating: 1,
    comment: "(link removed)",
    date: "Oct 3",
    status: "Hidden",
    flagReason: "Spam link",
  },
];

export const reviewStats = "3,214 reviews · avg ★ 4.8 · 4 flagged";

export const reviewTone: Record<ReviewStatus, StatusTone> = {
  Visible: "success",
  Flagged: "danger",
  Hidden: "muted",
};
