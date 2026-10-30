"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import type { WorkMetric } from "@/content";
import { motionEase } from "@/lib/scroll-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/WorkCarousel.module.css";

export function MetricDelta({ from, to, value, unit, label, active = true, delay = 0, instant = false }: WorkMetric & {
  active?: boolean;
  delay?: number;
  instant?: boolean;
}) {
  const finalValue = to ?? value ?? 0;
  const initialValue = from ?? finalValue;
  const precision = Math.max(...[initialValue, finalValue].map((number) => String(number).split(".")[1]?.length ?? 0));
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(finalValue);
  const formatted = useTransform(count, (number) => number.toFixed(precision));
  const bar = useTransform(count, (number) => Math.max(0, Math.min(1, number / Math.max(initialValue, finalValue, 1e-9))));

  useEffect(() => {
    if (instant || reducedMotion !== false) {
      count.jump(finalValue);
      return;
    }
    count.jump(initialValue);
    if (!active) return;
    const playback = animate(count, finalValue, { duration: 0.85, delay, ease: motionEase });
    return () => playback.stop();
  }, [active, count, delay, finalValue, initialValue, instant, reducedMotion]);

  return (
    <div className={styles.metric}>
      <p className={styles.metricValue} aria-label={`${from !== undefined ? `${from} → ` : ""}${finalValue} ${unit}`}>
        {from !== undefined && <><span className={styles.metricFrom} aria-hidden="true">{from.toFixed(precision)}</span><span className={styles.metricArrow} aria-hidden="true">→</span></>}
        <motion.span className={styles.metricTo} aria-hidden="true" style={{ minWidth: `${Math.max(initialValue.toFixed(precision).length, finalValue.toFixed(precision).length)}ch` }}>{formatted}</motion.span>
      </p>
      <p className={styles.metricUnit}>{unit}</p>
      <div className={styles.metricTrack} aria-hidden="true"><motion.span style={{ scaleX: bar }} /></div>
      <p className={styles.metricLabel}>{label}</p>
    </div>
  );
}
