import { type NextRequest, NextResponse } from "next/server";
import {
  homePath,
  isRole,
  ROLE_COOKIE,
  roleCookieOptions,
  SESSION_COOKIE,
} from "@/features/user/user-cookies";

/** Keeps the dashboards behind login, the admin area admin-only, and skips login when already signed in. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const value = request.cookies.get(SESSION_COOKIE)?.value;
  const role = isRole(value) ? value : null;

  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) &&
    !role
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // The admin area is for admins only; signed-in users go to their dashboard.
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && role) {
    return NextResponse.redirect(new URL(homePath(role), request.url));
  }

  // Keep the readable role cookie matching the real session, so client
  // components (offer panels, banners) know who's signed in.
  const response = NextResponse.next();
  const shown = request.cookies.get(ROLE_COOKIE)?.value;
  if (role && shown !== role) {
    response.cookies.set(ROLE_COOKIE, role, roleCookieOptions);
  } else if (!role && shown) {
    response.cookies.delete(ROLE_COOKIE);
  }
  return response;
}

export const config = {
  // Every page, but not Next.js internals or static files.
  matcher: ["/((?!_next/|.*\\.[\\w]+$).*)"],
};
