import "server-only";
import { cookies } from "next/headers";
import { isRole, SESSION_COOKIE } from "@/features/user/user-cookies";
import { adminUser } from "@/lib/demo-data/admin/admin-user";
import { currentUser, type SessionUser } from "@/lib/demo-data/dashboard/user";

/**
 * Demo session: the cookie only says which role is signed in. "user" maps to
 * the sample user (Sarah) and "admin" to the sample admin (Nithin). Swap this
 * for real auth before launch.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const role = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!isRole(role)) return null;
  const account = role === "admin" ? adminUser : currentUser;
  return { name: account.name, email: account.email, role };
}
