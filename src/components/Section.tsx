"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { PrintInProvider, usePrintInTimeline } from "@/lib/usePrintIn";

type SectionProps = Readonly<{
  id: string;
  index: string;
  label: string;
  children?: ReactNode;
  reveal?: "print";
  revealItems?: number;
}>;

function PrintSection({ id, index, label, children, revealItems = 1 }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const timeline = usePrintInTimeline(ref, revealItems);
  return (
    <PrintInProvider timeline={timeline}>
      <section ref={ref} id={id} aria-labelledby={`${id}-heading`} className="section-shell">
        <h2 id={`${id}-heading`} className="section-label">
          <span>{index} / {label}</span>
          <motion.span aria-hidden="true" className="section-line" style={{ scaleX: timeline.lineScale }} />
        </h2>
        <div className="section-body grid-12">{children}</div>
      </section>
    </PrintInProvider>
  );
}

export function Section({ id, index, label, children, reveal, revealItems }: SectionProps) {
  if (reveal === "print") return <PrintSection id={id} index={index} label={label} revealItems={revealItems}>{children}</PrintSection>;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="section-shell">
      <h2 id={`${id}-heading`} className="section-label">
        <span>{index} / {label}</span>
        <span aria-hidden="true" className="section-line" />
      </h2>
      <div className="section-body grid-12">{children}</div>
    </section>
  );
}
