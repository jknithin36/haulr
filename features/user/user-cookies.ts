import type { SessionUser } from "@/lib/demo-data/dashboard/user";

// Shared by the server session, the server actions, proxy.ts, and the client
// hook, so the cookie names and settings live in one place. No server-only
// import: proxy.ts and client components read these too.

export type Role = SessionUser["role"];

/** httpOnly cookie holding the signed-in role. The source of truth. */
export const SESSION_COOKIE = "haulr_session";

/** Readable twin of the session cookie, so client components know who's signed in. */
export const ROLE_COOKIE = "haulr_role";

export function isRole(value: unknown): value is Role {
  return value === "user" || value === "admin";
}

/** Where each role lands after logging in. */
export function homePath(role: Role) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export const roleCookieOptions = {
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
} as const;
