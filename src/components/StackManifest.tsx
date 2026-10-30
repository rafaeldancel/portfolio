"use client";

import type { CSSProperties } from "react";
import { stack } from "@/content";
import { useHighlight } from "@/lib/highlight-context";
import { iconHoverColor, stackIcons } from "@/lib/stack-icons";
import styles from "@/components/StackManifest.module.css";

export function StackManifest() {
  const { setHoveredTech, setFocusedTech } = useHighlight();
  return (
    <dl className="stack-manifest">
      {Object.entries(stack).map(([group, items]) => (
        <div className="manifest-row" key={group}>
          <dt>{group}</dt>
          <dd>
            <ul className="token-list">
              {items.map((item) => {
                const definition = stackIcons[item];
                const Icon = definition?.Icon;
                return (
                  <li key={item}>
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
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
