"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { profile, sections, siteContent } from "@/content";
import { projects } from "@/components/WorkGrid";
import { scrollToHash } from "@/lib/navigation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/CommandPalette.module.css";

const copiedHold = 700;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
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
    }
    setOpen(next);
  }, [open]);

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
      <button ref={trigger} type="button" className="command-hint" aria-label={siteContent.commandHintLabel} aria-haspopup="dialog" aria-expanded={open} onClick={() => show(true)}>
        {siteContent.commandHint}
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={show}
        label={siteContent.paletteLabel}
        loop
        overlayClassName={styles.overlay}
        contentClassName={styles.dialog}
        className={styles.command}
      >
        <Command.Input className={styles.input} placeholder={siteContent.palettePlaceholder} value={search} onValueChange={setSearch} />
        <Command.List className={styles.list}>
          <Command.Empty className={styles.empty}>{siteContent.paletteEmpty}</Command.Empty>
          <Command.Group heading={siteContent.paletteNavigate} className={styles.group}>
            {sections.map((section) => (
              <Command.Item key={section.id} value={`${siteContent.paletteNavigate} ${section.label}`} className={styles.item} onSelect={() => run(() => scrollToHash(`#${section.id}`, reducedMotion))}>
                <span className={styles.index}>{section.index}</span>{section.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={siteContent.paletteProjects} className={styles.group}>
            {projects.map((project, index) => (
              <Command.Item key={project.id} value={`${siteContent.paletteProjects} ${project.title}`} className={styles.item} onSelect={() => run(() => openProject(project.id))}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>{project.title}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={siteContent.paletteActions} className={styles.group}>
            <Command.Item value={siteContent.copyEmailLabel} className={styles.item} onSelect={copyEmail}>
              {siteContent.copyEmailLabel}
              <span className={styles.meta}>{copied ? siteContent.copiedLabel : profile.email}</span>
            </Command.Item>
            <Command.Item value={siteContent.openLinkedinLabel} className={styles.item} onSelect={() => openExternal(profile.linkedin)}>
              {siteContent.openLinkedinLabel}
            </Command.Item>
            <Command.Item value={siteContent.openGithubLabel} className={styles.item} onSelect={() => openExternal(profile.github)}>
              {siteContent.openGithubLabel}
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
