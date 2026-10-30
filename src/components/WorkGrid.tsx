"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { sections, work } from "@/content";
import { WorkCard } from "@/components/WorkCard";
import { matchesWorkStack, useHighlight } from "@/lib/highlight-context";
import { motionEase } from "@/lib/scroll-motion";
import { usePrintInRow } from "@/lib/usePrintIn";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/WorkCarousel.module.css";

export const projects = ["vestra", "a", "logos"]
  .map((id) => work.find((item) => item.id === id)!)
  .filter((item) => !item.hidden);
const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: motionEase } },
  exit: (direction: number) => ({ x: direction * -48, opacity: 0, transition: { duration: 0.45, ease: motionEase } }),
};
const counterVariants: Variants = {
  enter: (direction: number) => ({ y: direction * 20 }),
  center: { y: 0 },
  exit: (direction: number) => ({ y: direction * -20 }),
};

export function WorkGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const row = usePrintInRow(ref, 0);
  const inView = useInView(ref, { once: true, amount: "some" });
  const reducedMotion = useReducedMotion();
  const animated = reducedMotion === false;
  const { activeTech } = useHighlight();
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 1 });
  const item = projects[index];

  useEffect(() => {
    const readHash = () => {
      const next = projects.findIndex((project) => `#work-${project.id}` === window.location.hash);
      if (next < 0) return;
      setSlide((current) => current.index === next ? current : { index: next, direction: next > current.index ? 1 : -1 });
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, []);

  function select(next: number, nextDirection: number) {
    const nextIndex = (next + projects.length) % projects.length;
    if (nextIndex === index) return;
    // A link in the outgoing slide must not leave focus in a removed node.
    const focusedSlide = document.activeElement?.closest("[data-work-slide]");
    if (focusedSlide && ref.current?.contains(focusedSlide)) ref.current.focus({ preventScroll: true });
    setSlide({ index: nextIndex, direction: nextDirection });
    window.history.replaceState(window.history.state, "", `#work-${projects[nextIndex].id}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    select(index + step, step);
  }

  return (
    <div
      ref={ref}
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="work-heading"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocusCapture={row.finish}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) row.resume(); }}
    >
      <motion.div style={{ opacity: row.opacity, y: row.y, clipPath: row.clipPath, willChange: row.willChange }}>
        <div className={styles.controls}>
          <div className={styles.pager} role="group" aria-label={sections.find(({ id }) => id === "work")?.label}>
            {projects.map((project, projectIndex) => (
              <button
                key={project.id}
                type="button"
                className={styles.pagerButton}
                aria-label={project.title}
                aria-current={index === projectIndex ? "true" : undefined}
                aria-controls="work-slide"
                data-highlighted={matchesWorkStack(activeTech, project.stack) ? "true" : undefined}
                onClick={() => select(projectIndex, projectIndex > index ? 1 : -1)}
              ><span className={styles.dot} /></button>
            ))}
          </div>
          <div className={styles.navigation}>
            <button type="button" className={styles.arrow} aria-label="Previous project" aria-controls="work-slide" onClick={() => select(index - 1, -1)}>‹</button>
            <span className={styles.counter} aria-hidden="true">
              <span className={styles.digit}>
                <AnimatePresence key={animated ? "animated" : "instant"} initial={false} custom={direction}>
                  <motion.span
                    key={index}
                    custom={direction}
                    variants={animated ? counterVariants : undefined}
                    initial={animated ? "enter" : false}
                    animate="center"
                    exit={animated ? "exit" : undefined}
                    transition={{ duration: animated ? 0.45 : 0, ease: motionEase }}
                  >{index + 1}</motion.span>
                </AnimatePresence>
              </span>
              <span> / {projects.length}</span>
            </span>
            <button type="button" className={styles.arrow} aria-label="Next project" aria-controls="work-slide" onClick={() => select(index + 1, 1)}>›</button>
          </div>
        </div>
        <div id="work-slide" className={styles.viewport}>
          {projects.map((project) => <span key={project.id} id={`work-${project.id}`} className={styles.anchor} aria-hidden="true" />)}
          {/* All copies share a grid cell. The tallest reserves height even on
              the server, across fonts/breakpoints, without a measuring effect. */}
          {projects.map((project, projectIndex) => (
            <div className={styles.sizer} aria-hidden="true" inert key={project.id}>
              <WorkCard item={project} index={projectIndex} total={projects.length} measuring />
            </div>
          ))}
          <AnimatePresence key={animated ? "animated" : "instant"} initial={animated} custom={direction}>
            <motion.div
              key={item.id}
              data-work-slide={item.id}
              className={styles.slide}
              custom={direction}
              variants={animated ? slideVariants : undefined}
              initial={animated ? "enter" : false}
              animate={animated && !inView ? "enter" : "center"}
              exit={animated ? "exit" : undefined}
              drag={animated ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) < 50) return;
                const step = info.offset.x < 0 ? 1 : -1;
                select(index + step, step);
              }}
              onPanEnd={animated ? undefined : (_, info) => {
                if (Math.abs(info.offset.x) < 50 || Math.abs(info.offset.x) <= Math.abs(info.offset.y)) return;
                const step = info.offset.x < 0 ? 1 : -1;
                select(index + step, step);
              }}
            >
              <WorkCard item={item} index={index} total={projects.length} active={inView} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">{index + 1} / {projects.length}: {item.title}</p>
      </motion.div>
    </div>
  );
}
