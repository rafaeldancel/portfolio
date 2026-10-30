import { sections, siteContent } from "@/content";
import { CommandPalette } from "@/components/CommandPalette";

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="page-container top-bar-inner">
        <a className="identity" href="#home">{siteContent.identity}</a>
        <nav className="section-nav">
          {sections.filter(({ nav }) => nav).map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="top-bar-status">
          <CommandPalette />
          <span className="availability"><span className="status-dot" aria-hidden="true" />{siteContent.available}</span>
        </div>
      </div>
    </header>
  );
}
