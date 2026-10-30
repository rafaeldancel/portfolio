"use client";

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type HighlightState = Readonly<{
  activeTech: string | null;
  setHoveredTech: Dispatch<SetStateAction<string | null>>;
  setFocusedTech: Dispatch<SetStateAction<string | null>>;
}>;

const HighlightContext = createContext<HighlightState | null>(null);

export function matchesWorkStack(activeTech: string | null, technologies: readonly string[]) {
  if (!activeTech) return false;
  const normalize = (value: string) => value.trim().toLowerCase();
  return technologies.some((technology) => normalize(technology) === normalize(activeTech));
}

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [focusedTech, setFocusedTech] = useState<string | null>(null);
  const value = useMemo(() => ({ activeTech: hoveredTech ?? focusedTech, setHoveredTech, setFocusedTech }), [hoveredTech, focusedTech]);
  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>;
}

export function useHighlight() {
  const state = useContext(HighlightContext);
  if (!state) throw new Error("useHighlight must be used within HighlightProvider");
  return state;
}
