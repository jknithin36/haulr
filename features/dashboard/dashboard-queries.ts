import "server-only";
import { jobs } from "@/lib/demo-data/dashboard/jobs";
import { conversations } from "@/lib/demo-data/dashboard/messages";
import { notifications } from "@/lib/demo-data/dashboard/notifications";
import { offers } from "@/lib/demo-data/dashboard/offers";
import {
  earnings,
  earningsSummary,
  monthlyEarnings,
  paymentsMade,
  payoutSettings,
} from "@/lib/demo-data/dashboard/payments";
import {
  pendingReviews,
  ratingSummary,
  reviewsAboutMe,
  reviewsIWrote,
} from "@/lib/demo-data/dashboard/reviews";
import { savedShipments, savedTrips } from "@/lib/demo-data/dashboard/saved";
import {
  billingHistory,
  currentPlan,
  notificationDefaults,
  plans,
  profileDefaults,
  sessions,
  verificationItems,
} from "@/lib/demo-data/dashboard/settings";
import { myShipments } from "@/lib/demo-data/dashboard/shipments";
import {
  activeShipment,
  pastTracking,
} from "@/lib/demo-data/dashboard/tracking";
import {
  completedTrip,
  confirmedBookings,
  spotRequests,
  upcomingTrip,
} from "@/lib/demo-data/dashboard/trips";
import { currentUser } from "@/lib/demo-data/dashboard/user";
import { vehicles } from "@/lib/demo-data/dashboard/vehicles";

/*
 * Reads for the signed-in user's dashboard. Each one returns the demo account's
 * data today and is the single place to swap in a real database call. They are
 * async so callers already await them the way they would a real query.
 */

/** Name and plan shown in the sidebar and next to the user's own messages. */
export async function getAccount() {
  return { name: currentUser.name, plan: currentUser.plan };
}

export async function getMyShipments() {
  return myShipments;
}

export async function getTracking() {
  return { active: activeShipment, past: pastTracking };
}

export async function getMyOffers() {
  return offers;
}

export async function getMyTrips() {
  return {
    upcoming: upcomingTrip,
    spotRequests,
    bookings: confirmedBookings,
    completed: completedTrip,
  };
}

export async function getMyJobs() {
  return jobs;
}

export async function getMyVehicles() {
  return vehicles;
}

export async function getConversations() {
  return conversations;
}

export async function getPayments() {
  return {
    summary: earningsSummary,
    monthlyEarnings,
    earnings,
    paymentsMade,
    payout: payoutSettings,
  };
}

export async function getReviews() {
  return {
    summary: ratingSummary,
    aboutMe: reviewsAboutMe,
    written: reviewsIWrote,
    pending: pendingReviews,
  };
}

export async function getSavedItems() {
  return { shipments: savedShipments, trips: savedTrips };
}

export async function getNotifications() {
  return notifications;
}

export async function getSettings() {
  return {
    profile: profileDefaults,
    verification: verificationItems,
    notificationPrefs: notificationDefaults,
    sessions,
    contact: { email: currentUser.email, phone: currentUser.phone },
    plan: currentPlan,
    plans,
    billingHistory,
  };
}
