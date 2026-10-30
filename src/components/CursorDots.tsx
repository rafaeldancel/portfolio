"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const finePointer = "(hover: hover) and (pointer: fine)";
// Touch devices never download the canvas code; the CSS dot grid stays.
// The server snapshot is false, so this only ever renders in the browser.
const CursorDotsCanvas = lazy(() => import("@/components/CursorDotsCanvas"));

function subscribePointer(onChange: () => void) {
  const media = window.matchMedia(finePointer);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function CursorDots() {
  const reducedMotion = useReducedMotion();
  const fine = useSyncExternalStore(subscribePointer, () => window.matchMedia(finePointer).matches, () => false);
  return fine && reducedMotion === false ? <Suspense fallback={null}><CursorDotsCanvas /></Suspense> : null;
}
