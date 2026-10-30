"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { education, experience } from "@/content";
import { usePrintInRow } from "@/lib/usePrintIn";
import styles from "@/components/ExperienceLog.module.css";

function commitId(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

function PrintedRow({ hash, index, children }: { hash: string; index: number; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);
  const { typedHash, clipPath, opacity, y, willChange, clipWillChange, finish, resume } = usePrintInRow(ref, index, hash);
  return (
    <li ref={ref} className={styles.row} tabIndex={0} onFocus={finish} onBlur={resume} data-print-row={index}>
      <motion.div className={styles.motion} style={{ opacity, y, willChange }}>
        <motion.span className={`commit-id ${styles.hash}`} aria-hidden="true">{typedHash}</motion.span>
        <motion.div className={`experience-row ${styles.body}`} style={{ clipPath, willChange: clipWillChange }} data-print-body>
          {children}
        </motion.div>
      </motion.div>
    </li>
  );
}

function HashSlot({ hash }: { hash: string }) {
  return <span className={`commit-id ${styles.hashSlot}`} aria-hidden="true">{hash}</span>;
}

export function ExperienceLog() {
  return (
    <ol className="experience-log">
      {experience.map((entry, index) => {
        const hash = commitId(`${entry.role}:${entry.org}:${entry.range}`);
        return (
          <PrintedRow key={`${entry.org}-${entry.role}`} hash={hash} index={index}>
            <HashSlot hash={hash} />
            <p className="experience-range">{entry.range}</p>
            <div className="experience-copy">
              <h3>{entry.role}</h3>
              <p className="experience-org">{entry.org}</p>
              <p className="experience-note">{entry.note}</p>
            </div>
          </PrintedRow>
        );
      })}
    </ol>
  );
}

export function EducationLog() {
  const hash = commitId(`${education.degree}:${education.school}:${education.range}`);
  return (
    <ol className="experience-log">
      <PrintedRow hash={hash} index={0}>
        <HashSlot hash={hash} />
        <p className="experience-range">{education.range}</p>
        <div className="experience-copy">
          <h3>{education.degree}</h3>
          <p className="experience-org">{education.school}</p>
        </div>
      </PrintedRow>
    </ol>
  );
}
