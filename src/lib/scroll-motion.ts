"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export const motionEase = [0.22, 1, 0.36, 1] as const;
const scrollSpring = { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.0001, restSpeed: 0.001 };

// Gate the spring's input, so reduced motion never starts a scroll animation.
// All dependent transforms share this one smoothed clock and settle together.
export function useSmoothScrollProgress(source: MotionValue<number>, finalState = 1) {
  const reducedMotion = useReducedMotion();
  const target = useMotionValue(finalState);
  const progress = useSpring(target, scrollSpring);

  useEffect(() => {
    const value = reducedMotion === false ? source.get() : finalState;
    target.jump(value);
    progress.jump(value);
    if (reducedMotion !== false) return;
    return source.on("change", (next) => target.set(next));
  }, [finalState, progress, reducedMotion, source, target]);

  return progress;
}

// Motion's built-in will-change retains its hint after completion. These hints
// live only for an active spring and update without rendering React each frame.
export function useActiveWillChange(source: MotionValue<number>, properties: string, enabled: boolean) {
  const hint = useMotionValue("auto");
  useEffect(() => {
    const clear = () => hint.set("auto");
    if (!enabled) {
      clear();
      return;
    }
    const start = () => hint.set(properties);
    if (source.isAnimating()) start();
    const subscriptions = [source.on("animationStart", start), source.on("animationComplete", clear), source.on("animationCancel", clear)];
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      clear();
    };
  }, [enabled, hint, properties, source]);
  return hint;
}
