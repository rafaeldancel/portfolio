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

function PrintedRow({ as: Root = "li", hash, index, educationRow = false, children }: {
  as?: "li" | "div";
  hash: string;
  index: number;
  educationRow?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement & HTMLDivElement>(null);
  const { typedHash, clipPath, opacity, y, finish, resume } = usePrintInRow(ref, index, hash);
  return (
    <Root ref={ref} className={styles.row} tabIndex={0} onFocus={finish} onBlur={resume} data-print-row={index}>
      <motion.div className={styles.motion} style={{ opacity, y }}>
        <motion.span className={`commit-id ${styles.hash}`} aria-hidden="true">{typedHash}</motion.span>
        <motion.div className={`${educationRow ? "education-row" : "experience-row"} ${styles.body}`} style={{ clipPath }} data-print-body>
          {children}
        </motion.div>
      </motion.div>
    </Root>
  );
}

function HashSlot({ hash }: { hash: string }) {
  return <span className={`commit-id ${styles.hashSlot}`} aria-hidden="true">{hash}</span>;
}

export function ExperienceLog() {
  const educationHash = commitId(`${education.degree}:${education.school}:${education.range}`);
  return (
    <div className="experience-content">
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
      <PrintedRow as="div" hash={educationHash} index={experience.length} educationRow>
        <div>
          <HashSlot hash={educationHash} />
          <p className="experience-range">{education.range}</p>
        </div>
        <div>
          <h3>{education.degree}</h3>
          <p className="experience-org">{education.school}</p>
          <p className="education-honor">{education.honor}</p>
        </div>
      </PrintedRow>
    </div>
  );
}
