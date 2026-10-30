"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { pipeline, siteContent, type PipelineLine } from "@/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/PipelineLog.module.css";

const lineStart = (index: number) => 0.15 + index * 0.9;
const countDelay = 0.12;
const countDuration = 0.65;
const runDuration = lineStart(pipeline.length - 1) + 0.6;

function CountingDetail({ count, clock, start }: {
  count: NonNullable<PipelineLine["count"]>;
  clock: MotionValue<number>;
  start: number;
}) {
  const value = useTransform(clock, [start + countDelay, start + countDelay + countDuration], [count.from, count.to]);
  const rounded = useTransform(value, Math.round);

  return <>{count.prefix}<motion.span>{rounded}</motion.span>{count.suffix}</>;
}

function LogLine({ line, clock, index }: {
  line: PipelineLine;
  clock: MotionValue<number>;
  index: number;
}) {
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

function PipelineRun({ play }: { play: boolean }) {
  const clock = useMotionValue(play ? 0 : runDuration);

  useEffect(() => {
    if (!play) return;
    clock.set(0);
    const playback = animate(clock, runDuration, { duration: runDuration, ease: "linear" });
    return () => playback.stop();
  }, [clock, play]);

  return (
    <>
      {/* Hidden rows retain their final space, so replay cannot move the page. */}
      <ol className="pipeline-log" aria-hidden="true">
        {pipeline.map((line, index) => <LogLine key={line.verb} line={line} clock={clock} index={index} />)}
      </ol>
      <motion.span
        className="block-cursor"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: play ? [1, 1, 0, 0] : 1 }}
        transition={play ? { duration: 1, times: [0, 0.49, 0.5, 1], repeat: Infinity, ease: "linear" } : { duration: 0 }}
      />
    </>
  );
}

export function PipelineLog() {
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const play = reducedMotion === false;

  return (
    <div className={`pipeline-panel ${styles.panel}`}>
      {/* Screen readers get the final transcript without per-frame announcements. */}
      <ol className="sr-only">
        {pipeline.map((line) => <li key={line.verb}>[{line.time}] {line.verb} {line.detail}{line.passed && ` ${siteContent.pipelineCheck}`}</li>)}
      </ol>
      <PipelineRun key={`${play}-${run}`} play={play} />
      <button type="button" className={styles.replay} onClick={() => setRun((current) => current + 1)}>
        {siteContent.replay}
      </button>
    </div>
  );
}
