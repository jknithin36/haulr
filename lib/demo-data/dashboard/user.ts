/**
 * The one demo account the dashboard is built around. Sarah ships things and
 * also drives a box truck, so every section has data.
 */
export const currentUser = {
  name: "Sarah Miller",
  firstName: "Sarah",
  email: "sarah.miller@example.com",
  phone: "(214) 555-0186",
  location: "Dallas, TX",
  memberSince: "March 2024",
  rating: 4.9,
  reviewCount: 38,
  verified: true,
  plan: "Pro Driver",
  about:
    "Careful, on-time driver based in Dallas. I run regular trips across Texas and the Midwest.",
};

export type SessionUser = {
  name: string;
  email: string;
  role: "user" | "admin";
};
