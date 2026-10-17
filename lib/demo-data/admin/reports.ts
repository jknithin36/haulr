import type { StatusTone } from "@/components/ui/data-display";

export type ReportType = "Shipment" | "User" | "Message" | "Review";
export type ReportState = "Open" | "Resolved" | "Dismissed";

export type Report = {
  id: string;
  type: ReportType;
  item: string;
  reason: string;
  reportedBy: string;
  date: string;
  state: ReportState;
  /** Shown after the state, like "suspended" or "removed". */
  outcome?: string;
  /** What was reported, as the admin sees it in the detail sheet. */
  content: {
    label: string;
    /** Who wrote or owns the content. */
    author: string;
    text: string;
    meta?: string;
    /** Hidden until the admin chooses to look, for abusive content. */
    sensitive?: boolean;
  };
};

export const reports: Report[] = [
  {
    id: "RPT-735",
    type: "User",
    item: "User #31208",
    reason: "Fake profile photo",
    reportedBy: "System",
    date: "Oct 17",
    state: "Open",
    content: {
      label: "Profile",
      author: "User #31208",
      text: "Driver account created Oct 16. Profile photo matches a stock image. No vehicle or license uploaded yet.",
      meta: "Signed up Oct 16 · 0 jobs",
    },
  },
  {
    id: "RPT-734",
    type: "Message",
    item: "Message from User #31190",
    reason: "Shared phone number before booking",
    reportedBy: "System",
    date: "Oct 17",
    state: "Open",
    content: {
      label: "Message",
      author: "User #31190",
      text: "Easier to sort this out by text. My number is [hidden by Haulr].",
      meta: "Sent Oct 17, 8:12 AM on SHP-1072",
    },
  },
  {
    id: "RPT-733",
    type: "Shipment",
    item: "SHP-1066 “Fireworks assortment”",
    reason: "Prohibited item (explosives)",
    reportedBy: "System",
    date: "Oct 16",
    state: "Open",
    content: {
      label: "Listing",
      author: "Posted by User #30977",
      text: "Two pallets of consumer fireworks, boxed. Need them in Tulsa before the weekend.",
      meta: "Posted Oct 16 · 2 offers",
    },
  },
  {
    id: "RPT-731",
    type: "Shipment",
    item: "SHP-1038 “iPhone 17 bundle”",
    reason: "Looks like a scam",
    reportedBy: "System + 3 users",
    date: "Oct 14",
    state: "Open",
    content: {
      label: "Listing",
      author: "Posted by User #30812",
      text: "12 sealed iPhone 17 Pro units. Driver pays me on pickup with gift cards and I’ll add a $300 bonus. Need it gone today.",
      meta: "Posted Oct 14 · 9 offers",
    },
  },
  {
    id: "RPT-730",
    type: "User",
    item: "User #30871",
    reason: "Multiple accounts",
    reportedBy: "System",
    date: "Oct 15",
    state: "Open",
    content: {
      label: "Profile",
      author: "User #30871",
      text: "Same phone and payout bank as two other accounts created this month. All three bid on the same shipments.",
      meta: "Signed up Oct 2 · 3 jobs",
    },
  },
  {
    id: "RPT-728",
    type: "Shipment",
    item: "SHP-1049 “Pallet of tools”",
    reason: "Asks for cash payment",
    reportedBy: "Hannah Cole",
    date: "Oct 15",
    state: "Open",
    content: {
      label: "Listing",
      author: "Posted by User #30655",
      text: "Pallet of hand tools, about 400 lbs. Paying cash at drop-off only, no app payments.",
      meta: "Posted Oct 13 · 4 offers",
    },
  },
  {
    id: "RPT-727",
    type: "Message",
    item: "Message from Derek Ross",
    reason: "Asked to pay outside Haulr",
    reportedBy: "Paul Grant",
    date: "Oct 15",
    state: "Open",
    content: {
      label: "Message",
      author: "Derek Ross to Paul Grant",
      text: "Hey Paul, if you send the balance by Zelle instead I’ll take $80 off. Saves us both the Haulr fee. Just keep it off the app.",
      meta: "Sent Oct 15, 7:48 PM on JOB-488",
    },
  },
  {
    id: "RPT-726",
    type: "Message",
    item: "Message from Andre Silva",
    reason: "Rude language",
    reportedBy: "Grace Kim",
    date: "Oct 14",
    state: "Open",
    content: {
      label: "Message",
      author: "Andre Silva to Grace Kim",
      text: "[removed: rude language] Stop messaging me about the pickup time.",
      meta: "Sent Oct 14, 6:05 PM on JOB-499",
      sensitive: true,
    },
  },
  {
    id: "RPT-724",
    type: "Review",
    item: "Review on Kevin Shaw",
    reason: "Abusive language",
    reportedBy: "Kevin Shaw",
    date: "Oct 13",
    state: "Open",
    content: {
      label: "Review · ★1",
      author: "Unknown user on JOB-421",
      text: "[removed: abusive language]",
      meta: "Left Oct 13",
      sensitive: true,
    },
  },
  {
    id: "RPT-725",
    type: "User",
    item: "User #30612",
    reason: "Pretending to be Haulr support",
    reportedBy: "2 users",
    date: "Oct 13",
    state: "Open",
    content: {
      label: "Profile",
      author: "User #30612",
      text: "Display name “Haulr Support Team”. Messaged two drivers asking them to confirm their bank login.",
      meta: "Signed up Oct 11 · 0 jobs",
    },
  },
  {
    id: "RPT-723",
    type: "Review",
    item: "Review on Tom Becker",
    reason: "Mentions a different job",
    reportedBy: "Tom Becker",
    date: "Oct 12",
    state: "Open",
    content: {
      label: "Review · ★2",
      author: "Omar Haddad on JOB-468",
      text: "Last time he made me wait an hour at pickup. This time was fine I guess.",
      meta: "Left Oct 12",
    },
  },
  {
    id: "RPT-729",
    type: "User",
    item: "User #30544",
    reason: "Spam offers",
    reportedBy: "System",
    date: "Oct 16",
    state: "Resolved",
    outcome: "suspended",
    content: {
      label: "Profile",
      author: "User #30544",
      text: "Sent the same $1 offer with an outside link to 140 shipments in two hours.",
      meta: "Signed up Oct 15 · 0 jobs",
    },
  },
  {
    id: "RPT-720",
    type: "Shipment",
    item: "SHP-1011 “Live parrots”",
    reason: "Prohibited item (live animals)",
    reportedBy: "James Turner",
    date: "Oct 11",
    state: "Resolved",
    outcome: "removed",
    content: {
      label: "Listing",
      author: "Posted by User #30420",
      text: "Two African grey parrots in travel cages, Houston to Austin.",
      meta: "Posted Oct 10 · removed Oct 11",
    },
  },
  {
    id: "RPT-716",
    type: "Review",
    item: "Review on Sarah Miller",
    reason: "Unfair rating",
    reportedBy: "Sarah Miller",
    date: "Oct 8",
    state: "Dismissed",
    content: {
      label: "Review · ★4",
      author: "Ben Ortiz on JOB-461",
      text: "A little late, but everything arrived perfect.",
      meta: "Left Oct 4",
    },
  },
  {
    id: "RPT-712",
    type: "Message",
    item: "Message from Mike Reed",
    reason: "Spam",
    reportedBy: "User #30544",
    date: "Oct 6",
    state: "Dismissed",
    content: {
      label: "Message",
      author: "Mike Reed to User #30544",
      text: "Hi, I have room on my Dallas to Austin run Friday if you still need the dresser moved.",
      meta: "Sent Oct 6, 10:02 AM",
    },
  },
];

export function reportStatus(r: Pick<Report, "state" | "outcome">) {
  if (r.state === "Resolved" && r.outcome === "suspended")
    return "Action taken · suspended";
  if (r.outcome) return `${r.state} · ${r.outcome}`;
  return r.state;
}

export const reportTone: Record<ReportState, StatusTone> = {
  Open: "warning",
  Resolved: "success",
  Dismissed: "muted",
};
