"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion, useInView, useTransform } from "motion/react";
import { siteContent, stack } from "@/content";
import { matchesWorkStack, useHighlight } from "@/lib/highlight-context";
import { projects } from "@/lib/projects";
import { iconHoverColor, stackIcons } from "@/lib/stack-icons";
import { usePrintInRow, usePrintInToken } from "@/lib/usePrintIn";
import { usePageVisible } from "@/lib/navigation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/StackManifest.module.css";

const tooltipEdge = 16;
// One group row at a time: four rows at 2.5s each is a ~10s pass.
const scanRowDuration = 2.5;
const scanTail = 24;
const scanEdgeFade = 0.06;

function usedIn(item: string) {
  const titles = projects.filter((project) => matchesWorkStack(item, project.stack)).map((project) => project.title);
  return `${siteContent.usedInLabel} ${titles.length ? titles.join(" · ") : siteContent.usedInNone}`;
}

function StackToken({ item, index, count, row }: {
  item: string;
  index: number;
  count: number;
  row: ReturnType<typeof usePrintInRow>;
}) {
  const { activeTech, setHoveredTech, setFocusedTech } = useHighlight();
  const style = usePrintInToken(row, index, count);
  const definition = stackIcons[item];
  const Icon = definition?.Icon;
  const tooltipId = useId();
  const tooltip = useRef<HTMLSpanElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [shift, setShift] = useState(0);
  const active = activeTech === item;
  const showTooltip = active && !dismissed;

  // Keep the tooltip inside the viewport near either edge; never cause horizontal scroll.
  useLayoutEffect(() => {
    if (!showTooltip || !tooltip.current) return;
    const rect = tooltip.current.getBoundingClientRect();
    const left = rect.left - shift;
    const right = rect.right - shift;
    const viewport = document.documentElement.clientWidth;
    setShift(right > viewport - tooltipEdge ? viewport - tooltipEdge - right : left < tooltipEdge ? tooltipEdge - left : 0);
  }, [showTooltip, shift]);

  // Esc dismisses for hover and keyboard focus alike, until the token is entered again.
  useEffect(() => {
    if (!showTooltip) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDismissed(true);
      setHoveredTech((current) => current === item ? null : current);
      setFocusedTech((current) => current === item ? null : current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, setFocusedTech, setHoveredTech, showTooltip]);

  return (
    <motion.li style={style} className={styles.item} data-active={active ? "true" : undefined}>
      <button
        type="button"
        className={`stack-token ${styles.token}`}
        style={definition ? { "--brand-color": iconHoverColor(definition.color) } as CSSProperties : undefined}
        aria-describedby={tooltipId}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          setDismissed(false);
          setHoveredTech(item);
        }}
        onPointerLeave={() => setHoveredTech((current) => current === item ? null : current)}
        onFocus={() => {
          setDismissed(false);
          setFocusedTech(item);
        }}
        onBlur={() => setFocusedTech((current) => current === item ? null : current)}
      >
        {Icon && (
          <span className={styles.iconStack} aria-hidden="true">
            <Icon size={15} className={styles.icon} focusable="false" />
            {/* Brand-colored copy the scanner fades in; opacity only. */}
            <Icon size={15} className={styles.iconLit} focusable="false" />
          </span>
        )}
        <span>{item}</span>
      </button>
      <span
        ref={tooltip}
        id={tooltipId}
        role="tooltip"
        className={styles.tooltip}
        style={{ "--tooltip-shift": `${shift}px` } as CSSProperties}
        hidden={!showTooltip}
      >{usedIn(item)}</span>
    </motion.li>
  );
}

function ManifestRow({ group, items, index }: { group: string; items: readonly string[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const row = usePrintInRow(ref, index);
  // Unclip once printed, so token tooltips can rise above the row.
  const clipPath = useTransform(row.revealProgress, (progress) => progress >= 0.995 ? "none" : `inset(0 ${(1 - progress) * 100}% 0 0)`);
  const style = { opacity: row.opacity, y: row.y, clipPath: row.showFinal ? "none" : clipPath, willChange: row.showFinal ? "auto" : row.willChange };
  return (
    <div
      ref={ref}
      className="manifest-row"
      data-manifest-row={group}
      onFocusCapture={row.finish}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) row.resume(); }}
    >
      <motion.dt style={style}>{group}</motion.dt>
      <motion.dd style={style} className={styles.group}>
        <span className={styles.scan} aria-hidden="true" data-scan-track><span className={styles.scanLine} /></span>
        <ul className="token-list">
          {items.map((item, tokenIndex) => <StackToken key={item} item={item} index={tokenIndex} count={items.length} row={row} />)}
        </ul>
      </motion.dd>
    </div>
  );
}

// A 1px amber line sweeps each group row in turn; tokens it crosses light up.
// Positions are written to the DOM in rAF, never React state.
function useStackScanner(manifest: RefObject<HTMLDListElement | null>, paused: boolean) {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(manifest, { amount: "some" });
  const elapsed = useRef(0);
  const running = reducedMotion === false && pageVisible && inView && !paused;

  useEffect(() => {
    const root = manifest.current;
    if (!root || reducedMotion !== false) return;
    const clearLit = () => root.querySelectorAll<HTMLElement>("[data-scanned]").forEach((token) => delete token.dataset.scanned);
    if (!running) {
      clearLit();
      return;
    }
    const tracks = [...root.querySelectorAll<HTMLElement>("[data-scan-track]")];
    const lines = tracks.map((track) => track.firstElementChild as HTMLElement);
    let tokens: { element: HTMLElement; left: number; right: number }[] = [];
    let width = 0;
    let activeRow = -1;
    let last = performance.now();
    let frame = 0;

    // Measured once per row, so font loading or resizes are picked up next sweep.
    const measure = (row: number) => {
      const box = tracks[row].getBoundingClientRect();
      width = box.width;
      tokens = [...tracks[row].parentElement!.querySelectorAll<HTMLElement>(".stack-token")].map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, left: rect.left - box.left, right: rect.right - box.left };
      });
    };
    const tick = (now: number) => {
      // The first frame's timestamp can predate `last`; long gaps would skip rows.
      elapsed.current += Math.min(Math.max(0, now - last), 100) / 1000;
      last = now;
      const pass = elapsed.current / scanRowDuration;
      const row = Math.floor(pass) % tracks.length;
      const t = pass % 1;
      if (row !== activeRow) {
        clearLit();
        lines.forEach((line, index) => { if (index !== row) line.style.opacity = "0"; });
        activeRow = row;
        measure(row);
      }
      const x = t * width;
      lines[row].style.transform = `translate3d(${x - scanTail - 1}px, 0, 0)`;
      lines[row].style.opacity = String(Math.min(1, t / scanEdgeFade, (1 - t) / scanEdgeFade));
      for (const token of tokens) {
        const lit = x >= token.left && x <= token.right;
        if (lit !== ("scanned" in token.element.dataset)) {
          if (lit) token.element.dataset.scanned = "";
          else delete token.element.dataset.scanned;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [manifest, reducedMotion, running]);
}

export function StackManifest() {
  const { activeTech } = useHighlight();
  const ref = useRef<HTMLDListElement>(null);
  useStackScanner(ref, activeTech !== null);
  return (
    <dl ref={ref} className={`stack-manifest ${styles.manifest}`} data-active={activeTech ? "true" : undefined}>
      {Object.entries(stack).map(([group, items], index) => <ManifestRow key={group} group={group} items={items} index={index} />)}
    </dl>
  );
}
