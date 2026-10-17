import "server-only";
import { notFound } from "next/navigation";
import { type AdminPost, adminPosts } from "@/lib/demo-data/admin/blog";
import { disputes } from "@/lib/demo-data/admin/disputes";
import {
  adminShipments,
  getShipmentDetail,
} from "@/lib/demo-data/admin/shipments";
import { users } from "@/lib/demo-data/admin/users";

// Detail reads for the admin area go through this file so the in-memory demo
// data can be swapped for a database without touching the components. The
// data never changes at runtime, so there's nothing to cache or tag yet.

export async function getAdminShipmentIds() {
  return adminShipments.map((shipment) => shipment.id);
}

/** The shipment and its full case file, or the not-found page. */
export async function getAdminShipment(id: string) {
  const shipment = adminShipments.find((s) => s.id === id);
  if (!shipment) notFound();
  return { shipment, detail: getShipmentDetail(shipment) };
}

export async function getAdminUserIds() {
  return users.map((user) => user.id);
}

/** The user with this id, or the not-found page. */
export async function getAdminUser(id: string) {
  const user = users.find((u) => u.id === id);
  if (!user) notFound();
  return user;
}

export async function getDisputeIds() {
  return disputes.map((dispute) => dispute.id);
}

/** The dispute with this id, or the not-found page. */
export async function getDispute(id: string) {
  const dispute = disputes.find((d) => d.id === id);
  if (!dispute) notFound();
  return dispute;
}

export async function getAdminPostIds() {
  return adminPosts.map((post) => post.id);
}

/**
 * The post with this id, or the not-found page. Duplicates made on the list
 * page ("…-copy", "…-copy-2") only exist in the browser, so they open as a
 * fresh draft of the original.
 */
export async function getAdminPost(id: string): Promise<AdminPost> {
  const post = adminPosts.find((p) => p.id === id);
  if (post) return post;
  const sourceId = id.replace(/-copy(-\d+)?$/, "");
  const source = adminPosts.find((p) => p.id === sourceId);
  if (!source) notFound();
  return {
    ...source,
    id,
    title: `Copy of ${source.title}`,
    status: "Draft",
    views: null,
    date: null,
    scheduledFor: undefined,
  };
}
