"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { profile, siteContent } from "@/content";
import { scrollToHash } from "@/lib/navigation";
import { useReducedMotion } from "@/lib/useReducedMotion";

const loadDialog = () => import("@/components/CommandPaletteDialog");
// cmdk and its Radix dialog stay out of the initial bundle: they load when the
// browser is idle, or on the first open if that comes sooner.
// React.lazy, not next/dynamic: it only ever renders after a client interaction,
// so SSR handling is not needed and the extra loader runtime is not shipped.
const CommandPaletteDialog = lazy(loadDialog);

const copiedHold = 700;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const reducedMotion = useReducedMotion();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const trigger = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // cmdk's dialog has no Radix trigger, so Radix cannot restore focus on close. Remember it here.
  const show = useCallback((next: boolean) => {
    if (next && !open) {
      const active = document.activeElement;
      returnFocus.current = active instanceof HTMLElement && active !== document.body ? active : trigger.current;
      // Reopening during the close animation would otherwise keep the last search.
      setSearch("");
      setMounted(true);
    }
    setOpen(next);
  }, [open]);

  useEffect(() => {
    const preload = () => void loadDialog();
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(preload, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(preload, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      show(!open);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, show]);

  useEffect(() => {
    if (open) return;
    clearTimeout(closeTimer.current);
    setCopied(false);
    const target = returnFocus.current;
    returnFocus.current = null;
    // preventScroll: a command may have just scrolled the page somewhere else.
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function run(action: () => void) {
    show(false);
    action();
  }

  // Open synchronously, inside the user's gesture, so popup blockers allow it.
  function openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    show(false);
  }

  function openProject(id: string) {
    const hash = `#work-${id}`;
    // Setting the hash fires hashchange, which the carousel uses to pick the slide.
    if (window.location.hash === hash) scrollToHash("#work", reducedMotion);
    else window.location.hash = hash;
  }

  function copyEmail() {
    void navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true);
      closeTimer.current = setTimeout(() => show(false), copiedHold);
    }, () => show(false));
  }

  return (
    <>
      <button ref={trigger} type="button" className="command-hint" aria-haspopup="dialog" aria-expanded={open} aria-keyshortcuts="Meta+K Control+K" onClick={() => show(true)}>
        {/* The glyph alone is not a name; the accessible name is the hidden text. */}
        <span aria-hidden="true">{siteContent.commandHint}</span>
        <span className="sr-only">{siteContent.commandHintLabel}</span>
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <CommandPaletteDialog
            open={open}
            onOpenChange={show}
            search={search}
            onSearchChange={setSearch}
            copied={copied}
            onSection={(id) => run(() => scrollToHash(`#${id}`, reducedMotion))}
            onProject={(id) => run(() => openProject(id))}
            onCopyEmail={copyEmail}
            onExternal={openExternal}
          />
        </Suspense>
      )}
    </>
  );
}
