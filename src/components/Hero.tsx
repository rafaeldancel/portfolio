"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useAnimationControls, useScroll, useTransform, type Variants } from "motion/react";
import { profile, siteContent } from "@/content";
import { PipelineLog } from "@/components/PipelineLog";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollToHash, usePageVisible } from "@/lib/navigation";
import { motionEase, useActiveWillChange, useSmoothScrollProgress } from "@/lib/scroll-motion";

const entrance: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: motionEase } },
};

const sequence: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const cueEntrance: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.5, ease: motionEase } },
};

const typing = { char: 70, jitter: 20, delete: 35, hold: 2500, pause: 400 } as const;

type TypeState = Readonly<{
  title: number;
  length: number;
  phase: "typing" | "holding" | "deleting" | "pausing";
}>;

// One step of the type → hold → backspace → pause loop, with the delay before it.
function nextTypeStep({ title, length, phase }: TypeState, titles: readonly string[]): [number, TypeState] {
  const target = titles[title];
  switch (phase) {
    case "typing": {
      const delay = typing.char + (Math.random() * 2 - 1) * typing.jitter;
      return [delay, { title, length: length + 1, phase: length + 1 >= target.length ? "holding" : "typing" }];
    }
    case "holding":
      return [typing.hold, { title, length, phase: "deleting" }];
    case "deleting":
      return [typing.delete, { title, length: length - 1, phase: length - 1 <= 0 ? "pausing" : "deleting" }];
    case "pausing":
      return [typing.pause, { title: (title + 1) % titles.length, length: 0, phase: "typing" }];
  }
}

function TypewriterTitle() {
  const titles = siteContent.heroTitles;
  const reducedMotion = useReducedMotion();
  const visible = usePageVisible();
  // Start fully typed, so the server render, first paint and reduced motion all match.
  const [state, setState] = useState<TypeState>({ title: 0, length: titles[0].length, phase: "holding" });
  const animated = reducedMotion === false;

  useEffect(() => {
    if (!animated || !visible) return;
    const [delay, next] = nextTypeStep(state, titles);
    const timer = setTimeout(() => setState(next), delay);
    return () => clearTimeout(timer);
  }, [animated, state, titles, visible]);

  const typed = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);

  // While typing, the cursor sits at the start of its own box and follows the
  // text by transform only, so it never moves in layout (no layout shift).
  // ResizeObserver runs after layout and before paint, so it never lags a frame.
  useLayoutEffect(() => {
    const text = typed.current;
    if (!animated || !text) return;
    const observer = new ResizeObserver(([entry]) => {
      if (caret.current) caret.current.style.transform = `translateX(${entry.contentRect.width}px)`;
    });
    observer.observe(text);
    return () => observer.disconnect();
  }, [animated]);

  const text = animated ? titles[state.title].slice(0, state.length) : titles[0];
  const longest = titles.reduce((a, b) => (b.length > a.length ? b : a));
  const blinking = animated && state.phase === "holding";
  return (
    <>
      <span className="sr-only">{titles[0]}</span>
      {/* The typed line shares one grid cell with the longest title, so typing never shifts layout. */}
      <span className="hero-type" aria-hidden="true">
        <span className="hero-type-sizer">{longest}<span className="hero-type-cursor" /></span>
        <span ref={typed} className="hero-type-text">{text}{!animated && <span className="hero-type-cursor" />}</span>
        {animated && <span ref={caret} className="hero-type-caret"><span className="hero-type-cursor" data-blink={blinking ? "true" : undefined} /></span>}
      </span>
    </>
  );
}

function onSectionLink(event: MouseEvent<HTMLAnchorElement>, reducedMotion: boolean | null) {
  if (scrollToHash(event.currentTarget.hash, reducedMotion)) event.preventDefault();
}

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const progress = useSmoothScrollProgress(scrollYProgress, 0);
  const exitY = useTransform(progress, [0, 1], [0, -40]);
  const textOpacity = useTransform(progress, [0, 1], [1, 0.2]);
  const pipelineOpacity = useTransform(progress, [0, 1], [1, 0.4]);
  const reducedMotion = useReducedMotion();
  const willChange = useActiveWillChange(progress, "transform, opacity", reducedMotion === false);
  const controls = useAnimationControls();
  const entered = useRef(false);

  useEffect(() => {
    if (reducedMotion === null) return;
    if (reducedMotion || entered.current) {
      controls.set("visible");
      entered.current = true;
      return;
    }

    let cancelled = false;
    controls.set("hidden");
    void controls.start("visible").then(() => {
      if (!cancelled) entered.current = true;
    });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [controls, reducedMotion]);

  return (
    <section ref={hero} id="home" aria-labelledby="page-title" className="hero grid-12">
      <motion.div className="hero-copy" initial={false} animate={controls} variants={sequence} style={{ y: reducedMotion === false ? exitY : 0, opacity: reducedMotion === false ? textOpacity : 1, willChange }}>
        <motion.p className="mono-label" variants={entrance}>{siteContent.heroLabel}</motion.p>
        <motion.h1 id="page-title" variants={entrance} aria-label={profile.name}>
          {profile.name.split(" ").map((part, index) => <span key={part}>{index > 0 && " "}{part}</span>)}
        </motion.h1>
        <motion.p className="hero-role" variants={entrance}><TypewriterTitle /></motion.p>
        <motion.p className="hero-specialties" variants={entrance}>{siteContent.specialties}</motion.p>
        <motion.div className="hero-links" variants={entrance}>
          <a className="action-link action-primary" href="#contact" onClick={(event) => onSectionLink(event, reducedMotion)}>{siteContent.connectLabel}</a>
          <a className="action-link" href="#work" onClick={(event) => onSectionLink(event, reducedMotion)}>{siteContent.viewWorkLabel}</a>
        </motion.div>
      </motion.div>
      <PipelineLog opacity={reducedMotion === false ? pipelineOpacity : 1} />
      <motion.a className="hero-scroll-cue" href="#experience" initial={false} animate={controls} variants={cueEntrance}>
        {siteContent.heroScrollCue}
      </motion.a>
    </section>
  );
}
