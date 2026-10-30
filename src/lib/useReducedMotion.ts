"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (!window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia ? window.matchMedia(query).matches : true;
}

// Keep the server and first hydration render fully visible. Only start motion
// after the browser preference is known, and respond to later preference changes.
function getServerSnapshot(): boolean | null {
  return null;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
