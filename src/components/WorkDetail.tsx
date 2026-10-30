import { siteContent, type WorkItem } from "@/content";

export function WorkDetail({ item }: { item: WorkItem }) {
  return (
    <div className="work-detail">
      <ul className="work-points">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
      {item.kind.includes("client") && <p className="nda-note">{siteContent.nda}</p>}
    </div>
  );
}
