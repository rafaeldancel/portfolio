"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { animate, easeOut, useInView, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export const printTiming = { line: 0.4, stagger: 0.12, character: 0.025, reveal: 0.3 } as const;

type PrintTimeline = Readonly<{
  clock: MotionValue<number>;
  lineScale: MotionValue<number>;
  finish: () => void;
}>;

const PrintContext = createContext<PrintTimeline | null>(null);

export function usePrintInTimeline(target: RefObject<HTMLElement | null>, items: number, hashCharacters = 6) {
  const duration = printTiming.line + Math.max(0, items - 1) * printTiming.stagger + hashCharacters * printTiming.character + printTiming.reveal;
  const clock = useMotionValue(duration);
  const lineScale = useTransform(clock, [0, printTiming.line], [0, 1]);
  const reducedMotion = useReducedMotion();
  const inView = useInView(target, { amount: 0.25, once: true });
  const played = useRef(false);
  const playback = useRef<AnimationPlaybackControls | null>(null);

  const finish = useCallback(() => {
    playback.current?.stop();
    played.current = true;
    clock.set(duration);
  }, [clock, duration]);

  useEffect(() => {
    if (reducedMotion === null) return;
    if (reducedMotion || played.current) {
      finish();
      return;
    }
    if (!inView) {
      clock.set(0);
      return;
    }
    clock.set(0);
    const controls = animate(clock, duration, { duration, ease: "linear", onComplete: () => { played.current = true; } });
    playback.current = controls;
    return () => {
      controls.stop();
      if (playback.current === controls) playback.current = null;
    };
  }, [clock, duration, finish, inView, reducedMotion]);

  return useMemo(() => ({ clock, lineScale, finish }), [clock, lineScale, finish]);
}

export function PrintInProvider({ timeline, children }: { timeline: PrintTimeline; children: ReactNode }) {
  return <PrintContext.Provider value={timeline}>{children}</PrintContext.Provider>;
}

// Shared by future Stack/Work entrances without enabling motion on them yet.
export function usePrintInRow(index: number, hash: string) {
  const timeline = useContext(PrintContext);
  if (!timeline) throw new Error("usePrintInRow requires a print-enabled Section");
  const start = printTiming.line + index * printTiming.stagger;
  const revealStart = start + hash.length * printTiming.character;
  const typedHash = useTransform(timeline.clock, (time) => hash.slice(0, Math.max(0, Math.floor((time - start + 0.000001) / printTiming.character))));
  const clipPath = useTransform(timeline.clock, [revealStart, revealStart + printTiming.reveal], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], { ease: easeOut });
  return { typedHash, clipPath, finish: timeline.finish };
}
