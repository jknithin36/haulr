export type CheckResult = "pass" | "warn" | "fail";

export type AutoCheck = { label: string; result: CheckResult };

export type DocKind = "license" | "insurance" | "vehicle" | "business";

export type ChecklistKey = "name" | "expiry" | "photo" | "coverage";

export type VerificationItem = {
  id: string;
  user: string;
  /** Link to the user's admin page, when there is one. */
  userId?: string;
  email: string;
  location: string;
  accountType: string;
  joined: string;
  document: string;
  kind: DocKind;
  uploaded: string;
  waiting: string;
  /** Waiting longer than the 24-hour target. */
  overdue?: boolean;
  checks: AutoCheck[];
  /** Name printed on the document. */
  nameOnDocument: string;
  /** Rows shown next to the preview, e.g. license number or policy. */
  fields: { label: string; value: string }[];
  /** Coverage in dollars, for insurance and vehicle documents. */
  coverage?: number;
  /** Starting state for the reviewer checklist, from the auto-checks. */
  checklist: Record<ChecklistKey, boolean>;
  /** Show the preview blurred, to match a "photo unclear" auto-check. */
  blurry?: boolean;
};

export const verificationStats = {
  pending: 23,
  avgReview: "6h 20m",
  approvedRate: "94%",
};

export const minimumCoverage = 50000;

export const verificationQueue: VerificationItem[] = [
  {
    id: "kevin-shaw-insurance",
    user: "Kevin Shaw",
    userId: "kevin-shaw",
    email: "kevin.shaw@example.com",
    location: "Amarillo, TX",
    accountType: "Driver",
    joined: "Jul 2026",
    document: "Insurance certificate",
    kind: "insurance",
    uploaded: "Oct 17, 11:09 AM",
    waiting: "10 min",
    checks: [
      { label: "Name matches", result: "pass" },
      { label: "Expiry ok", result: "pass" },
    ],
    nameOnDocument: "Kevin Shaw",
    fields: [
      { label: "Insurer", value: "Lone Star Mutual" },
      { label: "Policy", value: "LSM-CA-4471920" },
      { label: "Coverage", value: "$100,000 cargo" },
      { label: "Valid", value: "Oct 1, 2026 – Oct 1, 2027" },
    ],
    coverage: 100000,
    checklist: { name: true, expiry: true, photo: true, coverage: true },
  },
  {
    id: "sarah-miller-trailer",
    user: "Sarah Miller",
    userId: "sarah-miller",
    email: "sarah.miller@example.com",
    location: "Dallas, TX",
    accountType: "Shipper and driver",
    joined: "Mar 2024",
    document: "Vehicle: 2022 Big Tex trailer",
    kind: "vehicle",
    uploaded: "Oct 13",
    waiting: "4 days",
    overdue: true,
    checks: [{ label: "Plate readable", result: "pass" }],
    nameOnDocument: "Sarah Miller",
    fields: [
      { label: "Vehicle", value: "2022 Big Tex 70CH" },
      { label: "Type", value: "2-car open trailer" },
      { label: "Plate", value: "TX 9TL-0457" },
      { label: "Insurance", value: "$150,000 · exp Jan 2027" },
    ],
    coverage: 150000,
    checklist: { name: true, expiry: true, photo: true, coverage: true },
  },
  {
    id: "grace-thompson-license",
    user: "Grace Thompson",
    email: "grace.t@example.com",
    location: "Tulsa, OK",
    accountType: "Driver",
    joined: "Oct 2026",
    document: "Driver’s license",
    kind: "license",
    uploaded: "Oct 17, 10:52 AM",
    waiting: "28 min",
    checks: [{ label: "Photo unclear", result: "warn" }],
    nameOnDocument: "Grace Thompson",
    fields: [
      { label: "State", value: "Oklahoma" },
      { label: "License", value: "Unreadable" },
      { label: "Expires", value: "Unreadable" },
    ],
    checklist: { name: true, expiry: false, photo: false, coverage: false },
    blurry: true,
  },
  {
    id: "owen-price-business",
    user: "Owen Price",
    email: "owen@pricefreight.example.com",
    location: "Memphis, TN",
    accountType: "Business",
    joined: "Oct 2026",
    document: "Business registration",
    kind: "business",
    uploaded: "Oct 16",
    waiting: "1 day",
    overdue: true,
    checks: [{ label: "Company found", result: "pass" }],
    nameOnDocument: "Price Freight LLC",
    fields: [
      { label: "Company", value: "Price Freight LLC" },
      { label: "State", value: "Tennessee" },
      { label: "Registered", value: "Mar 4, 2021" },
      { label: "Status", value: "Active" },
    ],
    checklist: { name: true, expiry: true, photo: true, coverage: false },
  },
  {
    id: "nina-ford-license",
    user: "Nina Ford",
    email: "nina.ford@example.com",
    location: "Kansas City, MO",
    accountType: "Driver",
    joined: "Oct 2026",
    document: "Driver’s license",
    kind: "license",
    uploaded: "Oct 15",
    waiting: "2 days",
    overdue: true,
    checks: [{ label: "Name mismatch", result: "fail" }],
    nameOnDocument: "Nina Calloway",
    fields: [
      { label: "State", value: "Missouri" },
      { label: "License", value: "M0418 2297 1" },
      { label: "Expires", value: "Jun 2029" },
    ],
    checklist: { name: false, expiry: true, photo: true, coverage: false },
  },
];

export const rejectionReasons = [
  { value: "blurry", label: "Blurry photo" },
  { value: "expired", label: "Expired" },
  { value: "name", label: "Name doesn’t match" },
  { value: "wrong-type", label: "Wrong document type" },
] as const;

export type RejectionReason = (typeof rejectionReasons)[number]["value"];

/** What we call the document when writing to the user. */
const docNoun: Record<DocKind, string> = {
  license: "license",
  insurance: "insurance certificate",
  vehicle: "vehicle registration",
  business: "business registration",
};

const photoPart: Record<DocKind, string> = {
  license: "the front",
  insurance: "the full page",
  vehicle: "the full document",
  business: "the full page",
};

export function messageFor(kind: DocKind, reason: RejectionReason) {
  const doc = docNoun[kind];
  switch (reason) {
    case "blurry":
      return `Your ${doc} photo is blurry. Please upload a clear photo of ${photoPart[kind]}.`;
    case "expired":
      return `Your ${doc} has expired. Please upload a current one.`;
    case "name":
      return `The name on your ${doc} doesn’t match your account. Please upload one in your name, or reply to update the name on your account.`;
    case "wrong-type":
      return `This doesn’t look like a ${doc}. Please upload your ${doc} instead.`;
  }
}

/** Best guess at why a document fails, from its auto-checks. */
export function suggestedReason(item: VerificationItem): RejectionReason {
  if (item.blurry) return "blurry";
  if (!item.checklist.name) return "name";
  if (!item.checklist.expiry) return "expired";
  return "blurry";
}

export function needsCoverage(kind: DocKind) {
  return kind === "insurance" || kind === "vehicle";
}
