import type { StatusTone } from "@/components/ui/data-display";

export type AdminPostStatus = "Published" | "Scheduled" | "Draft";

export const postCategories = [
  "Car shipping",
  "Moving tips",
  "Freight",
  "Driver guides",
  "Pricing",
] as const;

export type PostCategory = (typeof postCategories)[number];

export type AdminPost = {
  id: string;
  title: string;
  category: PostCategory;
  author: string;
  status: AdminPostStatus;
  /** Null until the post is live. */
  views: number | null;
  /** Display date: published, or the scheduled day. Null for drafts. */
  date: string | null;
  /** ISO day for scheduled posts, read by the editor's date picker. */
  scheduledFor?: string;
  excerpt: string;
  tags: string[];
  body: string;
};

/** Totals across the whole blog; the table lists the most recent posts. */
export const postCounts: Record<AdminPostStatus, number> = {
  Published: 24,
  Draft: 3,
  Scheduled: 2,
};

export const statusTone: Record<AdminPostStatus, StatusTone> = {
  Published: "success",
  Scheduled: "info",
  Draft: "muted",
};

export const adminPosts: AdminPost[] = [
  {
    id: "cost-to-ship-a-car-across-the-country",
    title: "How much does it cost to ship a car across the country?",
    category: "Car shipping",
    author: "Haulr Team",
    status: "Published",
    views: 18420,
    date: "Oct 10",
    excerpt:
      "Coast-to-coast car shipping usually lands between $1,100 and $1,800. Here’s what moves the price and how to pay less.",
    tags: ["pricing", "cross-country", "open transport"],
    body: `Most cross-country car shipments on Haulr land between **$1,100 and $1,800**. Where you fall in that range depends on a few things you can control and a few you can’t.

## What moves the price

- **Distance and route.** Busy interstate corridors are cheaper per mile than rural pickups.
- **Vehicle size.** An SUV or pickup takes more room than a sedan.
- **Open or enclosed.** Enclosed transport costs about 40% more.
- **Timing.** Flexible dates get more offers.

## How to pay less

Post your car a week or two ahead and give drivers a pickup window instead of a single day. You’ll usually get several offers within *48 hours*.

> Tip: compare offers by total price and the driver’s reviews, not just the lowest number.

Ready to see real prices? [Get an estimate](/estimate) in under a minute.`,
  },
  {
    id: "prepare-your-car-before-shipping",
    title: "How to prepare your car before shipping",
    category: "Car shipping",
    author: "Haulr Team",
    status: "Published",
    views: 9860,
    date: "Oct 8",
    excerpt:
      "A short checklist to get your car ready for pickup, from photos to fuel level.",
    tags: ["checklist", "pickup"],
    body: `A little prep makes pickup faster and protects you if anything goes wrong.

## Before the driver arrives

1. Wash the car so marks are easy to see.
2. Take photos of every side, in daylight.
3. Leave about a quarter tank of fuel.
4. Remove toll tags and personal items.

> Mention any leaks or quirks to your driver up front.`,
  },
  {
    id: "drivers-earn-more-sharing-empty-space",
    title: "How drivers can earn more by sharing empty space",
    category: "Driver guides",
    author: "Nithin Kumar",
    status: "Published",
    views: 4210,
    date: "Oct 2",
    excerpt:
      "Return trips don’t have to run empty. Post your route and let shippers come to you.",
    tags: ["drivers", "return trips"],
    body: `Every empty mile is money left on the road. Posting your trip on Haulr lets shippers along your route find you.

## Post your space early

Drivers who post a trip **three or more days** ahead fill about twice as much space.`,
  },
  {
    id: "ship-a-car-in-winter",
    title: "How to ship a car in winter",
    category: "Car shipping",
    author: "Nithin Kumar",
    status: "Scheduled",
    views: null,
    date: "Nov 3",
    scheduledFor: "2026-11-03",
    excerpt:
      "Snow, salt and short days change how car shipping works. Here’s how to plan around them.",
    tags: ["winter", "seasonal"],
    body: `Winter routes take longer and pickups are harder to time. Plan for it and you’ll avoid most delays.

## Build in extra days

Add **two or three days** to your delivery window on northern routes.

## Consider enclosed transport

Road salt is hard on paint. For a car you care about, *enclosed transport* is worth the extra cost.`,
  },
  {
    id: "moving-checklist-30-days",
    title: "Moving checklist: 30 days before your move",
    category: "Moving tips",
    author: "Haulr Team",
    status: "Draft",
    views: null,
    date: null,
    excerpt: "",
    tags: ["moving", "checklist"],
    body: `## Four weeks out

- Book your driver
- Start packing rooms you rarely use
- Order boxes and tape`,
  },
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
