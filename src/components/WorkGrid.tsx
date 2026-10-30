"use client";

import { work } from "@/content";
import { WorkCard } from "@/components/WorkCard";
import { matchesWorkStack, useHighlight } from "@/lib/highlight-context";

export function WorkGrid() {
  const { activeTech } = useHighlight();
  return <div className="work-grid">{work.map((item) => <WorkCard key={item.id} item={item} highlighted={matchesWorkStack(activeTech, item.stack)} />)}</div>;
}
