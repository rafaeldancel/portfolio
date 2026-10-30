"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { pipelineRuns, siteContent, type PipelineJob, type PipelineLine } from "@/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/PipelineLog.module.css";

const lineStart = (index: number) => 0.15 + index * 0.9;
const countDelay = 0.12;
const countDuration = 0.65;
const holdDuration = 3;
const clearDuration = 0.2;
type Count = NonNullable<PipelineLine["count"]>;

const formatCount = (value: number, count: Count) => value.toFixed(count.precision ?? 0);

function NumberSlot({ count, children }: { count: Count; children: ReactNode }) {
  const from = formatCount(count.from, count);
  const to = formatCount(count.to, count);
  return (
    <span className={styles.number}>
      <span className={styles.numberWidth} aria-hidden="true">{from.length >= to.length ? from : to}</span>
      <span className={styles.numberValue}>{children}</span>
    </span>
  );
}

function FinalDetail({ line }: { line: PipelineLine }) {
  return line.count ? <>{line.count.prefix}<NumberSlot count={line.count}>{formatCount(line.count.to, line.count)}</NumberSlot>{line.count.suffix}</> : line.detail;
}

function FinalRun({ run }: { run: PipelineJob }) {
  return (
    <>
      <p className={styles.jobHeader}>{run.header}</p>
      <ol className="pipeline-log">
        {run.lines.map((line) => (
          <li key={line.verb} className="pipeline-row">
            <span className="pipeline-time">[{line.time}]</span>
            <span className="pipeline-verb">{line.verb}</span>
            <span className="pipeline-detail"><FinalDetail line={line} />{line.passed && <span className="pipeline-pass"> {siteContent.pipelineCheck}</span>}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

function CountingDetail({ count, clock, start }: { count: Count; clock: MotionValue<number>; start: number }) {
  const value = useTransform(clock, [start + countDelay, start + countDelay + countDuration], [count.from, count.to]);
  const formatted = useTransform(value, (current) => formatCount(current, count));
  return <>{count.prefix}<NumberSlot count={count}><motion.span>{formatted}</motion.span></NumberSlot>{count.suffix}</>;
}

function LogLine({ line, clock, index }: { line: PipelineLine; clock: MotionValue<number>; index: number }) {
  const start = lineStart(index);
  const visibility = useTransform(clock, (time) => time >= start ? "visible" : "hidden");
  const opacity = useTransform(clock, [start, start + 0.12], [0, 1]);
  const checkOpacity = useTransform(clock, [start + 0.35, start + 0.47], [0, 1]);

  return (
    <motion.li className="pipeline-row" style={{ visibility, opacity }}>
      <span className="pipeline-time">[{line.time}]</span>
      <span className="pipeline-verb">{line.verb}</span>
      <span className="pipeline-detail">
        {line.count ? <CountingDetail count={line.count} clock={clock} start={start} /> : line.detail}
        {line.passed && <motion.span className="pipeline-pass" style={{ opacity: checkOpacity }}> {siteContent.pipelineCheck}</motion.span>}
      </span>
    </motion.li>
  );
}

function RunPlayback({ run, animated, paused, onNext }: {
  run: PipelineJob;
  animated: boolean;
  paused: boolean;
  onNext: () => void;
}) {
  const playDuration = lineStart(run.lines.length - 1) + 0.6;
  const clearStart = playDuration + holdDuration;
  const totalDuration = clearStart + clearDuration;
  const clock = useMotionValue(animated ? 0 : playDuration);
  const opacity = useTransform(clock, [clearStart, totalDuration], [1, 0]);
  const cursorOpacity = useTransform(clock, (time) => !animated || Math.floor(time / 0.5) % 2 === 0 ? 1 : 0);

  useEffect(() => {
    if (!animated || paused) return;
    // Stopping preserves elapsed time. Resume only the remaining playback,
    // hold, and clear duration; there are no independent timers to drift.
    const remaining = totalDuration - clock.get();
    if (remaining <= 0) {
      onNext();
      return;
    }
    const playback = animate(clock, totalDuration, { duration: remaining, ease: "linear", onComplete: onNext });
    return () => playback.stop();
  }, [animated, paused, clock, totalDuration, onNext]);

  return (
    <>
      <div className="sr-only">
        <p>{run.header}</p>
        <ol>{run.lines.map((line) => <li key={line.verb}>[{line.time}] {line.verb} {line.detail}{line.passed && ` ${siteContent.pipelineCheck}`}</li>)}</ol>
      </div>
      <div className={styles.stage} data-pipeline-stage role="region" aria-label={run.header} tabIndex={0}>
        {/* Overlapping, hidden final runs reserve the larger responsive height.
            Number slots also reserve their widest value throughout counting. */}
        {pipelineRuns.map((job) => <div key={job.id} className={styles.measure} aria-hidden="true"><FinalRun run={job} /></div>)}
        <motion.div className={styles.active} data-pipeline-active={run.id} aria-hidden="true" style={{ opacity }}>
          <p className={styles.jobHeader}>{run.header}</p>
          <ol className="pipeline-log">
            {run.lines.map((line, lineIndex) => <LogLine key={line.verb} line={line} clock={clock} index={lineIndex} />)}
          </ol>
        </motion.div>
      </div>
      <motion.span className={`block-cursor ${styles.cursor}`} aria-hidden="true" style={{ opacity: cursorOpacity }} />
    </>
  );
}

function PipelinePlayer({ animated, paused }: { animated: boolean; paused: boolean }) {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((current) => (current + 1) % pipelineRuns.length), []);
  const previous = useCallback(() => setIndex((current) => (current + pipelineRuns.length - 1) % pipelineRuns.length), []);
  return (
    <div className={styles.player}>
      <RunPlayback key={index} run={pipelineRuns[index]} animated={animated} paused={paused} onNext={next} />
      <p className={styles.runStatus}>{siteContent.pipelineRunLabel} {index + 1} {siteContent.pipelineRunOf} {pipelineRuns.length}</p>
      <div className={styles.switcher} role="group" aria-label={siteContent.pipelineSwitcher}>
        <button type="button" onClick={previous} aria-label={siteContent.previousRun}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="m7.5 3-3 3 3 3" stroke="currentColor" strokeWidth="1" /></svg>
        </button>
        <span>{index + 1}/{pipelineRuns.length}</span>
        <button type="button" onClick={next} aria-label={siteContent.nextRun}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="m4.5 3 3 3-3 3" stroke="currentColor" strokeWidth="1" /></svg>
        </button>
      </div>
    </div>
  );
}

export function PipelineLog({ opacity = 1 }: { opacity?: number | MotionValue<number> } = {}) {
  const reducedMotion = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const animated = reducedMotion === false;
  const paused = !visible || hovered;

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={panel}
      className={`pipeline-panel ${styles.panel}`}
      style={{ opacity }}
      data-paused={paused}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <PipelinePlayer key={animated ? "animated" : "static"} animated={animated} paused={paused} />
    </motion.div>
  );
}
