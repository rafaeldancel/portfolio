"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { AnimatePresence, motion, useAnimationControls, useScroll, useTransform, type Variants } from "motion/react";
import { profile, siteContent } from "@/content";
import { PipelineLog } from "@/components/PipelineLog";
import { useReducedMotion } from "@/lib/useReducedMotion";
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

const titleVariants: Variants = {
  enter: { y: "100%", opacity: 0 },
  center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: motionEase } },
  exit: { y: "-100%", opacity: 0, transition: { duration: 0.5, ease: motionEase } },
};
const titleHold = 3000;
const titleSwap = 500;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function RotatingTitle() {
  const titles = siteContent.heroTitles;
  const reducedMotion = useReducedMotion();
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => false);
  const [index, setIndex] = useState(0);
  const rotating = reducedMotion === false;

  useEffect(() => {
    if (!rotating || !visible) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % titles.length), titleHold + titleSwap);
    return () => clearTimeout(timer);
  }, [index, rotating, titles.length, visible]);

  const title = rotating ? titles[index] : titles[0];
  const longest = titles.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <>
      <span className="sr-only">{titles[0]}</span>
      {/* Every title shares one grid cell sized by the longest, so swaps never shift layout. */}
      <span className="hero-role-rotator" aria-hidden="true">
        <span className="hero-role-sizer">{longest}</span>
        <AnimatePresence initial={false}>
          <motion.span key={title} className="hero-role-word" variants={titleVariants} initial="enter" animate="center" exit="exit">
            {title}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, reducedMotion: boolean | null) {
  const hash = event.currentTarget.hash;
  const target = document.querySelector(hash);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reducedMotion === false ? "smooth" : "auto", block: "start" });
  window.history.pushState(window.history.state, "", hash);
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
        <motion.p className="hero-role" variants={entrance}><RotatingTitle /></motion.p>
        <motion.p className="hero-specialties" variants={entrance}>{siteContent.specialties}</motion.p>
        <motion.div className="hero-links" variants={entrance}>
          <a className="action-link action-primary" href="#contact" onClick={(event) => scrollToSection(event, reducedMotion)}>{siteContent.connectLabel}</a>
          <a className="action-link" href="#work" onClick={(event) => scrollToSection(event, reducedMotion)}>{siteContent.viewWorkLabel}</a>
        </motion.div>
      </motion.div>
      <PipelineLog opacity={reducedMotion === false ? pipelineOpacity : 1} />
      <motion.a className="hero-scroll-cue" href="#experience" initial={false} animate={controls} variants={cueEntrance}>
        {siteContent.heroScrollCue}
      </motion.a>
    </section>
  );
}
