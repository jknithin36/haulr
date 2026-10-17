"use client";

import { useSyncExternalStore } from "react";
import { isRole, ROLE_COOKIE } from "@/features/user/user-cookies";

// Only the server writes this cookie (server actions and proxy.ts), and those
// responses re-render the page, so there is nothing to subscribe to.
const subscribe = () => () => {};

function readRole() {
  const value = document.cookie
    .split("; ")
    .find((pair) => pair.startsWith(`${ROLE_COOKIE}=`))
    ?.slice(ROLE_COOKIE.length + 1);
  return isRole(value) ? value : null;
}

/**
 * Who is signed in, for client components that change with the session.
 * `undefined` until the browser has rendered (the server can't know), then
 * "user", "admin", or `null` when signed out.
 */
export function useSessionRole() {
  return useSyncExternalStore(subscribe, readRole, () => undefined);
}
