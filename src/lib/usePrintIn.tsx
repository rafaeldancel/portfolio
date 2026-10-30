"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
import { animate, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export const printTiming = { line: 0.8, stagger: 0.22, character: 0.045, reveal: 0.6 } as const;

type PrintTimeline = Readonly<{
  items: number;
  lineScale: MotionValue<number> | number;
  reducedMotion: boolean | null;
}>;

const PrintContext = createContext<PrintTimeline | null>(null);

export function usePrintInTimeline(target: RefObject<HTMLElement | null>, items: number) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 60%"] });
  const duration = Math.max(printTiming.line, printTiming.reveal + Math.max(0, items - 1) * printTiming.stagger);
  // Scroll supplies the clock: these durations set relative pacing, not a timer.
  const lineScale = useTransform(scrollYProgress, [0, printTiming.line / duration], [0, 1]);
  const reducedMotion = useReducedMotion();

  return useMemo(() => ({ items, lineScale: reducedMotion === false ? lineScale : 1, reducedMotion }), [items, lineScale, reducedMotion]);
}

export function PrintInProvider({ timeline, children }: { timeline: PrintTimeline; children: ReactNode }) {
  return <PrintContext.Provider value={timeline}>{children}</PrintContext.Provider>;
}

// Shared by future Stack/Work entrances without enabling motion on them yet.
export function usePrintInRow(target: RefObject<HTMLElement | null>, index: number, hash: string) {
  const timeline = useContext(PrintContext);
  if (!timeline) throw new Error("usePrintInRow requires a print-enabled Section");
  // Measure the stationary row; transforms belong on its inner wrapper so they
  // cannot change the scroll/viewport measurements that drive the animation.
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 60%"] });
  const duration = printTiming.reveal + Math.max(0, timeline.items - 1) * printTiming.stagger;
  const start = index * printTiming.stagger / duration;
  const end = (index * printTiming.stagger + printTiming.reveal) / duration;
  const clipPath = useTransform(scrollYProgress, [start, end], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const characters = useMotionValue(hash.length);
  const typedHash = useTransform(characters, (count) => hash.slice(0, Math.floor(count + 0.000001)));
  const inView = useInView(target, { amount: "some", once: false });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (timeline.reducedMotion === null) return;
    if (timeline.reducedMotion) {
      characters.set(hash.length);
      return;
    }
    // `some` stays true until the entire row leaves either viewport edge.
    characters.set(0);
    if (!inView) return;
    const controls = animate(characters, hash.length, {
      duration: hash.length * printTiming.character,
      delay: index * printTiming.stagger,
      ease: "linear",
    });
    return () => controls.stop();
  }, [characters, hash.length, inView, index, timeline.reducedMotion]);

  const showFinal = timeline.reducedMotion !== false || focused;
  return {
    typedHash: showFinal ? hash : typedHash,
    clipPath: showFinal ? "inset(0 0% 0 0)" : clipPath,
    opacity: showFinal ? 1 : opacity,
    y: showFinal ? 0 : y,
    finish: () => setFocused(true),
    resume: () => setFocused(false),
  };
}
