"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView, type Variants } from "motion/react";
import { education, experience } from "@/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/ExperienceLog.module.css";

function commitId(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

const entrance: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: (index: number) => ({ opacity: 1, y: 0, transition: { duration: 0.2, delay: index * 0.06, ease: "easeOut" } }),
};

function ExperienceRow({ entry, index }: { entry: (typeof experience)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
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
    if (!inView) {
      controls.set("hidden");
      return;
    }
    let cancelled = false;
    void controls.start("visible").then(() => { if (!cancelled) entered.current = true; });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [controls, inView, reducedMotion]);

  return (
    <motion.li
      ref={ref}
      className={`experience-row ${styles.row}`}
      tabIndex={0}
      initial={false}
      animate={controls}
      variants={entrance}
      custom={index}
      onFocus={() => { entered.current = true; controls.stop(); controls.set("visible"); }}
    >
      <span className={`commit-id ${styles.hash}`} aria-hidden="true">{commitId(`${entry.role}:${entry.org}:${entry.range}`)}</span>
      <p className="experience-range">{entry.range}</p>
      <div className="experience-copy">
        <h3>{entry.role}</h3>
        <p className="experience-org">{entry.org}</p>
        <p className="experience-note">{entry.note}</p>
      </div>
    </motion.li>
  );
}

export function ExperienceLog() {
  return (
    <div className="experience-content">
      <ol className="experience-log">
        {experience.map((entry, index) => <ExperienceRow key={`${entry.org}-${entry.role}`} entry={entry} index={index} />)}
      </ol>
      <div className="education-row">
        <p className="experience-range">{education.range}</p>
        <div>
          <h3>{education.degree}</h3>
          <p className="experience-org">{education.school}</p>
          <p className="education-honor">{education.honor}</p>
        </div>
      </div>
    </div>
  );
}
