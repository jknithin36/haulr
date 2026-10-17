/** Admin revenue sample data: month to date, October 1–17, 2026. */

export const revenueSummary = [
  { label: "Booking fees", value: "$26,430", change: "13.1%" },
  {
    label: "Pro Driver plans",
    detail: "312 × $29",
    value: "$9,048",
    change: "7.6%",
  },
  {
    label: "Business plans",
    detail: "28 × $99",
    value: "$2,772",
    change: "12.0%",
  },
  { label: "Total", value: "$38,250", change: "11.8%" },
];

export const revenueByMonth = [
  { label: "May", title: "May", value: 41200 },
  { label: "Jun", title: "June", value: 48900 },
  { label: "Jul", title: "July", value: 55300 },
  { label: "Aug", title: "August", value: 58100 },
  { label: "Sep", title: "September", value: 61700 },
  { label: "Oct", title: "October (to date)", value: 38250, partial: true },
];

export const feesByPlan = [
  {
    plan: "Free",
    feeRate: "8%",
    bookings: 401,
    bookingValue: 214300,
    fees: 17144,
  },
  {
    plan: "Pro Driver",
    feeRate: "5%",
    bookings: 238,
    bookingValue: 162780,
    fees: 8139,
  },
  {
    plan: "Business",
    feeRate: "3%",
    bookings: 45,
    bookingValue: 35780,
    fees: 1073,
  },
];

export const subscriptions = {
  activePro: 312,
  activeBusiness: 28,
  newThisMonth: 41,
  cancelled: 9,
  churn: "2.6%",
  mrr: "$11,820",
};
