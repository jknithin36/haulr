"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  homePath,
  isRole,
  ROLE_COOKIE,
  type Role,
  roleCookieOptions,
  SESSION_COOKIE,
} from "@/features/user/user-cookies";

/** Only allow redirects back into the app, never to other sites. */
function safeNext(role: Role, next?: string | null) {
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  return homePath(role);
}

/**
 * Starts a demo session. Pass `next: null` to set the cookie without leaving
 * the page (used right after signup, before the "what's first" step).
 */
export async function signIn(role: Role, next?: string | null) {
  if (!isRole(role)) return;
  const store = await cookies();
  store.set(SESSION_COOKIE, role, { ...roleCookieOptions, httpOnly: true });
  store.set(ROLE_COOKIE, role, roleCookieOptions);
  if (next !== null) redirect(safeNext(role, next));
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ROLE_COOKIE);
  redirect("/");
}
