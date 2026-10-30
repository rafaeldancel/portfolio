"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
import { animate, cubicBezier, useInView, useMotionValue, useScroll, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionEase, useActiveWillChange, useSmoothScrollProgress } from "@/lib/scroll-motion";

export const printTiming = { line: 0.8, stagger: 0.22, character: 0.045, reveal: 0.6, settle: 180, token: 0.03 } as const;

type PrintTimeline = Readonly<{
  items: number;
  lineScale: MotionValue<number> | number;
  lineWillChange: MotionValue<string>;
  reducedMotion: boolean | null;
}>;

const PrintContext = createContext<PrintTimeline | null>(null);

// Reveals complete when an element's top reaches 85% of the viewport.
const revealEnd = 0.85;

// Scroll progress for the reveal, rescaled so it still reaches 1 at the bottom
// of the page when the document is too short for the element to hit `revealEnd`.
function useRevealProgress(target: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", `start ${revealEnd * 100}%`] });
  const reach = useMotionValue(1);

  useEffect(() => {
    const measure = () => {
      const element = target.current;
      if (!element) return;
      const viewport = window.innerHeight;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - viewport;
      const reachable = (maxScroll - (top - viewport)) / (viewport * (1 - revealEnd));
      reach.set(Math.min(1, Math.max(0.001, reachable)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reach, target]);

  const progress = useTransform(() => Math.min(1, scrollYProgress.get() / reach.get()));
  return { scrollYProgress, progress };
}

export function usePrintInTimeline(target: RefObject<HTMLElement | null>, items: number) {
  const { progress: revealProgress } = useRevealProgress(target);
  const progress = useSmoothScrollProgress(revealProgress);
  const duration = Math.max(printTiming.line, printTiming.reveal + Math.max(0, items - 1) * printTiming.stagger);
  // Scroll supplies the clock: these durations set relative pacing, not a timer.
  const lineScale = useTransform(progress, [0, printTiming.line / duration], [0, 1]);
  const reducedMotion = useReducedMotion();
  const lineWillChange = useActiveWillChange(progress, "transform", reducedMotion === false);

  return useMemo(() => ({ items, lineScale: reducedMotion === false ? lineScale : 1, lineWillChange, reducedMotion }), [items, lineScale, lineWillChange, reducedMotion]);
}

export function PrintInProvider({ timeline, children }: { timeline: PrintTimeline; children: ReactNode }) {
  return <PrintContext.Provider value={timeline}>{children}</PrintContext.Provider>;
}

// Experience and Stack share the same reveal; Work can opt in later.
export function usePrintInRow(target: RefObject<HTMLElement | null>, index: number, hash = "") {
  const timeline = useContext(PrintContext);
  if (!timeline) throw new Error("usePrintInRow requires a print-enabled Section");
  // Measure the stationary row; transforms belong on its inner wrapper so they
  // cannot change the scroll/viewport measurements that drive the animation.
  const { scrollYProgress, progress: reachableProgress } = useRevealProgress(target);
  const progress = useSmoothScrollProgress(reachableProgress);
  const duration = printTiming.reveal + Math.max(0, timeline.items - 1) * printTiming.stagger;
  const start = index * printTiming.stagger / duration;
  const end = (index * printTiming.stagger + printTiming.reveal) / duration;
  const revealProgress = useTransform(progress, [start, end], [0, 1]);
  const clipPath = useTransform(revealProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const opacity = useTransform(progress, [0, 1], [0.3, 1]);
  const y = useTransform(progress, [0, 1], [16, 0]);
  const characters = useMotionValue(hash.length);
  const typedHash = useTransform(characters, (count) => hash.slice(0, Math.floor(count + 0.000001)));
  const inView = useInView(target, { amount: "some", once: false });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (timeline.reducedMotion === null) return;
    if (timeline.reducedMotion || !hash.length) {
      characters.set(hash.length);
      return;
    }
    // `some` stays true until the entire row leaves either viewport edge.
    characters.set(0);
    if (!inView) return;
    let timer: ReturnType<typeof setTimeout>;
    let playback: AnimationPlaybackControls | undefined;
    let started = false;
    const schedule = () => {
      if (started) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (progress.isAnimating()) return;
        started = true;
        playback = animate(characters, hash.length, {
          duration: hash.length * printTiming.character,
          delay: index * printTiming.stagger,
          ease: motionEase,
        });
      }, printTiming.settle);
    };
    schedule();
    const subscriptions = [scrollYProgress.on("change", schedule), progress.on("animationComplete", schedule)];
    return () => {
      clearTimeout(timer);
      subscriptions.forEach((unsubscribe) => unsubscribe());
      playback?.stop();
    };
  }, [characters, hash.length, inView, index, progress, scrollYProgress, timeline.reducedMotion]);

  const showFinal = timeline.reducedMotion !== false || focused;
  const willChange = useActiveWillChange(progress, "transform, opacity", !showFinal);
  const clipWillChange = useActiveWillChange(progress, "clip-path", !showFinal);
  return {
    progress,
    revealProgress,
    showFinal,
    willChange,
    clipWillChange,
    typedHash: showFinal ? hash : typedHash,
    clipPath: showFinal ? "inset(0 0% 0 0)" : clipPath,
    opacity: showFinal ? 1 : opacity,
    y: showFinal ? 0 : y,
    finish: () => setFocused(true),
    resume: () => setFocused(false),
  };
}

export function usePrintInToken(row: ReturnType<typeof usePrintInRow>, index: number, count: number) {
  // Preserve the 30ms stagger's proportions on the reversible scroll clock.
  const duration = 0.18 + Math.max(0, count - 1) * printTiming.token;
  const start = index * printTiming.token / duration;
  const end = (index * printTiming.token + 0.18) / duration;
  const opacity = useTransform(row.revealProgress, [start, end], [0, 1], { ease: cubicBezier(...motionEase) });
  const willChange = useActiveWillChange(row.progress, "opacity", !row.showFinal);
  return { opacity: row.showFinal ? 1 : opacity, willChange };
}
