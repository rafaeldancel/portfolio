"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useScroll, useTransform, type Variants } from "motion/react";
import { profile, siteContent } from "@/content";
import { PipelineLog } from "@/components/PipelineLog";
import { ExternalArrow } from "@/components/ExternalArrow";
import { useReducedMotion } from "@/lib/useReducedMotion";

const entrance: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const sequence: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const cueEntrance: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.5, ease: "easeOut" } },
};

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const exitY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const pipelineOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const reducedMotion = useReducedMotion();
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
      <motion.div className="hero-copy" initial={false} animate={controls} variants={sequence} style={{ y: reducedMotion === false ? exitY : 0, opacity: reducedMotion === false ? textOpacity : 1 }}>
        <motion.p className="mono-label" variants={entrance}>{siteContent.heroLabel}</motion.p>
        <motion.h1 id="page-title" variants={entrance} aria-label={profile.name}>
          {profile.name.split(" ").map((part, index) => <span key={part}>{index > 0 && " "}{part}</span>)}
        </motion.h1>
        <motion.p className="hero-role" variants={entrance}>{siteContent.heroTitle}</motion.p>
        <motion.p className="hero-specialties" variants={entrance}>{siteContent.specialties}</motion.p>
        <motion.div className="hero-links" variants={entrance}>
          <a className="action-link action-primary" href={`mailto:${profile.email}`}>{siteContent.emailLabel}<ExternalArrow /></a>
          <a className="action-link" href={profile.linkedin}>{siteContent.linkedinLabel}<ExternalArrow /></a>
          <a className="action-link" href={profile.github}>{siteContent.githubLabel}<ExternalArrow /></a>
        </motion.div>
      </motion.div>
      <PipelineLog opacity={reducedMotion === false ? pipelineOpacity : 1} />
      <motion.a className="hero-scroll-cue" href="#experience" initial={false} animate={controls} variants={cueEntrance}>
        {siteContent.heroScrollCue}
      </motion.a>
    </section>
  );
}
