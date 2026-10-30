"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The 404 page is prerendered once, so the requested path is only known in the browser.
export function RequestedPath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => null);
}
