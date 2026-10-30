"use client";

import { Command } from "cmdk";
import { profile, sections, siteContent } from "@/content";
import { projects } from "@/lib/projects";
import styles from "@/components/CommandPalette.module.css";

// The cmdk dialog itself. CommandPalette owns all state and loads this on demand.
export default function CommandPaletteDialog({ open, onOpenChange, search, onSearchChange, copied, onSection, onProject, onCopyEmail, onExternal }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  copied: boolean;
  onSection: (id: string) => void;
  onProject: (id: string) => void;
  onCopyEmail: () => void;
  onExternal: (url: string) => void;
}) {
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label={siteContent.paletteLabel}
      loop
      overlayClassName={styles.overlay}
      contentClassName={styles.dialog}
      className={styles.command}
    >
      <Command.Input className={styles.input} placeholder={siteContent.palettePlaceholder} value={search} onValueChange={onSearchChange} />
      <Command.List className={styles.list}>
        <Command.Empty className={styles.empty}>{siteContent.paletteEmpty}</Command.Empty>
        <Command.Group heading={siteContent.paletteNavigate} className={styles.group}>
          {sections.map((section) => (
            <Command.Item key={section.id} value={`${siteContent.paletteNavigate} ${section.label}`} className={styles.item} onSelect={() => onSection(section.id)}>
              <span className={styles.index}>{section.index}</span>{section.label}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading={siteContent.paletteProjects} className={styles.group}>
          {projects.map((project, index) => (
            <Command.Item key={project.id} value={`${siteContent.paletteProjects} ${project.title}`} className={styles.item} onSelect={() => onProject(project.id)}>
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>{project.title}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading={siteContent.paletteActions} className={styles.group}>
          <Command.Item value={siteContent.copyEmailLabel} className={styles.item} onSelect={onCopyEmail}>
            {siteContent.copyEmailLabel}
            <span className={styles.meta}>{copied ? siteContent.copiedLabel : profile.email}</span>
          </Command.Item>
          <Command.Item value={siteContent.openLinkedinLabel} className={styles.item} onSelect={() => onExternal(profile.linkedin)}>
            {siteContent.openLinkedinLabel}
          </Command.Item>
          <Command.Item value={siteContent.openGithubLabel} className={styles.item} onSelect={() => onExternal(profile.github)}>
            {siteContent.openGithubLabel}
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
