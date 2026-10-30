import { siteContent, type WorkItem } from "@/content";
import { ExternalArrow } from "@/components/ExternalArrow";

export function WorkDetail({ item }: { item: WorkItem }) {
  return (
    <div className="work-detail">
      <ul className="work-points">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
      {(item.live || item.model) && (
        <div className="contact-links">
          {item.live?.startsWith("https://") && <a href={item.live}>{siteContent.liveLabel}<ExternalArrow /></a>}
          {item.model?.startsWith("https://") && <a href={item.model}>{siteContent.modelLabel}<ExternalArrow /></a>}
        </div>
      )}
      {item.kind.includes("client") && <p className="nda-note">{siteContent.nda}</p>}
    </div>
  );
}
