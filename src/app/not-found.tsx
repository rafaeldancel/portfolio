import { notFoundContent } from "@/content";
import { RequestedPath } from "@/components/RequestedPath";

export default function NotFound() {
  return (
    <main id="main-content" className="page-container not-found" tabIndex={-1}>
      <h1><span className="not-found-error">{notFoundContent.error}</span> {notFoundContent.message}</h1>
      <p className="not-found-path">{notFoundContent.pathLabel} <RequestedPath /></p>
      {/* A full load home is fine from a 404; next/link here would add ~5 kB to the home page bundle. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="action-link not-found-home" href="/">{notFoundContent.home}</a>
    </main>
  );
}
