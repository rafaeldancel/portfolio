"use client";

import { motion, useIsPresent, type Variants } from "motion/react";
import { siteContent, type WorkItem } from "@/content";
import { ExternalArrow } from "@/components/ExternalArrow";
import { MetricDelta } from "@/components/MetricDelta";
import { matchesWorkStack, useHighlight } from "@/lib/highlight-context";
import { motionEase } from "@/lib/scroll-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/WorkCarousel.module.css";

const printVariants: Variants = {
  enter: { opacity: 0, y: 12, clipPath: "inset(0 100% 0 0)" },
  center: (delay: number) => ({ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", transition: { duration: 0.4, delay, ease: motionEase } }),
};
const titleVariants: Variants = {
  enter: { clipPath: "inset(0 100% 0 0)" },
  center: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.45, delay: 0.06, ease: motionEase } },
};
const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: (delay: number) => ({ opacity: 1, transition: { duration: 0.3, delay, ease: motionEase } }),
};

export function WorkCard({ item, index, total, active = false, measuring = false }: {
  item: WorkItem;
  index: number;
  total: number;
  active?: boolean;
  measuring?: boolean;
}) {
  const { activeTech } = useHighlight();
  const reducedMotion = useReducedMotion();
  const present = useIsPresent();
  const animated = reducedMotion === false && !measuring;
  const pointsDelay = item.metric ? 0.24 : 0.18;
  const stackDelay = pointsDelay + item.points.length * 0.06;
  const linksDelay = stackDelay + item.stack.length * 0.025 + 0.06;

  return (
    <article
      className={styles.card}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}: ${item.title}`}
      aria-labelledby={measuring ? undefined : `work-${item.id}-title`}
      aria-hidden={!present || measuring ? true : undefined}
      inert={!present || measuring ? true : undefined}
      data-highlighted={matchesWorkStack(activeTech, item.stack) ? "true" : undefined}
    >
      <motion.div className={styles.label} variants={animated ? fadeVariants : undefined} custom={0}>
        <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <p>{item.kind}</p>
      </motion.div>
      <div className={styles.summary}>
        <motion.h3 id={measuring ? undefined : `work-${item.id}-title`} className={styles.title} variants={animated ? titleVariants : undefined}>{item.title}</motion.h3>
        <motion.p className={styles.context} variants={animated ? fadeVariants : undefined} custom={0.12}>{item.context}</motion.p>
        {item.metric && (
          <motion.div className={styles.metricSlot} variants={animated ? fadeVariants : undefined} custom={0.18}>
            <MetricDelta {...item.metric} active={active} delay={0.18} instant={measuring} />
          </motion.div>
        )}
      </div>
      <div className={styles.details}>
        <ul className={styles.points}>
          {item.points.map((point, pointIndex) => (
            <li key={point}>
              <motion.div className={styles.point} variants={animated ? printVariants : undefined} custom={pointsDelay + pointIndex * 0.06}>
                <span className={styles.pointIndex} aria-hidden="true">{String(pointIndex + 1).padStart(2, "0")}</span>
                <span>{point}</span>
              </motion.div>
            </li>
          ))}
        </ul>
        <ul className={styles.tokens}>
          {item.stack.map((technology, tokenIndex) => (
            <motion.li
              key={technology}
              className={styles.token}
              data-highlighted={matchesWorkStack(activeTech, [technology]) ? "true" : undefined}
              variants={animated ? fadeVariants : undefined}
              custom={stackDelay + tokenIndex * 0.025}
            >{technology}</motion.li>
          ))}
        </ul>
        {(item.live || item.model || item.kind.includes("client")) && (
          <motion.div className={styles.links} variants={animated ? fadeVariants : undefined} custom={linksDelay}>
            {item.live?.startsWith("https://") && <a href={item.live}>{siteContent.liveLabel}<ExternalArrow /></a>}
            {item.model?.startsWith("https://") && <a href={item.model}>{siteContent.modelLabel}<ExternalArrow /></a>}
            {item.kind.includes("client") && <p className={styles.nda}>{siteContent.nda}</p>}
          </motion.div>
        )}
      </div>
    </article>
  );
}
