export type Review = {
  id: string;
  /** The other person: who wrote it (about me) or who it's for (I wrote). */
  person: string;
  ref: string;
  rating: number;
  comment: string;
  date?: string;
  tags?: string[];
};

export type PendingReview = {
  id: string;
  person: string;
  ref: string;
  summary: string;
};

export type RatingSummary = {
  average: number;
  count: number;
  breakdown: { stars: number; count: number }[];
};

export const ratingSummary: RatingSummary = {
  average: 4.9,
  count: 38,
  breakdown: [
    { stars: 5, count: 34 },
    { stars: 4, count: 3 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

export const reviewsAboutMe: Review[] = [
  {
    id: "r1",
    person: "Ryan Brooks",
    ref: "TRP-298",
    rating: 5,
    comment: "Sarah was on time and very careful with my furniture.",
    date: "Oct 13",
  },
  {
    id: "r2",
    person: "Hannah Cole",
    ref: "JOB-476",
    rating: 5,
    comment: "Great communication from start to finish.",
    date: "Oct 6",
  },
  {
    id: "r3",
    person: "Ben Ortiz",
    ref: "JOB-461",
    rating: 4,
    comment: "Arrived a little late, but everything was in perfect shape.",
    date: "Oct 4",
  },
];

export const reviewsIWrote: Review[] = [
  {
    id: "w1",
    person: "Luis Martinez",
    ref: "SHP-0912",
    rating: 5,
    comment: "Fast, friendly, and careful. Would book again.",
  },
];

export const pendingReviews: PendingReview[] = [
  {
    id: "p1",
    person: "James Turner",
    ref: "SHP-0988",
    summary: "James Turner delivered your Queen bed and dresser on Sep 28.",
  },
];

export const reviewHighlights = [
  "On time",
  "Careful with items",
  "Good communication",
  "Friendly",
];
