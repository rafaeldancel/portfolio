"use client";

import { useRef, type CSSProperties } from "react";
import { motion } from "motion/react";
import { stack } from "@/content";
import { useHighlight } from "@/lib/highlight-context";
import { iconHoverColor, stackIcons } from "@/lib/stack-icons";
import { usePrintInRow, usePrintInToken } from "@/lib/usePrintIn";
import styles from "@/components/StackManifest.module.css";

function StackToken({ item, index, count, row }: {
  item: string;
  index: number;
  count: number;
  row: ReturnType<typeof usePrintInRow>;
}) {
  const { setHoveredTech, setFocusedTech } = useHighlight();
  const style = usePrintInToken(row, index, count);
  const definition = stackIcons[item];
  const Icon = definition?.Icon;
  return (
    <motion.li style={style}>
      <button
        type="button"
        className={`stack-token ${styles.token}`}
        style={definition ? { "--brand-color": iconHoverColor(definition.color) } as CSSProperties : undefined}
        onPointerEnter={(event) => { if (event.pointerType !== "touch") setHoveredTech(item); }}
        onPointerLeave={() => setHoveredTech((current) => current === item ? null : current)}
        onFocus={() => setFocusedTech(item)}
        onBlur={() => setFocusedTech((current) => current === item ? null : current)}
      >
        {Icon && <Icon size={15} className={styles.icon} aria-hidden="true" focusable="false" />}
        <span>{item}</span>
      </button>
    </motion.li>
  );
}

function ManifestRow({ group, items, index }: { group: string; items: readonly string[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const row = usePrintInRow(ref, index);
  const style = { opacity: row.opacity, y: row.y, clipPath: row.clipPath, willChange: row.showFinal ? "auto" : row.willChange };
  return (
    <div
      ref={ref}
      className="manifest-row"
      data-manifest-row={group}
      onFocusCapture={row.finish}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) row.resume(); }}
    >
      <motion.dt style={style}>{group}</motion.dt>
      <motion.dd style={style}>
        <ul className="token-list">
          {items.map((item, tokenIndex) => <StackToken key={item} item={item} index={tokenIndex} count={items.length} row={row} />)}
        </ul>
      </motion.dd>
    </div>
  );
}

export function StackManifest() {
  return (
    <dl className="stack-manifest">
      {Object.entries(stack).map(([group, items], index) => <ManifestRow key={group} group={group} items={items} index={index} />)}
    </dl>
  );
}
