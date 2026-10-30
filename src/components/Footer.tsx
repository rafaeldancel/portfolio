import { siteContent } from "@/content";

export function Footer() {
  return (
    <footer className="page-container footer">
      <p>{siteContent.footer}</p>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
