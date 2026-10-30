"use client";

import { useSyncExternalStore } from "react";

// Smooth-scroll to an element by hash and record it in history, as a native
// anchor would, without the instant jump. Returns false if the target is missing.
export function scrollToHash(hash: string, reducedMotion: boolean | null) {
  const target = document.querySelector(hash);
  if (!target) return false;
  target.scrollIntoView({ behavior: reducedMotion === false ? "smooth" : "auto", block: "start" });
  window.history.pushState(window.history.state, "", hash);
  return true;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => false);
}
