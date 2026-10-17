import { SiteHeader } from "@/components/site-header";
import { getSessionUser } from "@/features/user/user-session";

/** Reads the session cookie, so it must render inside a <Suspense> boundary. */
export async function SessionHeader() {
  return <SiteHeader user={await getSessionUser()} />;
}
