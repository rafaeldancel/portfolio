import { sections, siteContent } from "@/content";

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="page-container top-bar-inner">
        <a className="identity" href="#home">{siteContent.identity}</a>
        <nav className="section-nav">
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="top-bar-status">
          <kbd className="command-hint">{siteContent.commandHint}</kbd>
          <span className="availability"><span className="status-dot" aria-hidden="true" />{siteContent.available}</span>
        </div>
      </div>
    </header>
  );
}
