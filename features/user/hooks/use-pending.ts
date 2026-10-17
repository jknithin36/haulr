"use client";

import { useEffect, useRef, useState } from "react";

/**
 * There's no backend yet, so auth actions fake a short request:
 * mark which action is pending, wait a beat, then run `then`.
 */
export function usePending<T extends string>(delay = 700) {
  const [pending, setPending] = useState<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function start(action: T, then: () => void) {
    if (pending) return;
    setPending(action);
    timer.current = setTimeout(then, delay);
  }

  return { pending, start };
}
