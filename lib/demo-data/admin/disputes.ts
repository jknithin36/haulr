import type { StatusTone } from "@/components/ui/data-display";

export type DisputeStatus = "Open" | "Waiting on user" | "Resolved" | "Closed";
export type Priority = "High" | "Medium" | "Low";

export type Dispute = {
  id: string;
  job: { ref: string; item: string };
  /** Shipper or driver who opened the dispute. */
  openedBy: string;
  against: string;
  /** Most disputes are opened by the shipper; true when the driver opened it. */
  openedByDriver?: boolean;
  reason: string;
  amount: number;
  opened: string;
  priority: Priority;
  status: DisputeStatus;
  claim?: string;
  response?: string;
  /** Who the case is waiting on, for "Waiting on user". */
  waitingOn?: string;
  /** Outcome, for resolved and closed disputes. */
  outcome?: string;
};

export const disputes: Dispute[] = [
  {
    id: "DSP-208",
    job: { ref: "JOB-527", item: "Grand piano" },
    openedBy: "Laura Chen",
    against: "Victor Hale",
    reason: "Damage",
    amount: 1350,
    opened: "Oct 17",
    priority: "High",
    status: "Open",
    claim: "The piano arrived with a cracked leg. It was perfect at pickup.",
    response: "The leg was already loose. I mentioned it at pickup.",
  },
  {
    id: "DSP-207",
    job: { ref: "JOB-524", item: "Dining table and 6 chairs" },
    openedBy: "Tom Becker",
    against: "Luis Martinez",
    reason: "Missing item (one chair)",
    amount: 140,
    opened: "Oct 17",
    priority: "Medium",
    status: "Open",
    claim: "Only five chairs came off the truck. All six were loaded.",
  },
  {
    id: "DSP-206",
    job: { ref: "JOB-521", item: "Sectional sofa" },
    openedBy: "Maria Lopez",
    against: "Kevin Shaw",
    reason: "Late delivery",
    amount: 612,
    opened: "Oct 16",
    priority: "Medium",
    status: "Open",
    claim:
      "Delivery was promised for Oct 14. It’s now two days late and I took time off work twice.",
    response:
      "Truck broke down outside Tulsa. I kept her updated the whole time.",
  },
  {
    id: "DSP-205",
    job: { ref: "JOB-517", item: "Peloton bike" },
    openedBy: "Nina Patel",
    against: "Omar Haddad",
    reason: "Charged for extra stairs",
    amount: 75,
    opened: "Oct 16",
    priority: "Low",
    status: "Open",
    claim:
      "The listing said ground floor. He added $75 for stairs at drop-off.",
  },
  {
    id: "DSP-204",
    job: { ref: "JOB-503", item: "Washer" },
    openedBy: "Victor Hale",
    against: "Ella Ward",
    openedByDriver: true,
    reason: "Shipper not available at pickup",
    amount: 180,
    opened: "Oct 14",
    priority: "Low",
    status: "Open",
    claim:
      "Waited 45 minutes at pickup and nobody answered. Wasted half a day.",
  },
  {
    id: "DSP-201",
    job: { ref: "JOB-488", item: "2016 BMW X3" },
    openedBy: "Paul Grant",
    against: "Derek Ross",
    reason: "Damage (scratch on door)",
    amount: 1020,
    opened: "Oct 13",
    priority: "High",
    status: "Open",
    claim:
      "There’s a long scratch on the driver’s door that wasn’t there before. He stopped replying after delivery.",
  },
  {
    id: "DSP-203",
    job: { ref: "JOB-499", item: "Upright freezer" },
    openedBy: "Grace Kim",
    against: "Luis Martinez",
    reason: "Damage (dent on side)",
    amount: 260,
    opened: "Oct 12",
    priority: "Medium",
    status: "Waiting on user",
    waitingOn: "Grace Kim to send delivery photos",
  },
  {
    id: "DSP-199",
    job: { ref: "JOB-492", item: "Motorcycle" },
    openedBy: "Daniel Price",
    against: "Andre Silva",
    reason: "Late pickup",
    amount: 150,
    opened: "Oct 10",
    priority: "Low",
    status: "Waiting on user",
    waitingOn: "Andre Silva to reply",
  },
  {
    id: "DSP-198",
    job: { ref: "JOB-485", item: "Office desks (4)" },
    openedBy: "Hannah Cole",
    against: "Derek Ross",
    reason: "Delivered to wrong address",
    amount: 210,
    opened: "Oct 9",
    priority: "Medium",
    status: "Waiting on user",
    waitingOn: "Derek Ross to share GPS drop-off",
  },
  {
    id: "DSP-196",
    job: { ref: "JOB-470", item: "Treadmill" },
    openedBy: "Ben Ortiz",
    against: "Kevin Shaw",
    reason: "Damage (cracked display)",
    amount: 320,
    opened: "Oct 6",
    priority: "Medium",
    status: "Resolved",
    outcome: "Partial refund of $120 to the shipper",
  },
  {
    id: "DSP-193",
    job: { ref: "JOB-462", item: "Kayak" },
    openedBy: "James Turner",
    against: "Ella Ward",
    reason: "Late delivery",
    amount: 90,
    opened: "Oct 3",
    priority: "Low",
    status: "Resolved",
    outcome: "No refund, payment released to the driver",
  },
  {
    id: "DSP-190",
    job: { ref: "JOB-455", item: "Upright piano" },
    openedBy: "Elena Garcia",
    against: "Omar Haddad",
    reason: "Damage (scuffed finish)",
    amount: 400,
    opened: "Sep 29",
    priority: "High",
    status: "Resolved",
    outcome: "Sent to the driver’s insurance claim",
  },
  {
    id: "DSP-188",
    job: { ref: "JOB-449", item: "Sofa bed" },
    openedBy: "Ryan Brooks",
    against: "Andre Silva",
    reason: "Late delivery",
    amount: 60,
    opened: "Sep 26",
    priority: "Low",
    status: "Closed",
    outcome: "Withdrawn by the shipper",
  },
];

export const disputeStats = [
  { label: "Open", value: "6" },
  { label: "Over 48 hours", value: "2" },
  { label: "Avg resolution", value: "41 hours" },
  { label: "Resolved this quarter", value: "61" },
];

export const priorityTone: Record<Priority, StatusTone> = {
  High: "danger",
  Medium: "warning",
  Low: "muted",
};

export const disputeTone: Record<DisputeStatus, StatusTone> = {
  Open: "warning",
  "Waiting on user": "info",
  Resolved: "success",
  Closed: "muted",
};

/** Full case file for DSP-208, the piano damage dispute. */
export const pianoCase = {
  pickupPhotos: {
    takenAt: "Oct 12",
    captions: [
      "Front",
      "Left side",
      "Right side",
      "Keyboard",
      "Front left leg",
      "Pedals",
      "Wrapped for transit",
      "Loaded in truck",
    ],
  },
  deliveryPhotos: {
    takenAt: "Oct 14",
    captions: [
      "Unloading",
      "Front",
      "Front left leg",
      "Crack, close-up",
      "Left side",
      "Placed in room",
    ],
  },
  inspection: {
    note: "Front left leg slightly loose",
    signedBy: "Laura Chen",
    when: "Oct 12, 9:34 AM",
  },
  messages: [
    {
      from: "Victor Hale",
      time: "Oct 12, 8:40 AM",
      text: "Here for pickup. I’ll go over the piano with you before we load it.",
    },
    {
      from: "Laura Chen",
      time: "Oct 12, 8:42 AM",
      text: "Great, door’s open. Please be careful with it, it was my mother’s.",
    },
    {
      from: "Victor Hale",
      time: "Oct 12, 9:31 AM",
      text: "Front left leg is a little loose. I put it on the inspection, can you sign?",
    },
    {
      from: "Laura Chen",
      time: "Oct 12, 9:34 AM",
      text: "Signed. It’s always been a bit wobbly but it’s solid.",
    },
    {
      from: "Victor Hale",
      time: "Oct 14, 4:10 PM",
      text: "Delivered and placed in the living room. Thanks Laura.",
    },
    {
      from: "Laura Chen",
      time: "Oct 14, 6:52 PM",
      text: "The front left leg is cracked. It was perfect at pickup. Sending photos.",
    },
    {
      from: "Victor Hale",
      time: "Oct 14, 7:20 PM",
      text: "That leg was already loose, it’s on the inspection you signed.",
    },
  ],
  timeline: [
    { label: "Opened by Laura Chen", time: "Oct 17, 11:05 AM" },
    { label: "Victor Hale responded", time: "11:40 AM" },
  ],
};
